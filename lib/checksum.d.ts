import { IChecksumModule } from "./types";
export declare function defaultSha256Module(): Pick<IChecksumModule, "function">;
export declare function checksum(mod: IChecksumModule, key: Uint8Array, ciphertext: Uint8Array): Promise<Uint8Array>;
export declare function verifyChecksum(mod: IChecksumModule, key: Uint8Array, ciphertext: Uint8Array): Promise<boolean>;
