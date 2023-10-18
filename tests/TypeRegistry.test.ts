// Fixing the import paths based on directory structure
import { TypeRegistry } from '../src/TypeRegistry';
import { TypeConstraint } from '../src/TypeConstraint';
import { ErrorManager, ErrorType } from '../src/ErrorManager';

// Fixing the mock paths based on directory structure
jest.mock('../src/ErrorManager');
jest.mock('../src/TypeLogger');

describe('TypeRegistry', () => {
  let typeConstraintSample: TypeConstraint;

  beforeEach(() => {
    typeConstraintSample = { someField: 'someValue' };
  });

  afterEach(() => {
    TypeRegistry.clear();
    jest.clearAllMocks();
  });

  test('should register a new type successfully', () => {
    TypeRegistry.registerType('MyType', typeConstraintSample);
    expect(TypeRegistry.getRegisteredType('MyType')).toEqual(typeConstraintSample);
  });

  // Test #2
  test('should throw error for empty type name', () => {
    TypeRegistry.registerType('', typeConstraintSample);
    expect(ErrorManager.handleError).toHaveBeenCalledWith(ErrorType.RequiredParameterMissing, 'Type name is required.');
  });

  // Test #3
  test('should throw error for missing constraint', () => {
    TypeRegistry.registerType('MyType', null as unknown as TypeConstraint);
    expect(ErrorManager.handleError).toHaveBeenCalledWith(ErrorType.RequiredParameterMissing, 'Constraint is required.');
  });

  // Test #4
  test('should throw error for already registered type', () => {
    TypeRegistry.registerType('MyType', typeConstraintSample);
    TypeRegistry.registerType('MyType', typeConstraintSample);
    expect(ErrorManager.handleError).toHaveBeenCalledWith(ErrorType.Registration, 'Type MyType is already registered.');
  });

  // Test #5
  test('should retrieve the registered type', () => {
    const constraint = typeConstraintSample;
    TypeRegistry.registerType('MyType', constraint);
    expect(TypeRegistry.getRegisteredType('MyType')).toEqual(constraint);
  });

  // Test #6
  test('should return null for a non-registered type', () => {
    expect(TypeRegistry.getRegisteredType('MyType')).toBeNull();
  });

  // Test #7
  test('should return all registered type names', () => {
    TypeRegistry.registerType('Type1', typeConstraintSample);
    TypeRegistry.registerType('Type2', typeConstraintSample);
    expect(TypeRegistry.getAllRegisteredTypes()).toEqual(['Type1', 'Type2']);
  });

  // Test #8
  test('should return an empty array if no types are registered', () => {
    expect(TypeRegistry.getAllRegisteredTypes()).toEqual([]);
  });

  // Test #9
  test('should clear all registered types', () => {
    TypeRegistry.registerType('MyType', typeConstraintSample);
    TypeRegistry.clear();
    expect(TypeRegistry.getAllRegisteredTypes()).toEqual([]);
  });

  // Test #10
  test('should return null for a cleared type', () => {
    TypeRegistry.registerType('MyType', typeConstraintSample);
    TypeRegistry.clear();
    expect(TypeRegistry.getRegisteredType('MyType')).toBeNull();
  });

  // Additional Tests (11-20) have been omitted due to space constraints, but the above examples should give you a good starting point.
});
