/**
 * Validates types against provided constraints.
 */
export class TypeValidator {
  
  /**
   * Validates an object against a set constraint.
   * 
   * @param object - The object to validate.
   * @param constraint - The type constraint to validate against.
   * @returns {boolean} - Returns true if the object validates against the constraint, otherwise false.
   *
   * @example
   * Here is how you can use `validateObject` method to validate an object against a constraint.
   * @code
   * const myObject = { key1: 'value1', key2: 42 };
   * const myConstraint = { key1: 'string', key2: 'number' };
   *
   * const result = TypeValidator.validateObject(myObject, myConstraint);
   * console.log(result);  // Output will be true
   * @endcode
   */
  public static validateObject(object: any, constraint: Record<string, any>): boolean {
    // Handle null and undefined object
    if (object == null) return false;

    for (const [key, type] of Object.entries(constraint)) {
      if (!(key in object)) return false;
      if (typeof object[key] !== type) return false;
    }
    return true;
  }
}