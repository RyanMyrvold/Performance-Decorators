/**
 * Main library class to create dynamic types.
 */
export class DynamicTypeSafe {

    /**
    * Creates a dynamic type based on the provided schema.
    * @param schema The structure definition.
    * @returns A constructor function for the dynamic type.
    */
    public static createDynamicType(schema: Record<string, string>): new () => any {
        const validTypes = ['string', 'number', 'boolean', 'object', 'function', 'symbol', 'undefined'];
        for (const key in schema) {
            if (!validTypes.includes(schema[key])) {
                throw new Error(`Invalid type descriptor for property ${key}: ${schema[key]}`);
            }
        }

        class DynamicClass {
            constructor() {
                for (let key in schema) {
                    (this as any)[key] = null;
                }
            }
        }

        return DynamicClass;
    }
}
