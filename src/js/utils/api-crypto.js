import base58 from "bs58";
import { sha512_256 } from "js-sha512";
import triplesec from "triplesec";

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

    import("js-nacl").then(module => {

        module.default.instantiate(function (nacl) {

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
    });
}

function nacl_decrypt(encrypted_message, public_key, private_key, callback_function) {

    import("js-nacl").then(module => {

        module.default.instantiate(function (nacl) {

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
    });
}

function triplesec_decrypt(encrypted_message, password, callback_function) {

    function decrypt_callback(error, buffer) {

        if(error) {

            callback_function("Wrong password", null);
        }else {

            callback_function(null, buffer.toString());
        }
    }

    const match = encrypted_message.match(/^[0-9a-f]+$/g);
    const is_hex = match;
    const format = is_hex ? "hex": "base64";

    triplesec.decrypt ({
        data: triplesec.Buffer.from(encrypted_message, format),
        key: triplesec.Buffer.from(password)
    }, decrypt_callback);
}

module.exports = {
    nacl_encrypt: nacl_encrypt,
    nacl_decrypt: nacl_decrypt,
    sha512_256: sha512_256,
    triplesec_decrypt: triplesec_decrypt,
};
