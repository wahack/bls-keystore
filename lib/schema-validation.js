"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidKeystore = exports.validateKeystore = exports.schemaValidationErrors = void 0;
const schema_validation_generated_1 = require("./schema-validation-generated");
// Redeclare generated function with the proper type
const _validateKeystore = schema_validation_generated_1.Keystore;
/**
 * Return schema validation errors for a potential keystore object
 */
// This function wraps the generated code weirdness
function schemaValidationErrors(data) {
    const validated = _validateKeystore(data);
    if (validated) {
        return null;
    }
    return _validateKeystore.errors;
}
exports.schemaValidationErrors = schemaValidationErrors;
/**
 * Validate an unknown object as a valid keystore, throws on invalid keystore
 */
function validateKeystore(keystore) {
    const errors = schemaValidationErrors(keystore);
    if (errors) {
        throw new Error(errors.map((error) => `${error.instancePath}: ${error.message}`).join('\n'));
    }
}
exports.validateKeystore = validateKeystore;
/**
 * Predicate for validating an unknown object as a valid keystore
 */
function isValidKeystore(keystore) {
    return !schemaValidationErrors(keystore);
}
exports.isValidKeystore = isValidKeystore;
