/**
 * TypeCoercer class for type coercion.
 */
export class TypeCoercer {
    /**
     * Coerce a single value to a target type.
     * @param value The value to be coerced.
     * @param targetType The target type to which the value should be coerced.
     * @returns The coerced value.
     */
    static coerce<T>(value: any, targetType: string): T | null {
        try {
            if (value === "" && targetType === "number") {
                return null;
            }
            switch (targetType) {
                case 'number':
                    if (isNaN(Number(value))) return null;
                    return Number(value) as unknown as T;
                case 'boolean':
                    return (value === 'true') as unknown as T;
                case 'string':
                    return value.toString() as unknown as T;
                default:
                    return null;
            }
        } catch (e) {
            return null;
        }
    }

/**
 * Coerce the given object according to the provided constraints.
 *
 * @template T The target type to coerce to.
 * @param {any} obj The object to coerce.
 * @param {any} constraints The constraints that dictate the types to coerce to.
 * @returns {Promise<T | null | undefined>} The coerced object or null or undefined based on input.
 */
static async coerceObject<T>(obj: any, constraints: any): Promise<T | null | undefined> {
    // Handle null and undefined objects
    if (obj === null || obj === undefined) {
      return obj;
    }
    
    const coercedObj: any = {};
  
    for (const key in constraints) {
      const targetType = constraints[key];
  
      // Handle nested objects
      if (typeof targetType === 'object' && !Array.isArray(targetType) && obj[key] !== null && obj[key] !== undefined) {
        coercedObj[key] = await this.coerceObject(obj[key], targetType);
        continue;
      }
      
      // Handle nested arrays
      if (Array.isArray(targetType)) {
        coercedObj[key] = await Promise.all(
          obj[key].map(async (item: any) => {
            if (Array.isArray(item)) {
              return await Promise.all(item.map((nestedItem: any) => this.coerce(nestedItem, targetType[0][0])));
            }
            return this.coerce(item, targetType[0]);
          })
        );
      } else {
        coercedObj[key] = this.coerce(obj[key], targetType);
      }
    }
  
    return coercedObj;
  }
  

}
