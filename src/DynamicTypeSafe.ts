/**
 * Type guard function to check if a string is a valid type descriptor.
 * @param str - The string to check.
 * @returns Boolean indicating if the string is a valid type descriptor.
 */
function isValidTypeDescriptor(str: string): boolean {
  const validTypes = ['string', 'number', 'boolean', 'object', 'function', 'symbol', 'undefined'];
  return validTypes.includes(str);
}

/**
 * Main library class to create dynamic types.
 */
export class DynamicTypeSafe {

  /**
   * Creates a dynamic type based on the provided schema.
   * @param schema - The structure definition.
   * @returns A constructor function for the dynamic type.
   * @throws Error if the schema contains an invalid type descriptor.
   */
  public static createDynamicType(schema: Record<string, string>): new () => any {
    // Validate the schema.
    for (const key in schema) {
      if (!isValidTypeDescriptor(schema[key])) {
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