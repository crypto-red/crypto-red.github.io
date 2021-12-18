import { CURRENCY_COUNTRIES } from "../utils/constants";

import PouchDB from "pouchdb";
import triplesec from "triplesec";

import { sha512_256 } from "../utils/api-crypto";
import { clean_json_text } from "../utils/json";
import { loadJSON } from "../utils/load-json";
import get_browser_locales from "../utils/locales";

import _cache_data from "../utils/cache-data";

import {
    get_vsys_address_by_seed,
    get_vsys_account_balance_by_seed,
    get_vsys_account_transactions_by_seed,
    send_vsys_transaction,
    estimate_vsys_transaction_fee,
    get_vsys_send_transaction_info,
    get_vsys_public_key_by_seed,
    get_vsys_private_key_by_seed
} from "./api-vsys";

import {
    get_btc_dash_doge_ltc_address_by_seed,
    get_btc_dash_doge_ltc_account_balance_by_seed,
    get_btc_dash_doge_ltc_account_transactions_by_seed,
    get_btc_dash_doge_ltc_transaction_by_id,
    send_btc_dash_doge_ltc_transaction,
    get_btc_dash_doge_ltc_send_transaction_info,
    get_btc_dash_doge_ltc_public_key_by_seed,
    get_btc_dash_doge_ltc_private_key_by_seed
} from "./api-btc-dash-doge-ltc";

import {
    get_hive_account_keys,
    get_hive_send_transaction_info,
    get_hive_address_by_username,
    get_hive_account_balance_by_username,
    get_hive_account_transactions_by_username,
    send_hive_transaction,
    estimate_hive_transaction_fee,
    get_hive_private_key,
    get_hive_public_key,
    lookup_hive_accounts,
    lookup_hive_accounts_name,
    lookup_hive_accounts_with_details,
    get_hive_posts,
    get_hive_post,
    post_hive_post,
    post_hive_pixel_art,
    vote_on_hive_post,
    search_on_hive,
    hive_posts_db,
    hive_accounts_db,
    hive_queries_db,
} from "./api-hive";

const query_db = new PouchDB("query_db", {deterministic_revs: false, revs_limit: 0, auto_compaction: false});
const settings_db = new PouchDB("settings_db", {deterministic_revs: false, revs_limit: 0, auto_compaction: false});
const accounts_db = new PouchDB("accounts_db", {deterministic_revs: false, revs_limit: 0, auto_compaction: false});
const logged_accounts_db = new PouchDB("logged_accounts_db", {deterministic_revs: false, revs_limit: 0, auto_compaction: false});

let logged_account = null;

/*
 * The concept of the overall api is to cache every query and store every data into PouchDB, an over-kill DB system, ...
 */

function _merge_object(obj1, obj2){

    let merged_object = obj1 || {};

    for (let attrname in obj2) {

        if(typeof obj2[attrname] !== "undefined") {

            if(typeof obj2[attrname] === "object") {

                merged_object[attrname] = {...obj2[attrname]};
            }else {

                merged_object[attrname] = obj2[attrname];
            }

        }
    }

    return merged_object;
}

function _get_default_settings() {

    const locales = get_browser_locales()[0].split("-").length === 2 ? get_browser_locales()[0]: "en-US";

    return {
        locales,
        pixel_arts: [],
        currency: _get_currency_by_locales(locales),
        sfx_enabled: false,
        jamy_enabled: false,
        fees: 1,
        panic: false,
        enable_3d: false,
        onboarding: true,
        help: {
            topup: true,
            mixer: true,
            swap: true
            }
    };
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

    window._settings = null;
    logged_account = null;

    Promise.all([
        query_db.destroy(),
        settings_db.destroy(),
        accounts_db.destroy(),
        logged_accounts_db.destroy(),
        hive_posts_db.destroy(),
        hive_accounts_db.destroy(),
        hive_queries_db.destroy(),
    ]).then(function (){

        callback_function();
    });
}

function get_settings(callback_function) {

    if(window._settings) {

        callback_function(null, window._settings);
    }

    settings_db.allDocs({
        include_docs: true
    }, function(error, response) {

        let settings_docs_undefined = false;

        if(!error) {

            console.log(response);

            // Get settings docs
            const settings_docs = response.rows.map(function (row) {

                return row.doc;
            });

            // Choose the first
            if(typeof settings_docs[0] !== "undefined") {

                if(settings_docs[0].data !== "undefined") {

                    window._settings = JSON.parse(settings_docs[0].data);

                    callback_function(null, window._settings);
                }

                if(settings_docs.length > 1) {

                    // Delete all others
                    settings_docs.splice(0, 1);
                    settings_db.bulkDocs(settings_docs.map((sd) => {delete sd.data; return {_id: sd._id, _rev: sd._rev, _deleted: true, timestamp: 0, data: null}}), {force: true});
                }

            }else {
                settings_docs_undefined = true;
            }
        }

        if(settings_docs_undefined || error){

            window._settings = _get_default_settings();

            settings_db.post({
                data: JSON.stringify(window._settings)
            });

            callback_function(null, window._settings);
        }
    });
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

                    window._settings = _merge_object(
                        JSON.parse(clean_json_text(settings_docs[0].data)),
                        window._settings);

                    settings_db.put({
                        _id: settings_docs[0]._id,
                        _rev: settings_docs[0]._rev,
                        timestamp: Date.now(),
                        data: JSON.stringify(window._settings)
                    }, {force: true});

                    callback_function(null, window._settings);
                }

                // Delete all others
                settings_docs.splice(0, 1);
                settings_db.bulkDocs(settings_docs.filter((sd) => sd._deleted).map((sd) => {return {_id: sd._id, _rev: sd._rev, _deleted: true, timestamp: 0, data: null}}), {force: true});

            }else {

                settings_doc_undefined = true;
            }
        }

        // Create new
        if(error || settings_doc_undefined) {

            const default_all_settings = _get_default_settings();

            window._settings = _merge_object(default_all_settings, window._settings);

            settings_db.post({
                data: JSON.stringify(window._settings)
            });


            callback_function(null, window._settings);
        }
    }

    settings_db.allDocs({
        include_docs: true
    }, cache_callback_function);
}

function get_coins_markets(coins_id, vs_currency, callback_function) {

    function get_coins_markets_query(parameters, callback_function_query) {

        const { url } = parameters;
        loadJSON(url, callback_function_query);
    }

    const coins_id_string = coins_id.join(",");
    const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=" + vs_currency + "&ids=" + coins_id_string + "&order=id_asc&per_page=250&page=1&sparkline=false&price_change_percentage=24h,7d,30d,1y";

    _cache_data(
        query_db,
        30 * 60 * 1000,
        "get_coins_markets__" + coins_id_string + "__" + vs_currency,
        get_coins_markets_query,
        {url},
        callback_function
    );

}

function get_coin_data(coin_id, callback_function) {

    function get_coin_data_query(parameters, callback_function_query) {

        const { url } = parameters;
        loadJSON(url, callback_function_query);
    }

    const url = "https://api.coingecko.com/api/v3/coins/" + coin_id + "?localization=true&tickers=true&market_data=true&community_data=true&developer_data=true&sparkline=true";

    _cache_data(
        query_db,
        30 * 60 * 1000,
        "get_coin_data__" + coin_id,
        get_coin_data_query,
        {url},
        callback_function
    );
}

function get_coin_chart_data(coin_id, vs_currency, days, callback_function) {

    function get_coin_chart_data_query(parameters, callback_function_query) {

        const { url } = parameters;
        loadJSON(url, callback_function_query);
    }

    const url = "https://api.coingecko.com/api/v3/coins/" + coin_id + "/market_chart?vs_currency=" + vs_currency + "&days=" + days;

    _cache_data(
        query_db,
        30 * 60 * 1000,
        "get_coin_chart_data__" + coin_id + "__" + vs_currency + "__" + days,
        get_coin_chart_data_query,
        {url},
        callback_function,
        function(response) {

            const prices = response.prices.map(function (array_within, index) {
                return {
                    date: array_within[0],
                    value: parseFloat(array_within[1])
                }
            });

            const market_caps = response.market_caps.map(function (array_within, index) {
                return {
                    date: array_within[0],
                    value: parseFloat(array_within[1])
                }
            });

            return {prices, market_caps};
        }
    );
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
                        encrypted_seed: buffer.toString("base64"),
                        timestamp: Date.now()
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
                callback_function("Wrong password", logged_account);
            }else {

                logged_account = {
                    name: unlogged_account.name,
                    seed: buffer.toString(),
                    encrypted_seed: unlogged_account.encrypted_seed,
                    password: password,
                    timestamp: Date.now(),
                };

                if(typeof unlogged_account.hive_username !== "undefined" && typeof unlogged_account.hive_encrypted_password !== "undefined") {

                    const is_hex = unlogged_account.hive_encrypted_password.match(/^[0-9a-f]+$/g);
                    const format = is_hex ? "hex": "base64";

                    triplesec.decrypt({
                        data: triplesec.Buffer.from(unlogged_account.hive_encrypted_password, format),
                        key: triplesec.Buffer.from(password)
                    }, decrypt_hive_callback);
                }else {

                    save_logged_account_callback();
                }

                function decrypt_hive_callback(error_hive, buffer_hive) {

                    if(error_hive) {

                        logged_account = null;
                        callback_function("Wrong password", logged_account);
                    }else {

                        logged_account.hive_encrypted_password = unlogged_account.hive_encrypted_password;
                        logged_account.hive_password = buffer_hive.toString();
                        logged_account.hive_username = unlogged_account.hive_username;

                        save_logged_account_callback();
                    }

                }

                function save_logged_account_callback(error) {

                    function log_account_in_callback(error, response) {

                        if(error) {

                            logged_account = null;
                            callback_function("Cannot put account in db of logged account", logged_account)
                        }else {

                            callback_function(null, logged_account);
                        }
                    }

                    const logged_accounts_db_document = {
                        _id: logged_account.name,
                        data: JSON.stringify(logged_account)
                    };

                    logged_accounts_db.allDocs({
                        include_docs: true
                    }).then(function (result) {
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

                        logged_account = null;
                        callback_function("error db deletion", logged_account);
                    });

                }

            }
        }

        const is_hex = unlogged_account.encrypted_seed.match(/^[0-9a-f]+$/g);
        const format = is_hex ? "hex": "base64";

        triplesec.decrypt ({
            data: triplesec.Buffer.from(unlogged_account.encrypted_seed, format),
            key: triplesec.Buffer.from(password)
        }, decrypt_callback);
    }

    accounts_db.get(name, get_account_callback);

}

function add_hive_master_key(username, master_key, callback_function) {

    get_hive_account_keys(username, master_key, (error, result) => {

        if(error || logged_account === null) {

            callback_function(error, null);
        }else {

            accounts_db.get(logged_account.name, {include_docs: true}, function(error_db_get, document) {

                if(typeof document !== "undefined") {

                    triplesec.encrypt({
                        data: triplesec.Buffer.from(logged_account.seed),
                        key: triplesec.Buffer.from(logged_account.password),

                    }, function(error_encryption, buffer) {

                        if (!error_encryption) {

                            const account = {
                                name: logged_account.name,
                                encrypted_seed: buffer.toString("base64"),
                                timestamp: Date.now(),
                            };

                            triplesec.encrypt({
                                data: triplesec.Buffer.from(master_key),
                                key: triplesec.Buffer.from(logged_account.password),

                            }, function(error_encryption_hive, buffer_hive) {

                                if (!error_encryption_hive) {

                                    logged_account.hive_username = username;
                                    logged_account.hive_password = master_key;
                                    logged_account.hive_encrypted_password = buffer_hive.toString("base64");

                                    const account_with_hive_login = {
                                        name: account.name,
                                        encrypted_seed: account.encrypted_seed,
                                        hive_username: username,
                                        hive_encrypted_password: buffer_hive.toString("base64"),
                                        timestamp: account.timestamp,
                                    };

                                    function log_account_in_callback(error, response) {

                                        if(error) {

                                            logged_account = null;
                                            callback_function("Cannot put account in db of logged account", logged_account)
                                        }else {

                                            callback_function(null, logged_account);
                                        }
                                    }


                                    accounts_db.put({
                                        _id: document._id,
                                        _rev: document._rev,
                                        data: JSON.stringify(account_with_hive_login)
                                    }, {force: true}, function(error_db_add, response) {

                                        if (error_db_add) {

                                            callback_function("Impossible to add this account to the local database", null);
                                        }else {

                                            let persistent = false;

                                            logged_accounts_db.allDocs({
                                                include_docs: true
                                            }).then(function (result) {
                                                // Promise isn't supported by all browsers; you may want to use bluebird
                                                return Promise.all(result.rows.map(function (row) {

                                                    if(row.id === account.name) {

                                                        persistent = true;
                                                    }

                                                    return logged_accounts_db.remove(row.id, row.value.rev);
                                                }));
                                            }).then(function () {

                                                if(persistent) {

                                                    const logged_accounts_db_document = {
                                                        _id: logged_account.name,
                                                        data: JSON.stringify(logged_account)
                                                    };

                                                    logged_accounts_db.put(logged_accounts_db_document, {force: true}, log_account_in_callback);
                                                }else {

                                                    callback_function(null, logged_account);
                                                }

                                            }).catch(function (err) {

                                                logged_account = null;
                                                callback_function("error db deletion", logged_account);
                                            });
                                        }
                                    })

                                }else {

                                    callback_function("Impossible to encrypt this account", null);
                                }
                            });

                        }else {

                            callback_function("Impossible to encrypt this account", null);
                        }
                    });

                }else {

                    callback_function("Account with this name isn't already existing", null);
                }

            });

        }
    });
}

function logout(callback_function) {

    function get_all_logged_accounts_callback(error, response) {

        if(!error) {

            const accounts_docs = response.rows.map(function (row) {
                return row.doc;
            });

            const remove_actions = accounts_docs.map(account_doc => {
                return logged_accounts_db.remove(account_doc);
            });

            Promise.all(remove_actions).then(function (){

                logged_account = null;
                callback_function(null, true);
            });

        }else {

            callback_function("DB error: cannot find any logged accounts", false);
        }

    }

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

function get_address_by_seed(coin_id, seed, hive_username = "") {

    switch (coin_id) {

        case "v-systems":
            return get_vsys_address_by_seed(seed);
        case "bitcoin":
            return get_btc_dash_doge_ltc_address_by_seed(coin_id, seed);
        case "litecoin":
            return get_btc_dash_doge_ltc_address_by_seed(coin_id, seed);
        case "dogecoin":
            return get_btc_dash_doge_ltc_address_by_seed(coin_id, seed);
        case "dash":
            return get_btc_dash_doge_ltc_address_by_seed(coin_id, seed);
        case "hive":
            return get_hive_address_by_username(hive_username);
        case "hive_dollar":
            return get_hive_address_by_username(hive_username);
        default:
            return "Hello crypto";
    }
}

function get_public_key_by_seed(coin_id, seed, hive_username = "", hive_password = "") {

    switch (coin_id) {

        case "v-systems":
            return get_vsys_public_key_by_seed(seed);
        case "bitcoin":
            return get_btc_dash_doge_ltc_public_key_by_seed(coin_id, seed);
        case "litecoin":
            return get_btc_dash_doge_ltc_public_key_by_seed(coin_id, seed);
        case "dogecoin":
            return get_btc_dash_doge_ltc_public_key_by_seed(coin_id, seed);
        case "dash":
            return get_btc_dash_doge_ltc_public_key_by_seed(coin_id, seed);
        case "hive":
            return get_hive_public_key(hive_username, hive_password);
        case "hive_dollar":
            return get_hive_public_key(hive_username, hive_password);
        default:
            return "Hello crypto";
    }
}

function get_private_key_by_seed(coin_id, seed, hive_username = "", hive_password = "") {

    switch (coin_id) {

        case "v-systems":
            return get_vsys_private_key_by_seed(seed);
        case "bitcoin":
            return get_btc_dash_doge_ltc_private_key_by_seed(coin_id, seed);
        case "litecoin":
            return get_btc_dash_doge_ltc_private_key_by_seed(coin_id, seed);
        case "dogecoin":
            return get_btc_dash_doge_ltc_private_key_by_seed(coin_id, seed);
        case "dash":
            return get_btc_dash_doge_ltc_private_key_by_seed(coin_id, seed);
        case "hive":
            return get_hive_private_key(hive_username, hive_password);
        case "hive_dollar":
            return get_hive_private_key(hive_username, hive_password);
        default:
            return "Hello crypto";
    }
}

function get_send_transaction_info(coin_id) {

    switch (coin_id) {

        case "v-systems":
            return get_vsys_send_transaction_info();
        case "bitcoin":
            return get_btc_dash_doge_ltc_send_transaction_info(coin_id);
        case "litecoin":
            return get_btc_dash_doge_ltc_send_transaction_info(coin_id);
        case "dogecoin":
            return get_btc_dash_doge_ltc_send_transaction_info(coin_id);
        case "dash":
            return get_btc_dash_doge_ltc_send_transaction_info(coin_id);
        case "hive":
            return get_hive_send_transaction_info();
        case "hive_dollar":
            return get_hive_send_transaction_info();
        default:
            return {
                max_message_length: 0,
                average_transaction_time: 0
            };
    }
}

function get_balance_by_seed(coin_id, seed, callback_function, hive_username = ""){

    if(!seed) {

        callback_function("Empty account", null);
        return;
    }

    const seed_hash = sha512_256(seed);

    switch (coin_id) {

        case "v-systems":

            _cache_data(
                query_db,
                3000,
                "v-systems_get_balance__" + seed_hash,
                get_vsys_account_balance_by_seed,
                {node: "https://wallet.v.systems/api", seed},
                callback_function
            );
            break;
        case "bitcoin":

            _cache_data(
                query_db,
                16 * 1000,
                "bitcoin_get_balance__" + seed_hash,
                get_btc_dash_doge_ltc_account_balance_by_seed,
                {seed, coin_id},
                callback_function
            );
            break;
        case "litecoin":

            _cache_data(
                query_db,
                16 * 1000,
                "litecoin_get_balance__" + seed_hash,
                get_btc_dash_doge_ltc_account_balance_by_seed,
                {seed, coin_id},
                callback_function
            );
            break;
        case "dogecoin":

            _cache_data(
                query_db,
                16 * 1000,
                "dogecoin_get_balance__" + seed_hash,
                get_btc_dash_doge_ltc_account_balance_by_seed,
                {seed, coin_id},
                callback_function
            );
            break;
        case "dash":

            _cache_data(
                query_db,
                16 * 1000,
                "dash_get_balance__" + seed_hash,
                get_btc_dash_doge_ltc_account_balance_by_seed,
                {seed, coin_id},
                callback_function
            );
            break;
        case "hive":
            _cache_data(
                query_db,
                16 * 1000,
                "hive_get_balance__" + hive_username,
                get_hive_account_balance_by_username,
                {hive_username, coin_id},
                callback_function
            );
            break;
        case "hive_dollar":
            _cache_data(
                query_db,
                16 * 1000,
                "hive_dollar_get_balance__" + hive_username,
                get_hive_account_balance_by_username,
                {hive_username, coin_id},
                callback_function
            );
            break;
        default:
            callback_function(null, 0);
            break;
    }
}

function send_transaction(coin_id, seed, address, amount, memo, fees, callback_function, hive_username = "", hive_password = "") {


    switch (coin_id) {

        case "v-systems":

            send_vsys_transaction(seed, address, amount, memo, callback_function);
            break;
        case "bitcoin":

            send_btc_dash_doge_ltc_transaction(coin_id, seed, address, amount, memo, fees, callback_function);
            break;
        case "litecoin":

            send_btc_dash_doge_ltc_transaction(coin_id, seed, address, amount, memo, fees, callback_function);
            break;
        case "dogecoin":

            send_btc_dash_doge_ltc_transaction(coin_id, seed, address, amount, memo, fees, callback_function);
            break;
        case "dash":

            send_btc_dash_doge_ltc_transaction(coin_id, seed, address, amount, memo, fees, callback_function);
            break;
        case "hive":

            send_hive_transaction(hive_username, hive_password, address, amount, coin_id, memo, callback_function);
            break;
        case "hive_dollar":

            send_hive_transaction(hive_username, hive_password, address, amount, coin_id, memo, callback_function);
            break;
        default:
            callback_function(null, true);
            break;
    }
}
function estimate_transaction_fee(coin_id, seed, address, amount, memo, fees, callback_function, hive_username = "", hive_password = "") {

    const return_fee_instead_of_send = true;

    switch (coin_id) {

        case "v-systems":

            estimate_vsys_transaction_fee(seed, address, amount, memo, callback_function);
            break;
        case "bitcoin":

            send_btc_dash_doge_ltc_transaction(coin_id, seed, address, amount, memo, fees, callback_function, return_fee_instead_of_send);
            break;
        case "litecoin":

            send_btc_dash_doge_ltc_transaction(coin_id, seed, address, amount, memo, fees, callback_function, return_fee_instead_of_send);
            break;
        case "dogecoin":

            send_btc_dash_doge_ltc_transaction(coin_id, seed, address, amount, memo, fees, callback_function, return_fee_instead_of_send);
            break;
        case "dash":

            send_btc_dash_doge_ltc_transaction(coin_id, seed, address, amount, memo, fees, callback_function, return_fee_instead_of_send);
            break;
        case "hive":

            estimate_hive_transaction_fee(hive_username, hive_password, address, amount, coin_id, memo, callback_function);
            break;
        case "hive_dollar":

            estimate_hive_transaction_fee(hive_username, hive_password, address, amount, coin_id, memo, callback_function);
            break;
        default:
            callback_function(null, 0);
            break;
    }
}

function get_transactions_by_seed(coin_id, seed, all_transactions, callback_function, hive_username = ""){

    const after_transaction_id = (all_transactions.length) ? all_transactions[all_transactions.length-1].id: "";
    let after_transaction_number = -1;

    all_transactions.forEach((trx) => {

        if(after_transaction_number === -1 || after_transaction_number > trx.transaction_number) {

            after_transaction_number = trx.transaction_number -1;
        }
    });

    switch (coin_id) {

        case "v-systems":

            _cache_data(
                query_db,
                4 * 1000,
                "v-systems_get_transaction_from__" + all_transactions.length.toString() + "__" + after_transaction_id,
                get_vsys_account_transactions_by_seed,
                {node: "https://wallet.v.systems/api", seed, number_of_record: 25, offset_number: all_transactions.length},
                callback_function
            );
            break;
        case "bitcoin":

            _cache_data(
                query_db,
                4 * 1000,
                "bitcoin_get_transaction_from__" + after_transaction_id,
                get_btc_dash_doge_ltc_account_transactions_by_seed,
                {seed, after_transaction_id, coin_id},
                callback_function
            );
            break;
        case "litecoin":

            _cache_data(
                query_db,
                4 * 1000,
                "bitcoin_get_transaction_from__" + after_transaction_id,
                get_btc_dash_doge_ltc_account_transactions_by_seed,
                {seed, after_transaction_id, coin_id},
                callback_function
            );
            break;
        case "dogecoin":

            _cache_data(
                query_db,
                4 * 1000,
                "dogecoin_get_transaction_from__" + after_transaction_id,
                get_btc_dash_doge_ltc_account_transactions_by_seed,
                {seed, after_transaction_id, coin_id},
                callback_function
            );
            break;
        case "dash":

            _cache_data(
                query_db,
                4 * 1000,
                "dash_get_transaction_from__" + after_transaction_id,
                get_btc_dash_doge_ltc_account_transactions_by_seed,
                {seed, after_transaction_id, coin_id},
                callback_function
            );
            break;
        case "hive":

            _cache_data(
                query_db,
                3 * 1000,
                "hive_get_transaction_from__" + after_transaction_number,
                get_hive_account_transactions_by_username,
                {username: hive_username, after_transaction_number, coin_id},
                callback_function
            );
            break;
        case "hive_dollar":

            _cache_data(
                query_db,
                3 * 1000,
                "hive_dollar_get_transaction_from__" + after_transaction_number,
                get_hive_account_transactions_by_username,
                {username: hive_username, after_transaction_number, coin_id},
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
                query_db,
                60 * 1000,
                "bitcoin-get-transaction_from-id-"+id,
                get_btc_dash_doge_ltc_transaction_by_id,
                {id, seed, coin_id},
                callback_function
            );
            break;

        case "litecoin":

            _cache_data(
                query_db,
                60 * 1000,
                "litecoin-get-transaction_from-id-"+id,
                get_btc_dash_doge_ltc_transaction_by_id,
                {id, seed, coin_id},
                callback_function
            );
            break;
        case "dogecoin":

            _cache_data(
                query_db,
                60 * 1000,
                "dogecoin-get-transaction_from-id-"+id,
                get_btc_dash_doge_ltc_transaction_by_id,
                {id, seed, coin_id},
                callback_function
            );
            break;
        case "dash":

            _cache_data(
                query_db,
                60 * 1000,
                "dash-get-transaction_from-id-"+id,
                get_btc_dash_doge_ltc_transaction_by_id,
                {id, seed, coin_id},
                callback_function
            );
        default:
            callback_function("No function", null);
            break;
    }
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
    add_hive_master_key: add_hive_master_key,
    logout: logout,
    is_logged: is_logged,
    send_transaction: send_transaction,
    estimate_transaction_fee: estimate_transaction_fee,
    get_address_by_seed: get_address_by_seed,
    get_public_key_by_seed: get_public_key_by_seed,
    get_private_key_by_seed: get_private_key_by_seed,
    get_balance_by_seed: get_balance_by_seed,
    get_transactions_by_seed: get_transactions_by_seed,
    get_transactions_by_id: get_transactions_by_id,
    get_send_transaction_info: get_send_transaction_info,
    lookup_hive_accounts,
    lookup_hive_accounts_name,
    lookup_hive_accounts_with_details,
    get_hive_posts,
    get_hive_post,
    post_hive_post,
    post_hive_pixel_art,
    vote_on_hive_post,
    search_on_hive,
}
