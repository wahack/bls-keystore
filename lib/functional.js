"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.verifyPassword = exports.create = exports.defaultAes128CtrModule = exports.defaultSha256Module = exports.defaultScryptModule = exports.defaultPbkdfModule = void 0;
const uuid_1 = require("uuid");
const kdf_1 = require("./kdf");
Object.defineProperty(exports, "defaultPbkdfModule", { enumerable: true, get: function () { return kdf_1.defaultPbkdfModule; } });
Object.defineProperty(exports, "defaultScryptModule", { enumerable: true, get: function () { return kdf_1.defaultScryptModule; } });
const checksum_1 = require("./checksum");
Object.defineProperty(exports, "defaultSha256Module", { enumerable: true, get: function () { return checksum_1.defaultSha256Module; } });
const cipher_1 = require("./cipher");
Object.defineProperty(exports, "defaultAes128CtrModule", { enumerable: true, get: function () { return cipher_1.defaultAes128CtrModule; } });
const password_1 = require("./password");
const utils_1 = require("ethereum-cryptography/utils");
/**
 * Create a new keystore object
 *
 * @param password password used to encrypt the keystore
 * @param secret secret key material to be encrypted
 * @param pubkey public key, not checked for validity
 * @param path HD path used to generate the secret
 * @param kdfMod key derivation function (kdf) configuration module
 * @param checksumMod checksum configuration module
 * @param cipherMod cipher configuration module
 */
function create(password, secret, pubkey, path, description = null, kdfMod = (0, kdf_1.defaultPbkdfModule)(), checksumMod = (0, checksum_1.defaultSha256Module)(), cipherMod = (0, cipher_1.defaultAes128CtrModule)()) {
    return __awaiter(this, void 0, void 0, function* () {
        const encryptionKey = yield (0, kdf_1.kdf)(kdfMod, (0, password_1.normalizePassword)(password));
        const ciphertext = yield (0, cipher_1.cipherEncrypt)(cipherMod, encryptionKey.slice(0, 16), secret);
        return {
            version: 4,
            uuid: (0, uuid_1.v4)(),
            description: description || undefined,
            path: path,
            pubkey: (0, utils_1.bytesToHex)(pubkey),
            crypto: {
                kdf: {
                    function: kdfMod.function,
                    params: Object.assign({}, kdfMod.params),
                    message: "",
                },
                checksum: {
                    function: checksumMod.function,
                    params: {},
                    message: (0, utils_1.bytesToHex)(yield (0, checksum_1.checksum)(checksumMod, encryptionKey, ciphertext)),
                },
                cipher: {
                    function: cipherMod.function,
                    params: Object.assign({}, cipherMod.params),
                    message: (0, utils_1.bytesToHex)(ciphertext),
                },
            },
        };
    });
}
exports.create = create;
/**
 * Verify the password of a keystore object
 */
function verifyPassword(keystore, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const decryptionKey = yield (0, kdf_1.kdf)(keystore.crypto.kdf, (0, password_1.normalizePassword)(password));
        const ciphertext = (0, utils_1.hexToBytes)(keystore.crypto.cipher.message);
        return (0, checksum_1.verifyChecksum)(keystore.crypto.checksum, decryptionKey, ciphertext);
    });
}
exports.verifyPassword = verifyPassword;
/**
 * Decrypt a keystore, returns the secret key or throws on invalid password
 */
function decrypt(keystore, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const decryptionKey = yield (0, kdf_1.kdf)(keystore.crypto.kdf, (0, password_1.normalizePassword)(password));
        const ciphertext = (0, utils_1.hexToBytes)(keystore.crypto.cipher.message);
        if (!(yield (0, checksum_1.verifyChecksum)(keystore.crypto.checksum, decryptionKey, ciphertext))) {
            throw new Error("Invalid password");
        }
        return (0, cipher_1.cipherDecrypt)(keystore.crypto.cipher, decryptionKey.slice(0, 16));
    });
}
exports.decrypt = decrypt;
