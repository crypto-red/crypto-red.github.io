import vsys from "@virtualeconomy/js-v-sdk";
import converters from "../utils/converters";

import base58 from "bs58";

function _get_vsys_account_by_seed(seed) {

    let account = new vsys.Account(vsys.constants.MAINNET_BYTE);
    account.buildFromSeed(seed, 0);

    return account;
}

function get_vsys_address_by_seed(seed) {

    let account = _get_vsys_account_by_seed(seed);
    return account.getAddress();
}

function get_vsys_public_key_by_seed(seed) {

    let account = _get_vsys_account_by_seed(seed);
    return account.getPublicKey();
}

function get_vsys_private_key_by_seed(seed) {

    let account = _get_vsys_account_by_seed(seed);
    return account.getPrivateKey();
}

function _format_vsys_amount(amount) {

    const amount_scaled = amount / 100000000;

    return amount_scaled * 1;
}

function _format_vsys_attachment(attachment) {

    const attachment_bytes = base58.decode(attachment);
    return converters.byteArrayToString(attachment_bytes);
}

function _format_vsys_transaction(transaction) {

    const formatted_transaction = {
        id: transaction.id,
        fee: _format_vsys_amount(transaction.feeCharged),
        timestamp: transaction.timestamp / 1000000,
        send_from: transaction.proofs[0].address,
        send_from_public_key: transaction.proofs[0].publicKey,
        send_to: transaction.recipient,
        amount_crypto: _format_vsys_amount(transaction.amount),
        memo: _format_vsys_attachment(transaction.attachment),
        crypto_id: "v-systems"
    };

    return formatted_transaction;
}

function send_vsys_transaction(seed, address, amount, memo, callback_function) {

    const node = "https://wallet.v.systems/api";
    let chain = new vsys.Blockchain(node, vsys.constants.MAINNET_BYTE);
    let transaction = new vsys.Transaction(vsys.constants.MAINNET_BYTE);
    let account = _get_vsys_account_by_seed(seed);
    const public_key = account.getPublicKey();
    const timestamp = Date.now() * 1e6;

    transaction.buildPaymentTx(public_key, address, amount, memo, timestamp);

    const bytes = transaction.toBytes();
    const signature = account.getSignature(bytes);
    const send_transaction = transaction.toJsonForSendingTx(signature);

    account.sendTransaction(chain, send_transaction).then(response => {

        if(typeof response.error === "undefined") {

            callback_function(null, true);
        }else {

            callback_function(response.message, false);
        }
    }, error => {

        callback_function(error, false);
    });

}

function estimate_vsys_transaction_fee(seed, address, amount, memo, callback_function) {

    callback_function(null, 0.1);

}

function get_vsys_account_balance_by_seed(parameters, callback_function) {

    const { node, seed } = parameters;

    let chain = new vsys.Blockchain(node, vsys.constants.MAINNET_BYTE);

    chain.getBalance(get_vsys_address_by_seed(seed)).then(response => {

        const formatted_balance = _format_vsys_amount(response.balance);

        callback_function(null, formatted_balance);

    }, error => {

        callback_function(error, null);
    });

}

function get_vsys_account_transactions_by_seed(paramters, callback_function) {

    const { node, seed, number_of_record, offset_number } = paramters;

    let chain = new vsys.Blockchain(node, vsys.constants.MAINNET_BYTE);
    const TX_TYPE = 2;

    chain.getTxByType(get_vsys_address_by_seed(seed), number_of_record, TX_TYPE, offset_number).then(response => {

        if(typeof response["transactions"] !== "undefined") {

            const formatted_transactions = response["transactions"].map(transaction => _format_vsys_transaction(transaction));

            callback_function(null, formatted_transactions);
        }else {

            callback_function("Typeof transactions equals to undefined", null);
        }

    }, error => {

        callback_function(error, null);
    });

}

function get_vsys_send_transaction_info() {

    return {
        max_message_length: 160,
        average_transaction_time: "6x4 seconds"
    };
}


module.exports = {
    get_vsys_address_by_seed: get_vsys_address_by_seed,
    get_vsys_public_key_by_seed: get_vsys_public_key_by_seed,
    get_vsys_private_key_by_seed: get_vsys_private_key_by_seed,
    send_vsys_transaction: send_vsys_transaction,
    estimate_vsys_transaction_fee: estimate_vsys_transaction_fee,
    get_vsys_account_transactions_by_seed: get_vsys_account_transactions_by_seed,
    get_vsys_account_balance_by_seed: get_vsys_account_balance_by_seed,
    get_vsys_send_transaction_info: get_vsys_send_transaction_info
};
