import { ICipherModule } from "./types";
export declare function defaultAes128CtrModule(): Pick<ICipherModule, "function" | "params">;
export declare function cipherEncrypt(mod: ICipherModule, key: Uint8Array, data: Uint8Array): Promise<Uint8Array>;
export declare function cipherDecrypt(mod: ICipherModule, key: Uint8Array): Promise<Uint8Array>;
