"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePassword = void 0;
const utils_1 = require("ethereum-cryptography/utils");
/**
 * Normalizes password to NFKD representation and strips the C0, C1, and Delete control codes.
 * C0 are the control codes between 0x00 - 0x1F (inclusive)
 * C1 codes lie between 0x80 and 0x9F (inclusive)
 *
 * https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2335.md#password-requirements
 */
function normalizePassword(password) {
    if (typeof password === "string") {
        return (0, utils_1.utf8ToBytes)(password
            .normalize("NFKD")
            .split("")
            .filter(char => controlCodeFilter(char.charCodeAt(0))).join(""));
    }
    else {
        return password.filter(controlCodeFilter);
    }
}
exports.normalizePassword = normalizePassword;
function controlCodeFilter(charCode) {
    return (charCode > 0x1F) && !(charCode >= 0x7f && charCode <= 0x9F);
}
