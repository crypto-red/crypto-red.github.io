import base58 from "bs58";
import * as bip32 from 'bip32';
import * as bip39 from "bip39"
import * as bitcoin from "bitcoinjs-lib";
import { loadJSON, postDATA, loadValueHtmlSelector } from "../utils/load-json";
import coininfo from "coininfo";

const NETWORK = coininfo.bitcoin.test.toBitcoinJS();

function _get_btc_account_by_seed(seed) {

    const seeed = bip39.mnemonicToSeedSync(seed);
    const root = bip32.fromSeed(seeed, NETWORK);

    const path = "m/49'/1'/0'/0/0";
    const child = root.derivePath(path);

    const _wif = child.toWIF();
    const key_pair = bitcoin.ECPair.fromWIF(_wif.toString(), NETWORK);

    return {key_pair: key_pair, child: child};
}

function get_btc_fee_per_byte(callback_function) {

    function extract_value(error, result) {

        if(!error) {

            const satoshi = result.data.suggested_transaction_fee_per_byte_sat;
            callback_function(null, satoshi);
        }else {

            callback_function(error, null);
        }
    }

    loadJSON("https://api.blockchair.com/bitcoin/stats", extract_value)
}

function get_btc_address_by_seed(seed) {

    let { child } = _get_btc_account_by_seed(seed);
    return bitcoin.payments.p2pkh({ pubkey: child.publicKey, network: NETWORK }).address;
}

function get_btc_public_key_by_seed(seed) {

    let { child } = _get_btc_account_by_seed(seed);
    return child.publicKey;
}

function _format_btc_amount(amount) {

    return amount * 1;
}

function _format_btc_attachment(attachment) {

    const attachment_bytes = base58.decode(attachment);
    return converters.byteArrayToString(attachment_bytes);
}

function send_btc_transaction(seed, address, amount, memo, callback_function, return_fee_instead_of_send = false) {
    
    const my_address = get_btc_address_by_seed(seed);
    const { key_pair } = _get_btc_account_by_seed(seed);

    function add_unspent_output(error, response) {

        const amount_satoshis = Math.floor(amount * 100000000);
        let tx = new bitcoin.TransactionBuilder(NETWORK);
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

                    if(response.data) {
                        if(response.data.txs) {

                            response.data.txs.forEach(function(uo) {

                                tx.addInput(uo.txid, uo.output_no, uo.output_no, uo.script);
                                balance += Math.round(uo.value * 100000000);
                                input_count++;

                            });

                            let txfee = txfeemin;
                            //Estimate transaction size in bytes
                            const txSize = (input_count * 180) + (2 * 34) + 10;
                            //Blockchain: Minimum fee is 1.5 satoshi / Byte
                            if (txSize * fee_per_byte > txfeemin){
                                txfee = txSize * Math.floor(fee_per_byte);
                            }


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

                                        postDATA("https://chain.so/api/v2/send_tx/BTCTEST", "tx_hex=" + tx_hex, send_transaction_callback);

                                    }catch (e) {

                                        console.log(e);
                                        callback_function("Cannot send this trx to this add.", null);
                                    }
                                }else {

                                    callback_function("Not enough bitcoins", null);
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

            get_btc_fee_per_byte(add_fee);

        }else {

            callback_function(error, null);
        }

    }

    loadJSON('https://chain.so/api/v2/get_tx_unspent/BTCTEST/' + my_address, add_unspent_output);
}

function get_btc_account_balance_by_seed(parameters, callback_function) {

    const { seed } = parameters;
    const my_address = get_btc_address_by_seed(seed);

    function get_btc_balance_callback(error, response) {

        if(!error) {

            if(response.status !== "fail") {

                callback_function(null, _format_btc_amount(response.data.confirmed_balance));
            }else {

                callback_function(response, null);
            }

        }else {

            callback_function(error, null);
        }
    }

    loadJSON("https://chain.so/api/v2/get_address_balance/BTCTEST/"+my_address+"/1", get_btc_balance_callback)

}

function get_btc_account_transactions_by_seed(parameters, callback_function) {

    const { seed, after_transaction_id } = parameters;

    const my_address = get_btc_address_by_seed(seed);

    let formatted_transactions_object = {
        received: {
            transactions: [],
            query: false
        },
        sent: {
            transactions: [],
            query: false
        },
    };
    let formatted_error = null;

    function format_get_btc_transaction_response(error, response, direction) {

        formatted_transactions_object[direction].query = true;

        if(!error) {

            if(response.status !== "fail") {

                const unformatted_transaction = response.data.txs;
                const formatted_transactions = unformatted_transaction.map((transaction) => {

                    return {
                        id: transaction.txid,
                        timestamp: transaction.time * 1000,
                        crypto_id: "bitcoin"
                    };
                })

                formatted_transactions_object[direction].transactions = formatted_transactions;

            }else {

                formatted_error = response;
            }
        }else {

            formatted_error = error;
        }

        let all_a_response = true;
        let all_current_transactions = [];

        Object.entries(formatted_transactions_object).forEach(entry => {
            const [key, value] = entry;
            if(value.query === false){
                all_a_response = false;
            }else {
                all_current_transactions = all_current_transactions.concat(value.transactions);
            }
        });

        if(all_a_response) {

            if(!formatted_error){

                callback_function(null, all_current_transactions);
            }else {

                callback_function(formatted_error, null);
            }
        }
    }

    loadJSON("https://chain.so/api/v2/get_tx_received/BTCTEST/" + my_address + "/" + after_transaction_id, (error, response) => {format_get_btc_transaction_response(error, response, "received")});
    loadJSON("https://chain.so/api/v2/get_tx_spent/BTCTEST/" + my_address + "/" + after_transaction_id, (error, response) => {format_get_btc_transaction_response(error, response, "sent")});


}

function get_btc_transaction_by_id(parameters, callback_function) {

    const { id, seed } = parameters;
    const address = get_btc_address_by_seed(seed);

    function format_get_each_btc_transaction_response(error, response){

        if(!error) {

            if(response.status !== "fail") {

            }

            let input_value = 0;
            let output_value = 0;

            let first_input_address = response.data.inputs[0].address;
            let recipient_output_address = response.data.outputs[response.data.outputs.length-1].address;
            let recipient_output_value = response.data.outputs[response.data.outputs.length-1].value;

            for(let ini = 0; ini < response.data.inputs.length; ini++) {

                input_value += parseFloat(response.data.inputs[ini].value);
            }

            for(let oti = 0; oti < response.data.outputs.length; oti++) {

                output_value += parseFloat(response.data.outputs[oti].value);
                if(address == response.data.outputs[oti].address) {

                    recipient_output_address = response.data.outputs[oti].address;
                    recipient_output_value = response.data.outputs[oti].value;
                }
            }

            if(first_input_address == recipient_output_address) {

                for(let oti = 0; oti < response.data.outputs.length; oti++) {

                    if(first_input_address !== response.data.outputs[oti].address) {

                        recipient_output_address = response.data.outputs[oti].address;
                        recipient_output_value = response.data.outputs[oti].value;
                    }
                }
            }

            const formatted_transaction = {
                id: response.data.txid,
                confirmations: response.data.confirmations,
                fee: input_value - output_value,
                timestamp: response.data.time * 1000,
                send_from: first_input_address,
                send_to: recipient_output_address,
                amount_crypto: recipient_output_value,
                memo: "",
                crypto_id: "bitcoin"
            };

            callback_function(null, formatted_transaction);
        }else {

            callback_function(error, null);
        }
    }

    loadJSON("https://chain.so/api/v2/get_tx/BTCTEST/"+id, format_get_each_btc_transaction_response);

}

function get_btc_send_transaction_info() {

    return {
        max_message_length: 0,
        average_transaction_time: "6x10 minutes"
    };
}

module.exports = {
    get_btc_fee_per_byte: get_btc_fee_per_byte,
    get_btc_address_by_seed: get_btc_address_by_seed,
    get_btc_public_key_by_seed: get_btc_public_key_by_seed,
    send_btc_transaction: send_btc_transaction,
    get_btc_account_transactions_by_seed: get_btc_account_transactions_by_seed,
    get_btc_transaction_by_id: get_btc_transaction_by_id,
    get_btc_account_balance_by_seed: get_btc_account_balance_by_seed,
    get_btc_send_transaction_info: get_btc_send_transaction_info
};
