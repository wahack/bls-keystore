import { IKeystore } from "./types";
type ErrorObject = {
    instancePath: string;
    schemaPath: string;
    keyword: string;
    params: object;
    message: string;
};
/**
 * Return schema validation errors for a potential keystore object
 */
export declare function schemaValidationErrors(data: unknown): ErrorObject[] | null;
/**
 * Validate an unknown object as a valid keystore, throws on invalid keystore
 */
export declare function validateKeystore(keystore: unknown): asserts keystore is IKeystore;
/**
 * Predicate for validating an unknown object as a valid keystore
 */
export declare function isValidKeystore(keystore: unknown): keystore is IKeystore;
export {};
