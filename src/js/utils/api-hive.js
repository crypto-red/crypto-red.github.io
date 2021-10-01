import hiveJS from "@hiveio/hive-js";
import { ChainTypes, makeBitMaskFilter } from "@hiveio/hive-js/lib/auth/serializer";
import vsys from "@virtualeconomy/js-v-sdk";

function _format_account(account) {

    let parsed_json_metadata = {};

    try {

        parsed_json_metadata = JSON.parse(account.json_metadata);

    } catch(e){

        try {

            parsed_json_metadata = JSON.parse(account.posting_json_metadata);
        }catch(e2) {}
    }

    parsed_json_metadata.profile = typeof parsed_json_metadata.profile === "undefined" ? {}: parsed_json_metadata.profile;
    parsed_json_metadata.profile.profile_image = typeof parsed_json_metadata.profile.profile_image === "undefined" ? "": parsed_json_metadata.profile.profile_image;
    parsed_json_metadata.profile.profile_image = parsed_json_metadata.profile.profile_image.match(/(https:\/\/)([/|.|\w|\s])*\.(?:jpg|jpeg|gif|png)/) === null ? "": "https://images.hive.blog/64x64/" + parsed_json_metadata.profile.profile_image;
    parsed_json_metadata.profile.cover_image = typeof parsed_json_metadata.profile.cover_image === "undefined" ? "": parsed_json_metadata.profile.cover_image;
    parsed_json_metadata.profile.cover_image = parsed_json_metadata.profile.profile_image.match(/(https:\/\/)([/|.|\w|\s])*\.(?:jpg|jpeg|gif|png)/) === null ? "": "https://images.hive.blog/64x64/" + parsed_json_metadata.profile.cover_image;
    parsed_json_metadata.profile.about = typeof parsed_json_metadata.profile.about === "undefined" ? "": parsed_json_metadata.profile.about;
    parsed_json_metadata.profile.name = typeof parsed_json_metadata.profile.name === "undefined" ? "": parsed_json_metadata.profile.name;
    parsed_json_metadata.profile.location = typeof parsed_json_metadata.profile.location === "undefined" ? "": parsed_json_metadata.profile.location;
    parsed_json_metadata.profile.website = typeof parsed_json_metadata.profile.website === "undefined" ? "": parsed_json_metadata.profile.website;

    const saved_hive = Number(account.savings_balance.split(" ")[0]);
    const saved_hbd = Number(account.savings_hbd_balance.split(" ")[0]);
    const hive = Number(account.balance.split(" ")[0]);
    const hbd = Number(account.hbd_balance.split(" ")[0]);


    const account_formatted = {
        name: account.name,
        raw: account,
        memo_key: account.memo_key,
        metadata: {
            profile: {
                profile_image: parsed_json_metadata.profile.profile_image,
                cover_image: parsed_json_metadata.profile.cover_image,
                about: parsed_json_metadata.profile.about,
                name: parsed_json_metadata.profile.name,
                location: parsed_json_metadata.profile.location,
                website: parsed_json_metadata.profile.website
            }
        },
        wallet: {
            saved_hive,
            saved_hbd,
            hive,
            hbd
        }
    };

    return account_formatted;
}

function _format_transaction(transaction) {

    const formatted_transaction = {
        id: transaction[1].trx_id,
        transaction_number: transaction[0],
        fee: 0,
        timestamp: new Date(transaction[1].timestamp) - new Date().getTimezoneOffset() * 60 * 1000,
        send_from: transaction[1].op[1].from,
        send_from_public_key: null,
        send_to: transaction[1].op[1].to,
        amount_crypto: transaction[1].op[1].amount.split(" ")[0],
        memo: transaction[1].op[1].memo,
        crypto_id: transaction[1].op[1].amount.split(" ")[1] === "HIVE" ? "hive": "hive_dollar",
    };

    return formatted_transaction;
}

function lookup_accounts(input, limit, callback_function) {

    input = input.replace("@", "");
    limit = Math.max(Math.min(25, limit), 0);

    hiveJS.api.lookupAccounts(input, limit, callback_function);
}
function lookup_accounts_name(names, callback_function) {

    names = names.map(function(name){
        return name.replace("@", "");
    });

    hiveJS.api.lookupAccountNames(names, function (error, results){

        if(!error) {

            results = results.map(function(account){

                return _format_account(account);
            });

            callback_function(error, results);

        }else {

            callback_function(error, null);
        }
    });
}

function lookup_accounts_with_details(input, limit, callback_function) {

    lookup_accounts(input, limit, function(error, names) {

        if(!error) {

            lookup_accounts_name(names, callback_function);
        }else {

            callback_function(error, null);
        }
    });

}

function _get_account_keys(username = "", master_key = "") {

    const key_result = hiveJS.auth.getPrivateKeys(username, master_key, ['posting', 'active', 'owner', 'memo']);

    const keys = {
        posting_private_key: key_result.posting,
        posting_public_key: key_result.postingPubKey,
        active_private_key: key_result.active,
        active_public_key: key_result.activePubkey,
        owner_private_key: key_result.owner,
        owner_public_key: key_result.ownerPubkey,
        memo_private_key: key_result.memo,
        memo_public_key: key_result.memoPubkey
    };

    return keys;
}


function get_account_keys(username = "", master_key = "", callback_function) {

    // Get private keys
    function process_public_account_callback(error, result){

        if(!error && typeof result[0] !== "undefined") {

            let account = result[0];
            const keys = _get_account_keys(username, master_key);

            // Verify private and public key match (password)
            if(keys.memo_public_key === account.memo_key) {

                callback_function(null, keys);

            }else {

                callback_function("Wrong password", false);
            }

        }else {

            callback_function("Non existing account", false);
        }
    }

    // Get public account
    lookup_accounts_name([username], process_public_account_callback);
}

function get_hive_send_transaction_info() {

    return {
        max_message_length: 300,
        average_transaction_time: 6 * 3 * 1000,
    };
}

function get_hive_address_by_username(username) {

    return "" + username;
}

function get_hive_account_balance_by_username(parameters, callback_function) {

    const { hive_username, coin_id } = parameters;

    if(typeof hive_username === "undefined" || hive_username === null || hive_username === "") {

        callback_function(null, 0);

    }else {

        lookup_accounts_name([hive_username], (err, res) => {

            if(err && typeof res[0] === "undefined") {

                callback_function(err, null);
            }else {

                const acc = res[0];

                if(coin_id === "hive_dollar") {

                    callback_function(null, acc.wallet.hbd + acc.wallet.saved_hbd);
                }else {

                    callback_function(null, acc.wallet.hive + acc.wallet.saved_hive);
                }

            }
        });

    }
}

function get_hive_account_transactions_by_username(parameters, callback_function) {

    const {username, after_transaction_number, coin_id} = parameters;

    const op = ChainTypes.operations
    const wallet_operations_bitmask = makeBitMaskFilter([
        op.transfer
    ]);

    hiveJS.api.getAccountHistory(username, after_transaction_number, 100, ...wallet_operations_bitmask, function(err, result) {

        if(!err && result) {

            const trxs = result.map(function(trx){

                return _format_transaction(trx);
            }).filter(function(trx){

                return trx.crypto_id === coin_id;
            }).sort(function(a, b){

                return a.timestamp - b.timestamp;
            });

            callback_function(null, trxs);
        }else {

            callback_function("Can't get latest transactions of " + coin_id, null);
        }
    });

}

function send_hive_transaction(hive_username, hive_password, address, amount, coin_id, memo, callback_function) {

    const { active_private_key } = _get_account_keys(hive_username, hive_password);
    const asset = coin_id === "hive" ? "HIVE": "HBD";
    const amount_formatted = hiveJS.formatter.amount(parseFloat(amount), asset);

    hiveJS.broadcast.transfer(active_private_key, hive_username, address, amount_formatted, memo, function(err, result) {

        if(!err) {

            callback_function(null, true);
        }else {

            const message = err.data.code === 10 ?
                "Not enough funds.":
                err.cause.message;

            callback_function(message, null);
        }
    });

}

function estimate_hive_transaction_fee(hive_username, hive_password, address, amount, coin_id, memo, callback_function) {

    callback_function(null, 0);

}

function get_hive_private_key(hive_username, hive_password) {

    const { owner_private_key } = _get_account_keys(hive_username, hive_password);
    return owner_private_key;
}

function get_hive_public_key(hive_username, hive_password) {

    const { owner_public_key } = _get_account_keys(hive_username, hive_password);
    return owner_public_key;
}

module.exports = {
    lookup_accounts: lookup_accounts,
    lookup_accounts_name: lookup_accounts_name,
    lookup_accounts_with_details: lookup_accounts_with_details,
    get_account_keys: get_account_keys,
    get_hive_send_transaction_info: get_hive_send_transaction_info,
    get_hive_address_by_username: get_hive_address_by_username,
    get_hive_account_balance_by_username: get_hive_account_balance_by_username,
    get_hive_account_transactions_by_username: get_hive_account_transactions_by_username,
    send_hive_transaction: send_hive_transaction,
    estimate_hive_transaction_fee: estimate_hive_transaction_fee,
    get_hive_private_key: get_hive_private_key,
    get_hive_public_key: get_hive_public_key,
};