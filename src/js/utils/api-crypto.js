import base58 from "bs58";
import nacl_factory from "js-nacl";

function nacl_encrypt(encrypted_message, public_key, callback_function) {

    nacl_factory.instantiate(function (nacl) {

        encrypted_message = nacl.encode_utf8(encrypted_message);
        public_key = base58.decode(public_key);
        callback_function(base58.encode(nacl.crypto_box_seal(encrypted_message, public_key)));
    });
}

function nacl_decrypt(encrypted_message, public_key, private_key, callback_function) {

    nacl_factory.instantiate(function (nacl) {

        encrypted_message = base58.decode(encrypted_message);
        public_key = base58.decode(public_key);
        private_key = base58.decode(private_key);
        callback_function(nacl.decode_utf8(nacl.crypto_box_seal_open(encrypted_message, public_key, private_key)));
    });
}

module.exports = {
    nacl_encrypt: nacl_encrypt,
    nacl_decrypt: nacl_decrypt
};
