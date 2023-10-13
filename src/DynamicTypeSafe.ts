
/**
 * Main library class to create dynamic types.
 */
export class DynamicTypeSafe {

  private static validTypes = new Set(['string', 'number', 'boolean', 'object', 'function', 'symbol', 'undefined']);
  private static typeAliases: Record<string, string> = {};

  /**
   * Registers a type alias.
   * @param alias - The alias to register.
   * @param actualType - The actual type that the alias represents.
   */
  public static registerTypeAlias(alias: string, actualType: string): void {
    this.typeAliases[alias] = actualType;
  }

  /**
 * Type guard function to check if a string is a valid type descriptor.
 * @param str - The string to check.
 * @returns Boolean indicating if the string is a valid type descriptor.
 */
  public static isValidTypeDescriptor(str: string): boolean {
    return this.validTypes.has(str) || this.typeAliases.hasOwnProperty(str);
  }


  /**
   * Creates a dynamic type based on the provided schema.
   * @param schema - The structure definition.
   * @returns A constructor function for the dynamic type.
   * @throws Error if the schema contains an invalid type descriptor.
   */
  public static createDynamicType(schema: Record<string, string>): new () => any {
    // Validate the schema.
    for (const key in schema) {
      if (!this.isValidTypeDescriptor(schema[key])) {
        throw new Error(`Invalid type descriptor for property ${key}: ${schema[key]}`);
      }
    }

    // Create a dynamic class.
    class DynamicClass {
      constructor() {
        // Initialize the properties of the dynamic class.
        for (const key in schema) {
          (this as any)[key] = null;
        }
      }
    }

    // Return the constructor function for the dynamic type.
    return DynamicClass;
  }
}