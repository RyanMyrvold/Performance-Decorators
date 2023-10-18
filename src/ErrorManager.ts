/**
 * @file ErrorDispatcher.ts
 * Provides centralized logic for classifying and dispatching errors.
 */

/**
 * @enum ErrorType
 * Enumeration representing different kinds of errors.
 */
export enum ErrorType {
    RequiredParameterMissing,
    Coercion,
    Validation,
    Registration,
    ConstraintViolationError
}

/**
 * @class ErrorManager
 * Class responsible for dispatching application errors.
 * Not a part of the public API.
 */
export class ErrorManager {
    /**
     * @static
     * Classifies the error message based on the type.
     * @param {ErrorType} errorType - The type of the error.
     * @param {string} message - The specific error message.
     * @returns {string} - The full error message classified by the type.
     */
    private static classifyErrorMessage(errorType: ErrorType, message: string): string {
        switch (errorType) {
            case ErrorType.Validation:
                return `Validation Error: ${message}`;
            case ErrorType.Coercion:
                return `Unable to Coerce Type: ${message}`;
            case ErrorType.RequiredParameterMissing:
                return `Required Parameter missing: ${message}`;
            case ErrorType.Registration:
                return `Registration Error: ${message}`;
            case ErrorType.ConstraintViolationError:
                return `Constraint Violation Error: ${message}`;
            default:
                return `Unknown Error: ${message}`;
        }
    }

    /**
     * @static
     * Handles a given error by throwing an exception with the classified message.
     * @param {ErrorType} errorType - The type of the error.
     * @param {string} message - The specific error message.
     * @throws {Error} - Throws a new error with the classified message.
     */
    public static handleError(errorType: ErrorType, message: string): void {
        const errorMsg = this.classifyErrorMessage(errorType, message);
        this.throwError(errorMsg);
    }

    /**
     * @static
     * Throws an error with the given message.
     * @param {string} message - The message for the error.
     * @throws {Error} - Throws a new error with the given message.
     */
    private static throwError(message: string): void {
        throw new Error(message);
    }
}
