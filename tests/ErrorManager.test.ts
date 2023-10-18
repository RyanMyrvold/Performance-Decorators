// ErrorManager.test.ts

import { ErrorManager, ErrorType } from '../src/ErrorManager';

describe('ErrorManager', () => {

  it('should throw a validation error', () => {
    const errorMessage = 'Invalid value';
    expect(() => {
      ErrorManager.handleError(ErrorType.Validation, errorMessage);
    }).toThrow(`Validation Error: ${errorMessage}`);
  });

  it('should throw a coercion error', () => {
    const errorMessage = 'Cannot coerce to string';
    expect(() => {
      ErrorManager.handleError(ErrorType.Coercion, errorMessage);
    }).toThrow(`Unable to Coerce Type: ${errorMessage}`);
  });

  it('should throw a required parameter missing error', () => {
    const errorMessage = 'Parameter is missing';
    expect(() => {
      ErrorManager.handleError(ErrorType.RequiredParameterMissing, errorMessage);
    }).toThrow(`Required Parameter missing: ${errorMessage}`);
  });

  it('should throw a registration error', () => {
    const errorMessage = 'Duplicate registration';
    expect(() => {
      ErrorManager.handleError(ErrorType.Registration, errorMessage);
    }).toThrow(`Registration Error: ${errorMessage}`);
  });

  it('should throw a constraint violation error', () => {
    const errorMessage = 'Constraint violated';
    expect(() => {
      ErrorManager.handleError(ErrorType.ConstraintViolationError, errorMessage);
    }).toThrow(`Constraint Violation Error: ${errorMessage}`);
  });

  it('should throw an unknown error', () => {
    const errorMessage = 'Some weird error';
    expect(() => {
      ErrorManager.handleError(-1 as unknown as ErrorType, errorMessage);
    }).toThrow(`Unknown Error: ${errorMessage}`);
  });
});
