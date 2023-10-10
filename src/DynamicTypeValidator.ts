import { TypeConstraint } from "./DynamicTypeReflection";

/**
 * Offers utilities for runtime type validation.
 */
export class DynamicTypeValidator {

    /**
     * Validates if an instance matches the type's structure.
     * @param instance The object instance.
     * @param type The expected type.
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
     * @param instance The object instance.
     * @param type The expected type.
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

    /**
     * Validates an instance against a provided schema with custom constraints.
     * @param instance The object instance.
     * @param schema The expected schema.
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