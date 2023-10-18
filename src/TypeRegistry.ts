/**
 * @file TypeRegistry.ts
 * Manages registration and retrieval of types.
 */

import { TypeConstraint } from './TypeConstraint';
import { ErrorManager, ErrorType } from './ErrorManager';
import { TypeLogger } from './TypeLogger';

/**
 * Registers and manages custom types.
 */
export class TypeRegistry {
  private static registeredTypes: Map<string, TypeConstraint> = new Map();

  /**
   * Registers a new type.
   * @param typeName - The name of the type to register.
   * @param constraint - The constraint that the type must satisfy.
   */
  public static registerType(typeName: string, constraint: TypeConstraint): void {
    if (!typeName || !typeName.trim()) {
      ErrorManager.handleError(ErrorType.RequiredParameterMissing, 'Type name is required.');
    }
    if (!constraint) {
      ErrorManager.handleError(ErrorType.RequiredParameterMissing, 'Constraint is required.');
    }
    if (TypeRegistry.registeredTypes.has(typeName)) {
      ErrorManager.handleError(ErrorType.Registration, `Type ${typeName} is already registered.`);
    }
    TypeRegistry.registeredTypes.set(typeName, constraint);
    TypeLogger.log(`Registered new type: ${typeName}`);
  }

  /**
   * Retrieves the constraints for a registered type.
   * @param typeName - The name of the type to retrieve.
   * @returns The type constraints if found, otherwise null.
   */
  public static getRegisteredType(typeName: string): TypeConstraint | null {
    return this.registeredTypes.get(typeName) || null;
  }

  /**
   * Retrieves all registered types.
   * @returns An array of all registered type names.
   */
  public static getAllRegisteredTypes(): string[] {
    return Array.from(this.registeredTypes.keys());
  }


  /**
 * Clears all registered types. Useful for testing.
 * @returns void.
 */
  public static clear(): void {
    this.registeredTypes.clear();
  }
}
