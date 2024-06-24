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
exports.verifyChecksum = exports.checksum = exports.defaultSha256Module = void 0;
const sha256_1 = require("ethereum-cryptography/sha256");
const utils_1 = require("ethereum-cryptography/utils");
// default checksum configuration
function defaultSha256Module() {
    return {
        function: "sha256",
    };
}
exports.defaultSha256Module = defaultSha256Module;
// checksum operations
function checksumData(key, ciphertext) {
    return (0, utils_1.concatBytes)(key.slice(16), ciphertext);
}
function checksum(mod, key, ciphertext) {
    if (mod.function === "sha256") {
        return Promise.resolve((0, sha256_1.sha256)(checksumData(key, ciphertext)));
    }
    else {
        throw new Error("Invalid checksum type");
    }
}
exports.checksum = checksum;
function verifyChecksum(mod, key, ciphertext) {
    return __awaiter(this, void 0, void 0, function* () {
        if (mod.function === "sha256") {
            return (0, utils_1.equalsBytes)((0, utils_1.hexToBytes)(mod.message), (0, sha256_1.sha256)(checksumData(key, ciphertext)));
        }
        else {
            throw new Error("Invalid checksum type");
        }
    });
}
exports.verifyChecksum = verifyChecksum;
