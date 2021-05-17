import { CURRENCY_COUNTRIES } from "../utils/constants";

import PouchDB from "pouchdb";
import triplesec from "triplesec";

import { clean_json_text } from "../utils/json";
import { loadJSON } from "../utils/load-json";
import get_browser_locales from "../utils/locales";

import { get_vsys_address_by_seed, get_vsys_account_balance_by_seed, get_vsys_account_transactions_by_seed, send_vsys_transaction, estimate_vsys_transaction_fee, get_vsys_send_transaction_info } from "./api-vsys";
import { get_btc_address_by_seed, get_btc_account_balance_by_seed, get_btc_account_transactions_by_seed, get_btc_transaction_by_id, send_btc_transaction, get_btc_send_transaction_info  } from "./api-btc";
import { get_ltc_address_by_seed, get_ltc_account_balance_by_seed, get_ltc_account_transactions_by_seed, get_ltc_transaction_by_id, send_ltc_transaction, get_ltc_send_transaction_info  } from "./api-ltc";
import { get_doge_address_by_seed, get_doge_account_balance_by_seed, get_doge_account_transactions_by_seed, get_doge_transaction_by_id, send_doge_transaction, get_doge_send_transaction_info  } from "./api-doge";
import { get_dash_address_by_seed, get_dash_account_balance_by_seed, get_dash_account_transactions_by_seed, get_dash_transaction_by_id, send_dash_transaction, get_dash_send_transaction_info  } from "./api-dash";

const query_db = new PouchDB("query_db", {revs_limit: 1, auto_compaction: true});
const settings_db = new PouchDB("settings_db", {revs_limit: 1, auto_compaction: true});
const accounts_db = new PouchDB("accounts_db", {revs_limit: 1, auto_compaction: true});
const logged_accounts_db = new PouchDB("logged_accounts_db", {revs_limit: 1, auto_compaction: true});

let settings = null;
let logged_account = null;

function _merge_object(obj1, obj2){

    let merged_object = obj1 || {};

    for (let attrname in obj2) {

        if(typeof obj2[attrname] !== "undefined") {

            merged_object[attrname] = obj2[attrname];
        }
    }

    return merged_object;
}

function _get_currency_by_locales(locales) {

    const country = locales.split("-").length === 2 ? locales.split("-")[1] : "US";
    let currency = "USD";

    Object.entries(CURRENCY_COUNTRIES).forEach(entry => {
        const [key, value] = entry;
        if(value.includes(country)) {
            currency = key;
        }
    });

    return currency;
}

function reset_all_databases(callback_function) {

    settings = null;
    logged_account = null;

    Promise.all([
        query_db.destroy(),
        settings_db.destroy(),
        accounts_db.destroy(),
        logged_accounts_db.destroy()
    ]).then(function (){

        callback_function();
    });
}

function get_settings(callback_function) {

    if(settings !== null) {

        callback_function(null, settings);
    }

    function cache_callback_function(error, response) {

        let settings_docs_undefined = false;

        if(!error) {

            // Get settings docs
            const settings_docs = response.rows.map(function (row) {

                return row.doc;
            });

            // Choose the first
            if(typeof settings_docs[0] !== "undefined") {

                if(settings_docs[0].data !== "undefined") {

                    settings = JSON.parse(settings_docs[0].data);
                    callback_function(null, settings);
                }

                // Delete all others
                for(let i = 1; i < settings_docs.length; i++) {

                    settings_db.remove(settings_docs[i]);
                }

            }else {
                settings_docs_undefined = true;
            }
        }

        if(settings_docs_undefined || error){

            const locales = get_browser_locales()[0].split("-").length === 2 ? get_browser_locales()[0]: "en-US";

            settings = {
                locales,
                currency: _get_currency_by_locales(locales),
                panic: false,
                help: {
                    topup: true,
                    mixer: true,
                    convert: true
                }
            };

            settings_db.post({
                data: JSON.stringify(settings)
            });

            callback_function(null, settings);
        }
    }

    settings_db.allDocs({
        include_docs: true
    }, cache_callback_function);
}

function set_settings(settings, callback_function) {

    let settings_doc_undefined = false;

    function cache_callback_function(error, response) {

        if(!error) {

            // Get settings docs
            const settings_docs = response.rows.map(function (row) {

                return row.doc;
            });

            // Choose the first
            if(typeof settings_docs[0] !== "undefined") {

                if(settings_docs[0].data !== "undefined") {

                    settings = _merge_object(
                        JSON.parse(clean_json_text(settings_docs[0].data)),
                        settings);

                    settings_db.put({
                        _id: settings_docs[0]._id,
                        _rev: settings_docs[0]._rev,
                        timestamp: Date.now(),
                        data: JSON.stringify(settings)
                    }, {force: true});

                    callback_function(null, settings);
                }

                // Delete all others
                for(let i = 1; i < settings_docs.length; i++) {

                    settings_db.remove(settings_docs[i]);
                }

            }else {

                settings_doc_undefined = true;
            }
        }

        // Create new
        if(error || settings_doc_undefined) {

            const locales = get_browser_locales()[0].split("-").length === 2 ? get_browser_locales()[0]: "en-US";

            const default_all_settings = {
                locales,
                currency: _get_currency_by_locales(locales),
                panic: false,
                help: {
                    topup: true,
                    mixer: true,
                    convert: true
                }
            };

            settings = _merge_object(default_all_settings, settings);

            settings_db.post({
                data: JSON.stringify(settings)
            });


            callback_function(null, settings);
        }
    }

    settings_db.allDocs({
        include_docs: true
    }, cache_callback_function);
}

function get_coins_markets(coins_id, vs_currency, callback_function) {

    const coins_id_string = coins_id.join(",");
    const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=" + vs_currency + "&ids=" + coins_id_string + "&order=id_asc&per_page=250&page=1&sparkline=false&price_change_percentage=24h,7d,30d,1y";
    const query_id = "get_coins_markets__" + coins_id_string + "__" + vs_currency;

    const cache_time = 30 * 60 * 1000;

    // Get data and store it
    function gather_data(rev) {

        loadJSON(url, function (error, response) {

            const coins_markets = response;

            query_db.put({
                _id: query_id,
                _rev: rev,
                timestamp: Date.now(),
                data: JSON.stringify(coins_markets)
            }, {force: true});

            callback_function(null, coins_markets);
        });
    }

    // Look for data into the DB
    query_db.get(query_id, function(err, doc) {
        if (!err) {

            // Test if recent
            if(doc.timestamp + cache_time >= Date.now() || !navigator.onLine) {

                const coins_markets = JSON.parse(clean_json_text(doc.data));

                callback_function(null, coins_markets);
            }else { // if old update

                gather_data(doc._rev);
            }

        }else {

            // Get data from network
            gather_data("1-A");
        }
    });
}

function get_coin_data(coin_id, callback_function) {

    const url = "https://api.coingecko.com/api/v3/coins/" + coin_id + "?localization=true&tickers=true&market_data=true&community_data=true&developer_data=true&sparkline=true";
    const query_id = "get_coin_data__" + coin_id;

    const cache_time = 30 * 60 * 1000;

    // Get data and store it
    function gather_data(rev) {

        loadJSON(url, function (error, response) {

            if(!error) {
                const coin_data = response;

                if(typeof coin_data.error === "undefined") {

                    query_db.put({
                        _id: query_id,
                        _rev: rev,
                        timestamp: Date.now(),
                        data: JSON.stringify(coin_data)
                    }, {force: true});

                    callback_function(null, coin_data);
                }else {

                    coin_data(response.error, null);
                }
            }else {

                callback_function(error, null)
            }

        });
    }

    // Look for data into the DB
    query_db.get(query_id, function(error, doc) {
        if (!error) {

            // Test if recent
            if(doc.timestamp + cache_time >= Date.now() || !navigator.onLine) {

                const coin_data = JSON.parse(clean_json_text(doc.data));

                callback_function(null, coin_data);
            }else { // if old update

                gather_data(doc._rev);
            }

        }else {

            // Get data from network
            gather_data("1-A");
        }
    });
}

function get_coin_chart_data(coin_id, vs_currency, days, callback_function) {

    const url = "https://api.coingecko.com/api/v3/coins/" + coin_id + "/market_chart?vs_currency=" + vs_currency + "&days=" + days;
    const query_id = "get_coin_chart_data__" + coin_id + "__" + vs_currency + "__" + days;

    const cache_time = 30 * 60 * 1000;

    // Get data and store it
    function gather_data(rev) {

        loadJSON(url, function (error, response) {

            const prices = response.prices.map(function(array_within, index){
                return {
                    date: array_within[0],
                    value: parseFloat(array_within[1])
                }
            });

            const market_caps = response.market_caps.map(function(array_within, index){
                return {
                    date: array_within[0],
                    value: parseFloat(array_within[1])
                }
            });

            const coin_chart_data = {
                prices,
                market_caps
            };

            query_db.put({
                _id: query_id,
                _rev: rev,
                timestamp: Date.now(),
                data: JSON.stringify(coin_chart_data)
            }, {force: true});

            callback_function(null, coin_chart_data);
        });
    }

    // Look for data into the DB
    query_db.get(query_id, function(error, doc) {
        if (!error) {

            // Test if recent
            if(doc.timestamp + cache_time >= Date.now() || !navigator.onLine) {

                const coin_chart_data = JSON.parse(clean_json_text(doc.data));

                callback_function(null, coin_chart_data);
            }else { // if old update

                gather_data(doc._rev);
            }

        }else {

            // Get data from network
            gather_data("1-A");
        }
    });
}

function create_account(name, password, seed, callback_function) {

    accounts_db.get(name, function(error_db_get, document) {

        if(typeof document === "undefined") {

            triplesec.encrypt({
                data: triplesec.Buffer.from(seed),
                key: triplesec.Buffer.from(password),

            }, function(error_encryption, buffer) {

                if (!error_encryption) {

                    const account = {
                        name: name,
                        encrypted_seed: buffer.toString('hex'),
                        timestamp: Date.now(),
                        balance: {
                            "v-systems": 0,
                            "bitcoin": 0,
                        }
                    }


                    accounts_db.put({
                        _id: name,
                        data: JSON.stringify(account)
                    }, {force: true}, function(error_db_add, response) {

                        if (error_db_add) {

                            callback_function("Impossible to add this account to the local database", null);
                        }else {

                            callback_function(null, account);
                        }
                    })

                }else {

                    callback_function("Impossible to encrypt this account", null);
                }
            });

        }else {

            callback_function("Account with this name already existing with this name", null);
        }

    });
}


function get_accounts(callback_function) {

    function get_all_accounts_callback(error, response) {


        if(!error) {
            const accounts_docs = response.rows.map(function (row) {

                return row.doc;
            });

            const accounts = accounts_docs.map(function(doc) {

                return JSON.parse(clean_json_text(doc.data));
            });

            callback_function(null, accounts);

        }else {

            callback_function("DB error: cannot any accounts", null);
        }

    }

    accounts_db.allDocs({
        include_docs: true
    }, get_all_accounts_callback);
}

function delete_account_by_name(name, callback_function){

    function delete_account_callback(error, response) {

        if(error) {

            callback_function("Cannot delete the right account with this name", false);
        }else {

            callback_function(null, true);
        }
    }

    function get_account_callback(error, document) {

        if (error) {

            callback_function("Cannot find the right account with this name", false);
        }else {

            accounts_db.remove(document._id, document._rev, delete_account_callback);
        }
    }

    accounts_db.get(name, get_account_callback);
}



function login(name, password, persistent = true, callback_function) {

    function get_account_callback(error, document) {

        const unlogged_account = JSON.parse(clean_json_text(document.data));

        function decrypt_callback(error, buffer) {

            if(error) {

                logged_account = null;
                callback_function("Wrong password", {});
            }else {

                logged_account = {
                    name: unlogged_account.name,
                    seed: buffer.toString(),
                    balance: unlogged_account.balance,
                    timestamp: Date.now(),
                };

                const logged_accounts_db_document = {
                    _id: logged_account.name,
                    data: JSON.stringify(logged_account)
                };

                function log_account_in_callback(error, response) {

                    if(error) {

                        callback_function("Cannot put account in db of logged account", {})
                    }else {

                        callback_function(null, logged_account);
                    }
                }

                logged_accounts_db.allDocs().then(function (result) {
                    // Promise isn't supported by all browsers; you may want to use bluebird
                    return Promise.all(result.rows.map(function (row) {
                        return logged_accounts_db.remove(row.id, row.value.rev);
                    }));
                }).then(function () {

                    if(persistent) {

                        logged_accounts_db.put(logged_accounts_db_document, {force: true}, log_account_in_callback);
                    }else {

                        callback_function(null, logged_account);
                    }

                }).catch(function (err) {

                    callback_function("error db deletion", {});
                });

            }
        }

        triplesec.decrypt ({
            data: triplesec.Buffer.from(unlogged_account.encrypted_seed, "hex"),
            key: triplesec.Buffer.from(password)
        }, decrypt_callback);
    }

    accounts_db.get(name, get_account_callback);

}

function logout(callback_function) {

    function get_all_logged_accounts_callback(error, response) {

        if(!error) {

            const accounts_docs = response.rows.map(function (row) {
                return row.doc;
            });

            for(let i = 0; i < accounts_docs.length; i++) {

                logged_accounts_db.remove(accounts_docs[i]);
            }

            callback_function(null, true);

        }else {

            callback_function("DB error: cannot find any logged accounts", false);
        }

    }

    logged_account = null;

    logged_accounts_db.allDocs({
        include_docs: true
    }, get_all_logged_accounts_callback);

}

function is_logged(callback_function) {

    if(logged_account !== null) {

        callback_function(null, logged_account);
    }else {

        function get_all_logged_accounts_callback(error, response) {

            if(!error) {

                const accounts_docs = response.rows.map(function (row) {
                    return row.doc;
                });

                if(accounts_docs.length >= 1) {

                    logged_account = JSON.parse(clean_json_text(accounts_docs[0].data));
                    callback_function(null, logged_account);

                }else {


                    callback_function(null, null);
                }

            }else {

                callback_function(null, null);
            }

        }

        logged_accounts_db.allDocs({
            include_docs: true
        }, get_all_logged_accounts_callback);
    }
}

function get_address_by_seed(coin_id, seed) {

    switch (coin_id) {

        case "v-systems":
            return get_vsys_address_by_seed(seed);
        case "bitcoin":
            return get_btc_address_by_seed(seed);
        case "litecoin":
            return get_ltc_address_by_seed(seed);
        case "dogecoin":
            return get_doge_address_by_seed(seed);
        case "dash":
            return get_dash_address_by_seed(seed);
        default:
            return "Hello crypto";
    }
}

function get_send_transaction_info(coin_id) {

    switch (coin_id) {

        case "v-systems":
            return get_vsys_send_transaction_info();
        case "bitcoin":
            return get_btc_send_transaction_info();
        case "litecoin":
            return get_ltc_send_transaction_info();
        case "dogecoin":
            return get_doge_send_transaction_info();
        case "dash":
            return get_dash_send_transaction_info();
        default:
            return {
                max_message_length: 0,
                average_transaction_time: "undefined seconds"
            };
    }
}

function get_balance_by_seed(coin_id, seed, callback_function){

    if(!seed) {

        callback_function("Empty account", null);
        return;
    }

    switch (coin_id) {

        case "v-systems":

            _cache_data(
                1000,
                "v-systems-get-balance",
                get_vsys_account_balance_by_seed,
                {node: "https://wallet.v.systems/api", seed: seed},
                callback_function
            );
            break;
        case "bitcoin":

            _cache_data(
                16 * 1000,
                "bitcoin-get-balance",
                get_btc_account_balance_by_seed,
                {seed: seed},
                callback_function
            );
            break;
        case "litecoin":

            _cache_data(
                16 * 1000,
                "litecoin-get-balance",
                get_ltc_account_balance_by_seed,
                {seed: seed},
                callback_function
            );
            break;
        case "dogecoin":

            _cache_data(
                16 * 1000,
                "dogecoin-get-balance",
                get_doge_account_balance_by_seed,
                {seed: seed},
                callback_function
            );
            break;
        case "dash":

            _cache_data(
                16 * 1000,
                "dash-get-balance",
                get_dash_account_balance_by_seed,
                {seed: seed},
                callback_function
            );
            break;
        default:
            callback_function(null, 0);
            break;
    }
}

function send_transaction(coin_id, seed, address, amount, memo, callback_function) {


    switch (coin_id) {

        case "v-systems":

            send_vsys_transaction(seed, address, amount, memo, callback_function);
            break;
        case "bitcoin":

            send_btc_transaction(seed, address, amount, memo, callback_function);
            break;
        case "litecoin":

            send_ltc_transaction(seed, address, amount, memo, callback_function);
            break;
        case "dogecoin":

            send_doge_transaction(seed, address, amount, memo, callback_function);
            break;
        case "dash":

            send_dash_transaction(seed, address, amount, memo, callback_function);
            break;
        default:
            callback_function(null, true);
            break;
    }
}
function estimate_transaction_fee(coin_id, seed, address, amount, memo, callback_function) {

    const return_fee_instead_of_send = true;

    switch (coin_id) {

        case "v-systems":

            estimate_vsys_transaction_fee(seed, address, amount, memo, callback_function);
            break;
        case "bitcoin":

            send_btc_transaction(seed, address, amount, memo, callback_function, return_fee_instead_of_send);
            break;
        case "litecoin":

            send_ltc_transaction(seed, address, amount, memo, callback_function, return_fee_instead_of_send);
            break;
        case "dogecoin":

            send_doge_transaction(seed, address, amount, memo, callback_function, return_fee_instead_of_send);
            break;
        case "dash":

            send_dash_transaction(seed, address, amount, memo, callback_function, return_fee_instead_of_send);
            break;
        default:
            callback_function(null, 0);
            break;
    }
}

function get_transactions_by_seed(coin_id, seed, all_transactions, callback_function){

    const after_transaction_id = (all_transactions.length) ? all_transactions[all_transactions.length-1].id: "";

    switch (coin_id) {

        case "v-systems":

            _cache_data(
                1 * 1000,
                "v-systems-get-transaction_from-" + all_transactions.length.toString() + "-" + after_transaction_id,
                get_vsys_account_transactions_by_seed,
                {node: "https://wallet.v.systems/api", seed, number_of_record: 25, offset_number: all_transactions.length},
                callback_function
            );
            break;
        case "bitcoin":

            _cache_data(
                1 * 1000,
                "bitcoin-get-transaction_from-" + after_transaction_id,
                get_btc_account_transactions_by_seed,
                {seed, after_transaction_id},
                callback_function
            );
            break;
        case "litecoin":

            _cache_data(
                1 * 1000,
                "bitcoin-get-transaction_from-" + after_transaction_id,
                get_ltc_account_transactions_by_seed,
                {seed, after_transaction_id},
                callback_function
            );
            break;
        case "dogecoin":

            _cache_data(
                1 * 1000,
                "dogecoin-get-transaction_from-" + after_transaction_id,
                get_doge_account_transactions_by_seed,
                {seed, after_transaction_id},
                callback_function
            );
            break;
        case "dash":

            _cache_data(
                1 * 1000,
                "dash-get-transaction_from-" + after_transaction_id,
                get_dash_account_transactions_by_seed,
                {seed, after_transaction_id},
                callback_function
            );
            break;
        default:
            callback_function(null, []);
            break;
    }

}

function get_transactions_by_id(coin_id, id, seed, callback_function){

    switch (coin_id) {

        case "bitcoin":

            _cache_data(
                12 * 1000,
                "bitcoin-get-transaction_from-id-"+id,
                get_btc_transaction_by_id,
                {id, seed},
                callback_function
            );
            break;

        case "litecoin":

            _cache_data(
                12 * 1000,
                "litecoin-get-transaction_from-id-"+id,
                get_ltc_transaction_by_id,
                {id, seed},
                callback_function
            );
            break;
        case "dogecoin":

            _cache_data(
                12 * 1000,
                "dogecoin-get-transaction_from-id-"+id,
                get_doge_transaction_by_id,
                {id, seed},
                callback_function
            );
            break;
        case "dash":

            _cache_data(
                12 * 1000,
                "dash-get-transaction_from-id-"+id,
                get_dash_transaction_by_id,
                {id, seed},
                callback_function
            );
        default:
            callback_function("No function", null);
            break;
    }

}

function _cache_data(cache_time_ms, query_id, api_function, api_parameters, callback_function) {

    // Get data and store it
    function gather_data(rev) {

        function insert_response_in_db(error, response) {

            if(!error) {

                const data = response;

                query_db.put({
                    _id: query_id,
                    _rev: rev,
                    timestamp: Date.now(),
                    data: JSON.stringify(data)
                }, {force: true});

                callback_function(null, data);
            }else {

                callback_function(error, null);
            }

        }


        api_function(api_parameters, insert_response_in_db);
    }

    // Look for data into the DB
    query_db.get(query_id, function(err, doc) {
        if (!err) {

            // Test if recent or if cache time equals 0 (force refresh) or navigator offline
            if(((doc.timestamp + cache_time_ms >= Date.now() && cache_time_ms !== 0)) || !navigator.onLine) {

                const data = JSON.parse(clean_json_text(doc.data));

                callback_function(null, data);
            }else { // if old update

                gather_data(doc._rev);
            }

        }else {

            // Get data from network
            gather_data("1-A");
        }
    });

}

module.exports = {
    reset_all_databases: reset_all_databases,
    get_settings: get_settings,
    set_settings: set_settings,
    get_coins_markets: get_coins_markets,
    get_coin_data: get_coin_data,
    get_coin_chart_data: get_coin_chart_data,
    create_account: create_account,
    get_accounts: get_accounts,
    delete_account_by_name: delete_account_by_name,
    login: login,
    logout: logout,
    is_logged: is_logged,
    send_transaction: send_transaction,
    estimate_transaction_fee: estimate_transaction_fee,
    get_address_by_seed: get_address_by_seed,
    get_balance_by_seed: get_balance_by_seed,
    get_transactions_by_seed: get_transactions_by_seed,
    get_transactions_by_id: get_transactions_by_id,
    get_send_transaction_info: get_send_transaction_info
}