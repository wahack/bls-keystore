/**
 * Normalizes password to NFKD representation and strips the C0, C1, and Delete control codes.
 * C0 are the control codes between 0x00 - 0x1F (inclusive)
 * C1 codes lie between 0x80 and 0x9F (inclusive)
 *
 * https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2335.md#password-requirements
 */
export declare function normalizePassword(password: string | Uint8Array): Uint8Array;
