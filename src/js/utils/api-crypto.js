import base58 from "bs58";
import nacl_factory from "js-nacl";
import mceliece from "mceliece";

// https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
function _ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}
function _str2ab(str) {
    const buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
    const bufView = new Uint16Array(buf);
    for (let i=0, strLen=str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

function nacl_encrypt(message, public_key, callback_function) {

    nacl_factory.instantiate(function (nacl) {

        let result = null;
        let error = null;

        try {

            message = nacl.encode_utf8(message);
            public_key = base58.decode(public_key);
            result = base58.encode(nacl.crypto_box_seal(message, public_key));
        }catch (e) {

            error = "Cannot encrypt theses data";
        }

        callback_function(error, result);
    });
}

function nacl_decrypt(encrypted_message, public_key, private_key, callback_function) {

    nacl_factory.instantiate(function (nacl) {

        let result = null;
        let error = null;

        try {

            encrypted_message = base58.decode(encrypted_message);
            public_key = base58.decode(public_key);
            private_key = base58.decode(private_key);
            result = nacl.decode_utf8(nacl.crypto_box_seal_open(encrypted_message, public_key, private_key));

        }catch (e) {

            error = "Cannot decrypt theses data";
        }

        callback_function(error, result);
    });
}

function mc_eliece_encrypt(message, public_key, callback_function) {

    const message_uint8array = new TextEncoder().encode(message);
    const public_key_uint8array = new TextEncoder().encode(public_key);

    mceliece.encrypt(message_uint8array, public_key_uint8array).then(function(response_uint8array){

        callback_function(null, base58.encode(response_uint8array));

    }).catch(function(error){

        callback_function(error, "");
    });
}

function mc_eliece_decrypt(encrypted_message, private_key, callback_function) {

    const encrypted_message_uint8array = new TextEncoder().encode(encrypted_message);
    const private_key_uint8array = new TextEncoder().encode(private_key);

    mceliece.decrypt(encrypted_message_uint8array, private_key_uint8array).then(function(response_uint8array){

        callback_function(null, base58.encode(response_uint8array));

    }).catch(function(error){

        callback_function(error, "");
    });
}

module.exports = {
    nacl_encrypt: nacl_encrypt,
    nacl_decrypt: nacl_decrypt,
    mc_eliece_encrypt: mc_eliece_encrypt,
    mc_eliece_decrypt: mc_eliece_decrypt,
};
