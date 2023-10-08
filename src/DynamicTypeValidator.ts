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
    public static validateType(instance: any, type: any): boolean {
        for (let key in type) {
            if (!(key in instance) || typeof instance[key] !== type[key]) {
                return false;
            }
        }

        for (let key in instance) {
            if (!(key in type)) {
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
}
