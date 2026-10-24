import base58 from "bs58";
import * as bip32 from 'bip32';
import * as bip39 from "bip39"
import * as bitcoin from "bitcoinjs-lib";
import { loadJSON, postDATA } from "../utils/load-json";
import coininfo from "coininfo";

let NETWORK = null;

function _get_network_by_coin_id(coin_id) {

    let NEW_NETWORK = null;

    switch (coin_id) {
        case "bitcoin":
            NEW_NETWORK = coininfo.bitcoin.main.toBitcoinJS();
            break;
        case "dash":
            NEW_NETWORK = coininfo.dash.main.toBitcoinJS();
            break;
        case "dogecoin":
            NEW_NETWORK = {
                messagePrefix: '\x19Dogecoin Signed Message:\n', // Main
                bip32: {
                    public: 0x02facafd,
                    private: 0x02fac398
                },
                pubKeyHash: 0x1e,
                scriptHash: 0x16,
                wif: 0x9e
            };
            break;
        /*
        {
                messagePrefix: '\x19Dogecoin Signed Message:\n', // Test
                bip32: {
                    public: 0x043587cf,
                    private: 0x04358394
                },
                pubKeyHash: 0x71,
                scriptHash: 0xc4,
                wif: 0xf1
            }
        */
        case "litecoin":
            NEW_NETWORK = coininfo.litecoin.main.toBitcoinJS();
            break;
    }

    // Thanks JS without this below, it would not work.
    if(!NETWORK) {

        NETWORK = NEW_NETWORK;
    }else if(NEW_NETWORK.messagePrefix !== NETWORK.messagePrefix) {

        NETWORK = NEW_NETWORK;
    }

    return NETWORK;
}

function _get_network_name_by_coin_id(coin_id) {

    switch (coin_id) {
        case "bitcoin":
            return "BTC";
        case "dash":
            return "DASH";
        case "dogecoin":
            return "DOGE";
        case "litecoin":
            return "LTC";
    }
}

// SoChain's API v3 serves Bitcoin, Dogecoin and Litecoin; Dash goes to Blockchair.
// Neither SoChain nor this file needs an API key for these lookups.
const SOCHAIN_API_URL = "https://sochain.com/api/v3";
const BLOCKCHAIR_API_URL = "https://api.blockchair.com";

function _is_on_sochain(coin_id) {

    return coin_id !== "dash";
}

// SoChain gives amounts as decimal strings ("0.00012345"): convert them to satoshis without float rounding.
function _decimal_to_satoshis(value) {

    const [whole, fraction = ""] = String(value).replace("-", "").split(".");
    const satoshis = parseInt(whole || "0", 10) * 100000000 + parseInt((fraction + "00000000").slice(0, 8), 10);
    return String(value).startsWith("-") ? -satoshis: satoshis;
}

function _blockchair_time_to_ms(time) {

    return Date.parse(time.replace(" ", "T") + "Z");
}

// Unspent outputs as [{txid, output_no, satoshis}], ten per page on SoChain.
function _get_unspent_outputs(coin_id, address, callback_function) {

    if(!_is_on_sochain(coin_id)) {

        loadJSON(BLOCKCHAIR_API_URL + "/" + coin_id + "/dashboards/address/" + address + "?limit=0", (error, response) => {

            if(!error && response.data && response.data[address]) {

                callback_function(null, response.data[address].utxo.map((uo) => {

                    return {txid: uo.transaction_hash, output_no: uo.index, satoshis: uo.value};
                }));
            }else {

                callback_function(error || response, null);
            }
        });
        return;
    }

    let unspent_outputs = [];

    function load_page(page) {

        loadJSON(SOCHAIN_API_URL + "/unspent_outputs/" + _get_network_name_by_coin_id(coin_id) + "/" + address + "/" + page, (error, response) => {

            if(!error && response.status === "success") {

                const outputs = response.data.outputs;
                unspent_outputs = unspent_outputs.concat(outputs.map((uo) => {

                    return {txid: uo.hash, output_no: uo.index, satoshis: _decimal_to_satoshis(uo.value)};
                }));

                if(outputs.length === 10) {

                    load_page(page + 1);
                }else {

                    callback_function(null, unspent_outputs);
                }
            }else {

                callback_function(error || response, null);
            }
        });
    }

    load_page(1);
}

function _get_btc_dash_doge_ltc_account_by_seed(coin_id, seed) {

    const seeed = bip39.mnemonicToSeedSync(seed);
    const root = bip32.fromSeed(seeed, _get_network_by_coin_id(coin_id));

    const path = "m/84'/0'/0'/0/0"; // TODO https://github.com/Anderson-Juhasc/bip84
    const child = root.derivePath(path);

    const _wif = child.toWIF();
    const key_pair = bitcoin.ECPair.fromWIF(_wif.toString(), _get_network_by_coin_id(coin_id));

    return {key_pair: key_pair, child: child};
}

function get_btc_dash_doge_ltc_fee_per_byte(coin_id, callback_function) {

    function extract_value(error, result) {

        if(!error) {

            const satoshi = result.data.suggested_transaction_fee_per_byte_sat;
            callback_function(null, satoshi);
        }else {

            callback_function(error, null);
        }
    }

    loadJSON("https://api.blockchair.com/" + coin_id + "/stats", extract_value)
}

function get_btc_dash_doge_ltc_address_by_seed(coin_id, seed) {

    let { child } = _get_btc_dash_doge_ltc_account_by_seed(coin_id, seed);
    return bitcoin.payments.p2pkh({ pubkey: child.publicKey, network: _get_network_by_coin_id(coin_id) }).address;
}

function get_btc_dash_doge_ltc_public_key_by_seed(coin_id, seed) {

    let { child } = _get_btc_dash_doge_ltc_account_by_seed(coin_id, seed);
    const bytes = child.publicKey;
    return base58.encode(bytes);
}

function get_btc_dash_doge_ltc_private_key_by_seed(coin_id, seed) {

    let { child } = _get_btc_dash_doge_ltc_account_by_seed(coin_id, seed);
    const bytes = child.privateKey;
    return base58.encode(bytes);
}

function _format_btc_dash_doge_ltc_amount(coin_id, amount) {

    return amount * 1;
}

function send_btc_dash_doge_ltc_transaction(coin_id, seed, address, amount, memo, fees, callback_function, return_fee_instead_of_send = false) {

    const my_address = get_btc_dash_doge_ltc_address_by_seed(coin_id, seed);
    const { key_pair } = _get_btc_dash_doge_ltc_account_by_seed(coin_id, seed);

    function add_unspent_output(error, response) {

        const amount_satoshis = Math.floor(amount * 100000000);
        let tx = new bitcoin.TransactionBuilder(_get_network_by_coin_id(coin_id));
        const txfeemin = 0;
        let balance = 0;
        let input_count = 0;

        /*
        const data = new Buffer(memo); // Message is inserted
        const data_script = bitcoin.script.nullDataOutput(data);
        tx.addOutput(data_script, 0);
         */

        if(!error) {

            function add_fee(fees_error, fees_response) {

                if(!fees_error){

                    const fee_per_byte = fees_response;

                    if(response) {
                        if(Array.isArray(response)) {

                            response.forEach(function(uo, uo_index) {

                                tx.addInput(uo.txid, uo.output_no, uo_index);
                                balance += uo.satoshis;
                                input_count++;

                            });

                            let txfee = txfeemin;
                            //Estimate transaction size in bytes
                            const txSize = (input_count * 180) + (2 * 34) + 10;
                            //Blockchain: Minimum fee is 1.5 satoshi / Byte
                            if (txSize * fee_per_byte > txfeemin){
                                txfee = txSize * Math.floor(fee_per_byte);
                            }

                            txfee *= fees;


                            if(return_fee_instead_of_send) {

                                callback_function(null, txfee / 100000000);
                            }else {

                                if(amount_satoshis + txfee <= balance) {

                                    try {

                                        tx.addOutput(address, amount_satoshis);
                                        tx.addOutput(my_address, balance - (amount_satoshis + txfee));

                                        for (let i = 0; i < input_count; i++){

                                            tx.sign(i, key_pair);
                                        }

                                        let tx_hex = tx.build().toHex();

                                        function send_transaction_callback(error, response) {

                                            callback_function(error, response);
                                        }

                                        // SoChain's API has no broadcasting: send through Blockchair for every coin.
                                        postDATA(BLOCKCHAIR_API_URL + "/" + coin_id + "/push/transaction", "data=" + tx_hex, send_transaction_callback);

                                    }catch (e) {

                                        callback_function("Cannot send this transaction to this address.", null);
                                    }
                                }else {

                                    callback_function("Not enough coins", null);
                                }

                            }

                        }else {

                            callback_function(response, null);
                        }

                    }else {

                        callback_function(response, null);
                    }

                }else {

                    callback_function(fees_error, null);
                }
            }

            get_btc_dash_doge_ltc_fee_per_byte(coin_id, add_fee);

        }else {

            callback_function(error, null);
        }

    }

    _get_unspent_outputs(coin_id, my_address, add_unspent_output);
}

function get_btc_dash_doge_ltc_account_balance_by_seed(parameters, callback_function) {

    const { seed, coin_id } = parameters;
    const my_address = get_btc_dash_doge_ltc_address_by_seed(coin_id, seed);

    function get_btc_dash_doge_ltc_balance_callback(error, response) {

        if(!error) {

            if(_is_on_sochain(coin_id) && response.status === "success") {

                callback_function(null, _format_btc_dash_doge_ltc_amount(coin_id, response.data.confirmed));
            }else if(!_is_on_sochain(coin_id) && response.data && response.data[my_address]) {

                callback_function(null, _format_btc_dash_doge_ltc_amount(coin_id, response.data[my_address].address.balance / 100000000));
            }else {

                callback_function(response, null);
            }

        }else {

            callback_function(error, null);
        }
    }

    if(_is_on_sochain(coin_id)) {

        loadJSON(SOCHAIN_API_URL + "/balance/" + _get_network_name_by_coin_id(coin_id) + "/" + my_address, get_btc_dash_doge_ltc_balance_callback);
    }else {

        loadJSON(BLOCKCHAIR_API_URL + "/" + coin_id + "/dashboards/address/" + my_address + "?limit=0", get_btc_dash_doge_ltc_balance_callback);
    }

}

function get_btc_dash_doge_ltc_account_transactions_by_seed(parameters, callback_function) {

    const { seed, after_transaction_id, coin_id } = parameters;

    const my_address = get_btc_dash_doge_ltc_address_by_seed(coin_id, seed);

    // Newest first: return up to 100 transactions after (older than) after_transaction_id.
    const max_transactions = 100;
    const max_pages = 10;
    let formatted_transactions = [];
    let found = !after_transaction_id;

    function add_rows(rows) {

        rows.forEach((row) => {

            if(found && formatted_transactions.length < max_transactions) {

                formatted_transactions.push(row);
            }else if(row.id === after_transaction_id) {

                found = true;
            }
        });
    }

    function load_page(page_number, next) {

        let url;
        if(_is_on_sochain(coin_id)) {

            url = SOCHAIN_API_URL + "/transactions/" + _get_network_name_by_coin_id(coin_id) + "/" + my_address + (next ? "?cursor=" + encodeURIComponent(next) : "?page_size=100");
        }else {

            url = BLOCKCHAIR_API_URL + "/" + coin_id + "/dashboards/address/" + my_address + "?transaction_details=true&limit=100&offset=" + (page_number * 100);
        }

        loadJSON(url, (error, response) => {

            let rows = null;
            let next_page = null;

            if(!error && _is_on_sochain(coin_id) && response.status === "success") {

                rows = response.data.transactions.map((transaction) => {

                    return {id: transaction.hash, timestamp: transaction.time * 1000, crypto_id: coin_id};
                });
                next_page = response.data.next_cursor;
            }else if(!error && !_is_on_sochain(coin_id) && response.data && response.data[my_address]) {

                rows = response.data[my_address].transactions.map((transaction) => {

                    return {id: transaction.hash, timestamp: _blockchair_time_to_ms(transaction.time), crypto_id: coin_id};
                });
                next_page = rows.length === 100 ? true: null;
            }

            if(rows === null) {

                callback_function(error || response, null);
                return;
            }

            add_rows(rows);

            if(next_page && formatted_transactions.length < max_transactions && page_number + 1 < max_pages) {

                load_page(page_number + 1, next_page);
            }else {

                callback_function(null, formatted_transactions);
            }
        });
    }

    load_page(0, null);
}

function get_btc_dash_doge_ltc_transaction_by_id(parameters, callback_function) {

    const { id, seed, coin_id } = parameters;
    const address = get_btc_dash_doge_ltc_address_by_seed(coin_id, seed);

    // The transaction as {id, confirmations, time (s), inputs, outputs}, with [{address, value (coins)}] rows.
    function normalize_transaction(response) {

        if(_is_on_sochain(coin_id)) {

            if(response.status !== "success") {

                return null;
            }

            const data = response.data;
            return {
                id: data.hash,
                confirmations: data.confirmations,
                time: data.time,
                inputs: data.inputs.map((input) => {return {address: input.address, value: input.value};}),
                outputs: data.outputs.map((output) => {return {address: output.address, value: output.value};})
            };
        }

        if(!response.data || !response.data[id]) {

            return null;
        }

        const data = response.data[id];
        return {
            id: data.transaction.hash,
            confirmations: data.transaction.block_id > 0 ? response.context.state - data.transaction.block_id + 1: 0,
            time: _blockchair_time_to_ms(data.transaction.time) / 1000,
            inputs: data.inputs.map((input) => {return {address: input.recipient, value: input.value / 100000000};}),
            outputs: data.outputs.map((output) => {return {address: output.recipient, value: output.value / 100000000};})
        };
    }

    function format_get_each_btc_dash_doge_ltc_transaction_response(error, response){

        if(!error) {

            const transaction = normalize_transaction(response);

            if(!transaction) {

                callback_function(response, null);
                return;
            }

            let input_value = 0;
            let output_value = 0;

            let first_input_address = transaction.inputs[0].address;
            let recipient_output_address = transaction.outputs[transaction.outputs.length-1].address;
            let recipient_output_value = transaction.outputs[transaction.outputs.length-1].value;

            for(let ini = 0; ini < transaction.inputs.length; ini++) {

                input_value += parseFloat(transaction.inputs[ini].value);
            }

            for(let oti = 0; oti < transaction.outputs.length; oti++) {

                output_value += parseFloat(transaction.outputs[oti].value);
                if(address === transaction.outputs[oti].address) {

                    recipient_output_address = transaction.outputs[oti].address;
                    recipient_output_value = transaction.outputs[oti].value;
                }
            }

            if(first_input_address === recipient_output_address) {

                for(let oti = 0; oti < transaction.outputs.length; oti++) {

                    if(first_input_address !== transaction.outputs[oti].address) {

                        recipient_output_address = transaction.outputs[oti].address;
                        recipient_output_value = transaction.outputs[oti].value;
                    }
                }
            }

            const formatted_transaction = {
                id: transaction.id,
                confirmations: transaction.confirmations,
                fee: input_value - output_value,
                timestamp: transaction.time * 1000,
                send_from: first_input_address,
                send_to: recipient_output_address,
                amount_crypto: recipient_output_value,
                memo: "",
                crypto_id: coin_id
            };

            callback_function(null, formatted_transaction);
        }else {

            callback_function(error, null);
        }
    }

    if(_is_on_sochain(coin_id)) {

        loadJSON(SOCHAIN_API_URL + "/transaction/" + _get_network_name_by_coin_id(coin_id) + "/" + id, format_get_each_btc_dash_doge_ltc_transaction_response);
    }else {

        loadJSON(BLOCKCHAIR_API_URL + "/" + coin_id + "/dashboards/transaction/" + id, format_get_each_btc_dash_doge_ltc_transaction_response);
    }

}

function get_btc_dash_doge_ltc_send_transaction_info(coin_id) {

    switch (coin_id) {
        case "bitcoin":
            return {
                max_message_length: 0,
                average_transaction_time: 6 * 10 * 60 * 1000,
            };
        case "dash":
            return {
                max_message_length: 0,
                average_transaction_time: 6 * 3 * 60 * 1000,
            };
        case "dogecoin":
            return {
                max_message_length: 0,
                average_transaction_time: 6 * 1 * 60 * 1000,
            };
        case "litecoin":
            return {
                max_message_length: 0,
                average_transaction_time: 6 * 1.5 * 60 * 1000,
            };
    }
}

module.exports = {
    get_btc_dash_doge_ltc_fee_per_byte: get_btc_dash_doge_ltc_fee_per_byte,
    get_btc_dash_doge_ltc_address_by_seed: get_btc_dash_doge_ltc_address_by_seed,
    get_btc_dash_doge_ltc_public_key_by_seed: get_btc_dash_doge_ltc_public_key_by_seed,
    get_btc_dash_doge_ltc_private_key_by_seed: get_btc_dash_doge_ltc_private_key_by_seed,
    send_btc_dash_doge_ltc_transaction: send_btc_dash_doge_ltc_transaction,
    get_btc_dash_doge_ltc_account_transactions_by_seed: get_btc_dash_doge_ltc_account_transactions_by_seed,
    get_btc_dash_doge_ltc_transaction_by_id: get_btc_dash_doge_ltc_transaction_by_id,
    get_btc_dash_doge_ltc_account_balance_by_seed: get_btc_dash_doge_ltc_account_balance_by_seed,
    get_btc_dash_doge_ltc_send_transaction_info: get_btc_dash_doge_ltc_send_transaction_info
};
