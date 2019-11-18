import uuid from "uuid";
import { scrypt, PBKDF2, DefaultPBKDF2Params, AES_128_CTR, SHA256, DefaultScryptParams } from "./utils/crypto";
import { PublicKey, PrivateKey } from "@chainsafe/bls";
import { randomBytes } from "bcrypto/lib/random";
import { IKeystoreCrypto, ScryptParams, PBKDF2Params, bytes, IKeystore, IKeystoreParams } from ".";
import { KeystoreCrypto } from "./keystore-crypto";
import { Buffer } from "buffer";
import { deepmerge } from "./utils/deepmerge";


export class Keystore implements IKeystore {
  public readonly crypto: IKeystoreCrypto = new KeystoreCrypto({});
  public readonly pubkey: string = "";
  public readonly path: string = "";
  public readonly uuid: string = uuid.v4();
  public readonly version: number = 4;

  private kdf(password: string, args: ScryptParams | PBKDF2Params): Buffer {
    switch(this.crypto.kdf.function){
      case "scrypt":
        return scrypt(password, args as ScryptParams);
      case "pbkdf2":
        return PBKDF2(password, args as PBKDF2Params);
      default:
        throw new Error("Unsupported crypto function");
    }
  }

  constructor(keystore?: IKeystoreParams){
    if(keystore){
      this.crypto = new KeystoreCrypto(keystore.crypto);
      this.pubkey = keystore.pubkey || "";
      this.path = keystore.path || "";
      this.uuid = keystore.uuid || uuid.v4();
      this.version = keystore.version || 4;
    }
  }

  public static fromJson(json: string): Keystore {
    const jsonObj = JSON.parse(json) as IKeystoreParams;
    const keystore: IKeystoreParams = {
      crypto: new KeystoreCrypto(jsonObj.crypto || {}),
      path: jsonObj.path,
      pubkey: jsonObj.pubkey,
      uuid: jsonObj.uuid,
      version: jsonObj.version,
    };
    return new Keystore(keystore);
  }

  public static encrypt(secret: bytes, password: string, path = "", kdfSalt: bytes = randomBytes(32), aesIv: bytes = randomBytes(16)): IKeystore {
    
    const keystore = new this({ 
      path: path,
      pubkey: PublicKey.fromPrivateKey(PrivateKey.fromBytes(secret)).toHexString().replace("0x", ""),
      crypto: {
        kdf: {
          params: {
            salt: kdfSalt
          }
        },
        cipher: {
          params: {
            iv: aesIv
          }
        }
      }
    });

    const decryptionKey: bytes = keystore.kdf(password, keystore.crypto.kdf.params);
    const cipher = AES_128_CTR(decryptionKey.slice(0, 16), keystore.crypto.cipher.params.iv);

    let encryptedSecret = cipher.update(secret);
    encryptedSecret = Buffer.concat([encryptedSecret, cipher.final()]);

    keystore.crypto.cipher.message = Buffer.from(encryptedSecret);
    keystore.crypto.checksum.message = SHA256(Buffer.concat([decryptionKey.slice(16, 32), keystore.crypto.cipher.message]));
    
    return keystore;
  }

  public verifyPassword(password: string): boolean {
    const decryptionKey: bytes = this.kdf(password, this.crypto.kdf.params);
    if( SHA256(Buffer.concat([decryptionKey.slice(16, 32), this.crypto.cipher.message])).compare(this.crypto.checksum.message) === 0){
      // Password matches
      return true;
    }
    return false;
  }

  public decrypt(password: string): Buffer {

    if(this.verifyPassword(password) === false){
      throw new Error("Invalid password");
    }
    const decryptionKey: bytes = this.kdf(password, this.crypto.kdf.params);
    const cipher = AES_128_CTR(decryptionKey.slice(0, 16), this.crypto.cipher.params.iv);
    let decryptedSecret = cipher.update(this.crypto.cipher.message);
    decryptedSecret = Buffer.concat([decryptedSecret, cipher.final()]);
    return decryptedSecret;
  }

}

export class Pbkdf2Keystore extends Keystore {
  constructor(keystore: IKeystoreParams) {
    let keystorePbkdf2 = keystore;

    keystorePbkdf2 = deepmerge({
      crypto: {
        kdf: {
          function: "pbkdf2",
          params: DefaultPBKDF2Params,
        },
        checksum: {
          function: "sha256",
        },
        cipher: {
          function: "aes-128-ctr",
        }
      }
    }, keystorePbkdf2)

    super(keystorePbkdf2);
    
  }
}

export class ScryptKeystore extends Keystore {
  constructor(keystore?: IKeystoreParams) {

    let keystoreScrypt = keystore;

    keystoreScrypt = deepmerge({
      crypto: {
        kdf: {
          function: "scrypt",
          params: DefaultScryptParams,
        },
        checksum: {
          function: "sha256",
        },
        cipher: {
          function: "aes-128-ctr",
        }
      }
    }, keystoreScrypt)

    super(keystoreScrypt);
  }
}