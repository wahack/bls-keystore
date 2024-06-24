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
exports.Keystore = void 0;
const kdf_1 = require("./kdf");
const checksum_1 = require("./checksum");
const cipher_1 = require("./cipher");
const functional_1 = require("./functional");
const schema_validation_1 = require("./schema-validation");
/**
 * Class-based BLS Keystore
 */
class Keystore {
    constructor(obj) {
        this.version = obj.version;
        this.uuid = obj.uuid;
        this.description = obj.description;
        this.path = obj.path;
        this.pubkey = obj.pubkey;
        this.crypto = {
            kdf: Object.assign({}, obj.crypto.kdf),
            checksum: Object.assign({}, obj.crypto.checksum),
            cipher: Object.assign({}, obj.crypto.cipher),
        };
    }
    /**
     * Create a new Keystore object
     */
    static create(password, secret, pubkey, path, description = null, kdfMod = (0, kdf_1.defaultPbkdfModule)(), checksumMod = (0, checksum_1.defaultSha256Module)(), cipherMod = (0, cipher_1.defaultAes128CtrModule)()) {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = yield (0, functional_1.create)(password, secret, pubkey, path, description, kdfMod, checksumMod, cipherMod);
            return new Keystore(obj);
        });
    }
    /**
     * Create a keystore from an unknown object
     */
    static fromObject(obj) {
        (0, schema_validation_1.validateKeystore)(obj);
        return new Keystore(obj);
    }
    /**
     * Parse a keystore from a JSON string
     */
    static parse(str) {
        return Keystore.fromObject(JSON.parse(str));
    }
    /**
     * Decrypt a keystore, returns the secret key or throws on invalid password
     */
    decrypt(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, functional_1.decrypt)(this, password);
        });
    }
    /**
     * Verify the password as correct or not
     */
    verifyPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, functional_1.verifyPassword)(this, password);
        });
    }
    /**
     * Return the keystore as a plain object
     */
    toObject() {
        return Object.assign({}, this);
    }
    /**
     * Return the keystore as stringified JSON
     */
    stringify() {
        return JSON.stringify(this.toObject(), null, 2);
    }
}
exports.Keystore = Keystore;
