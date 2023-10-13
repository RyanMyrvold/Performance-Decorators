/**
 * Offers utilities for runtime type validation.
 */
export class DynamicTypeValidator {

  /**
   * Validates if an instance matches the type's structure.
   * @param instance - The object instance.
   * @param type - The expected type.
   * @returns Boolean indicating if instance matches type.
   */
  static validateType(instance: any, type: any): boolean {
    for (let key in type) {
      if (typeof type[key] === 'object' && !Array.isArray(type[key])) {
        if (!instance[key] || !this.validateType(instance[key], type[key])) {
          return false;
        }
      } else if (typeof instance[key] !== type[key]) {
        return false;
      }
    }

    // Check for extra properties in instance not in type
    for (let key in instance) {
      if (!type.hasOwnProperty(key)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Validates if an instance matches the type's structure and returns discrepancies.
   * @param instance - The object instance.
   * @param type - The expected type.
   * @returns An array of discrepancies if any, else an empty array.
   */
  public static getDiscrepancies(instance: any, type: any): string[] {
    const discrepancies: string[] = [];

    for (let key in type) {
      if (!(key in instance) || typeof instance[key] !== type[key]) {
        discrepancies.push(`Expected property ${key} of type ${type[key]} but got ${typeof instance[key]}`);
      }
    }

    for (let key in instance) {
      if (!(key in type)) {
        discrepancies.push(`Extra property ${key} of type ${typeof instance[key]} found`);
      }
    }

    return discrepancies;
  }

  /***
  * This function checks whether all elements of an array are of the same type, and throws an error if they are not.
  * @param arr - the array to check
  * @param type - the type to check for
  * @param customMessage - an optional custom message to throw if the array contains elements of different types
  * @returns true if all elements of the array are of the same type
  */
  public isArrayType(arr: any[], type: string, customMessage?: string): boolean {
    if (!arr.every(item => typeof item === type)) {
      throw new TypeError(customMessage || `Expected array of ${type}, got array of different types`);
    }
    return true;
  }



  /**
   * Asynchronously checks if a value is of a certain type.
   * @param {any} value The value to check.
   * @param {string} type The type to check against.
   * @param {string} [customMessage] A custom message to use if the check fails.
   * @returns {Promise<boolean>} A promise that resolves to true if the value is of the given type, or rejects if not.
   */
  async isAsyncType(value: any, type: string, customMessage?: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (typeof value !== type) {
        reject(new TypeError(customMessage || `Expected ${type}, got ${typeof value}`));
      } else {
        resolve(true);
      }
    });
  }


  /**
   * Validates if the type of the value is the same as the specified type.
   * If the type is not the same, a TypeError is thrown with the specified custom message.
   * @param value - The object value.
   * @param type - The expected type.
   * @param customMessage - Optional custom error message.
   * @returns Boolean indicating if instance matches type.
   */
  public isStrictType(value: any, type: string, customMessage?: string): boolean {
    if (typeof value !== type || (type === 'number' && isNaN(value))) {
      throw new TypeError(customMessage || `Expected ${type}, got ${typeof value}`);
    }
    return true;
  }

  /**
  * Validates if the value is of a given type.
  * @param value - The value to check.
  * @param type - The type to check against.
  * @param customMessage - An optional custom error message.
  * @returns true if the value is of the given type; otherwise, false.
  **/
  public isOfType(value: any, type: string, customMessage?: string): boolean {
    if (typeof value !== type) {
      throw new TypeError(customMessage || `Expected ${type}, got ${typeof value}`);
    }
    return true;
  }

  /**
   * Transforms types in an object by using the provided transformationSchema.
   * @param obj - The object to transform.
   * @param transformationSchema - The transformation schema.
   * @param parentKey - The parent key (used for recursion).
   * @returns The transformed object.
   */
  public transformTypes(obj: any, transformationSchema: { [key: string]: Function }, parentKey?: string): any {
    const transformedObj = Array.isArray(obj) ? [...obj] : { ...obj };
    for (const [key, transformer] of Object.entries(transformationSchema)) {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;
      const keys = fullKey.split('.');
      let tempObj = transformedObj;
      for (let i = 0; i < keys.length - 1; i++) {
        tempObj = tempObj[keys[i]];
      }
      const lastKey = keys[keys.length - 1];
      if (tempObj && tempObj.hasOwnProperty(lastKey)) {
        tempObj[lastKey] = transformer(tempObj[lastKey]);
      }
    }
    return transformedObj;
  }

  /**
   * Assigns default values to an object based on a provided default schema.
   * @param obj - The object to assign default values to.
   * @param defaultSchema - The default schema.
   * @returns The object with default values assigned.
   */
  assignDefaultValues(obj: any, defaultSchema: { [key: string]: any }): any {
    const newObj = { ...obj };
    for (const [key, defaultValue] of Object.entries(defaultSchema)) {
      if (typeof defaultValue === 'object' && defaultValue !== null) {
        newObj[key] = this.assignDefaultValues(newObj[key] || {}, defaultValue);
      } else if (obj[key] === undefined) {
        newObj[key] = defaultValue;
      }
    }
    return newObj;
  }

  /**
   * Validates an instance against a provided schema with custom constraints.
   * @param instance - The object instance.
   * @param schema - The expected schema.
   * @returns An array of discrepancies if any, else an empty array.
   */
  static validateSchema(instance: any, schema: any): string[] {
    const errors: string[] = [];

    function traverse(instancePart: any, schemaPart: any, parentKey?: string): void {
      for (let key in schemaPart) {
        const schemaDef = schemaPart[key];
        const instanceVal = instancePart ? instancePart[key] : undefined;
        const fullKey = parentKey ? `${parentKey}.${key}` : key;

        if (typeof schemaDef === 'object' && !(schemaDef instanceof Array) && schemaDef.type) {
          if (instanceVal === undefined && !schemaDef.optional) {
            errors.push(`Missing property ${fullKey}`);
          } else if (instanceVal !== undefined && typeof instanceVal !== schemaDef.type) {
            errors.push(`Constraint failed for property ${fullKey} with value ${instanceVal}`);
          } else if (schemaDef.constraints && typeof schemaDef.constraints === 'function' && !schemaDef.constraints(instanceVal)) {
            errors.push(`Constraint failed for property ${fullKey} with value ${instanceVal}`);
          }
        } else if (typeof schemaDef === 'object' && !(schemaDef instanceof Array)) {
          traverse(instanceVal, schemaDef, fullKey);
        }
      }

      if (instancePart) {
        for (let key in instancePart) {
          if (!schemaPart[key]) {
            errors.push(`Constraint failed for property ${key} with value ${instancePart[key]}`);
          }
        }
      }
    }

    traverse(instance, schema);

    return errors;
  }
}