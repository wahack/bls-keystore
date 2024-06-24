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
exports.kdf = exports.defaultScryptModule = exports.defaultPbkdfModule = void 0;
const random_1 = require("ethereum-cryptography/random");
const pbkdf2_1 = require("ethereum-cryptography/pbkdf2");
const scrypt_1 = require("ethereum-cryptography/scrypt");
const utils_1 = require("ethereum-cryptography/utils");
// default kdf configurations
function defaultPbkdfModule() {
    return {
        function: "pbkdf2",
        params: {
            dklen: 32,
            c: 262144,
            prf: "hmac-sha256",
            salt: (0, utils_1.bytesToHex)((0, random_1.getRandomBytesSync)(32)),
        },
    };
}
exports.defaultPbkdfModule = defaultPbkdfModule;
function defaultScryptModule() {
    return {
        function: "scrypt",
        params: {
            dklen: 32,
            n: 262144,
            r: 8,
            p: 1,
            salt: (0, utils_1.bytesToHex)((0, random_1.getRandomBytesSync)(32)),
        },
    };
}
exports.defaultScryptModule = defaultScryptModule;
// kdf operations
function kdf(mod, password) {
    return __awaiter(this, void 0, void 0, function* () {
        if (mod.function === "pbkdf2") {
            return yield doPbkdf2(mod.params, password);
        }
        else if (mod.function === "scrypt") {
            return yield doScrypt(mod.params, password);
        }
        else {
            throw new Error("Invalid kdf type");
        }
    });
}
exports.kdf = kdf;
function doPbkdf2(params, password) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, pbkdf2_1.pbkdf2)(password, (0, utils_1.hexToBytes)(params.salt), params.c, params.dklen, params.prf.slice(5));
    });
}
function doScrypt(params, password) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, scrypt_1.scrypt)(password, (0, utils_1.hexToBytes)(params.salt), params.n, params.p, params.r, params.dklen);
    });
}
