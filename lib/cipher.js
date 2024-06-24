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
exports.cipherDecrypt = exports.cipherEncrypt = exports.defaultAes128CtrModule = void 0;
const random_1 = require("ethereum-cryptography/random");
const aes_1 = require("ethereum-cryptography/aes");
const utils_1 = require("ethereum-cryptography/utils");
function defaultAes128CtrModule() {
    return {
        function: "aes-128-ctr",
        params: {
            iv: (0, utils_1.bytesToHex)((0, random_1.getRandomBytesSync)(16)),
        },
    };
}
exports.defaultAes128CtrModule = defaultAes128CtrModule;
function cipherEncrypt(mod, key, data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (mod.function === "aes-128-ctr") {
            try {
                return yield (0, aes_1.encrypt)(data, key, (0, utils_1.hexToBytes)(mod.params.iv), mod.function, false);
            }
            catch (e) {
                throw new Error("Unable to encrypt");
            }
        }
        else {
            throw new Error("Invalid cipher type");
        }
    });
}
exports.cipherEncrypt = cipherEncrypt;
function cipherDecrypt(mod, key) {
    return __awaiter(this, void 0, void 0, function* () {
        if (mod.function === "aes-128-ctr") {
            try {
                return yield (0, aes_1.decrypt)((0, utils_1.hexToBytes)(mod.message), key, (0, utils_1.hexToBytes)(mod.params.iv), mod.function, false);
            }
            catch (e) {
                throw new Error("Unable to decrypt");
            }
        }
        else {
            throw new Error("Invalid cipher type");
        }
    });
}
exports.cipherDecrypt = cipherDecrypt;
