import { DynamicTypeValidator } from "../src/DynamicTypeValidator";

const userSchema = {
    name: { 
        type: 'string', 
        constraints: (value: string) => {
            if (typeof value === 'string' && value.length <= 2) {
                return true;
            }
            return false;
        } 
    },
    age: { 
        type: 'number', 
        constraints: (value: number) => {
            if (typeof value === 'number' && value >= 18) {
                return true;
            }
            return false;
        }
    },
    address: {
        city: { type: 'string' },
        zip: { 
            type: 'number', 
            constraints: (value: number) => {
                if (typeof value === 'number' && value <= 500) {
                    return true;
                }
                return false;
            }
        }
    },
    gender: { type: 'string', optional: true }
};


describe('DynamicTypeValidator', () => {

    describe('Validation', () => {

        const baseType = { name: 'string', age: 'number' };

        it('rejects instances with missing properties', () => {
            const instanceWithMissingProps = { name: 'Alice' };
            expect(DynamicTypeValidator.validateType(instanceWithMissingProps, baseType)).toBe(false);
        });

        it('rejects instances with extra properties', () => {
            const instanceWithExtraProps = { name: 'Alice', age: 30, height: 160 };
            expect(DynamicTypeValidator.validateType(instanceWithExtraProps, baseType)).toBe(false);
        });

        it('accepts instances that match the type', () => {
            const validInstance = { name: 'Alice', age: 30 };
            expect(DynamicTypeValidator.validateType(validInstance, baseType)).toBe(true);
        });

    });

    describe('Custom Constraints Validation', () => {

        it('validates instance with constraints successfully', () => {
            const userSchema = {
                name: 'string',
                age: {
                    type: 'number',
                    constraints: [
                        (value: number) => value >= 18
                    ]
                }
            };

            const user = {
                name: "John",
                age: 20
            };

            const errors = DynamicTypeValidator.validateSchema(user, userSchema);
            expect(errors.length).toBe(0);
        });

        it('detects constraint violations in instance', () => {
            const user = { name: 'Jo', age: 16, address: { city: 'NYC', zip: 999 } };
            const errors = DynamicTypeValidator.validateSchema(user, userSchema);
            expect(errors).toEqual([
                "Constraint failed for property age with value 16",
                "Constraint failed for property address.zip with value 999"
            ]);
        });
    

        it('validates instance with multiple constraints successfully', () => {
            const user = {
                name: "Jo", // shortened the name to fit the constraint
                age: 25,
                address: {
                    city: "New York",
                    zip: 100
                }
            };
            const errors = DynamicTypeValidator.validateSchema(user, userSchema);
            expect(errors.length).toBe(0);
        });

        it('detects multiple constraint violations in instance', () => {
            const user = { name: 'Jo', age: 105, address: { zip: 999 } };
            const errors = DynamicTypeValidator.validateSchema(user, userSchema);
            expect(errors).toContain("Constraint failed for property address.zip with value 999");
            expect(errors).not.toContain("Constraint failed for property name with value Jo");
        });

        it('detects missing properties in instance', () => {
            const userSchema = {
                name: { type: 'string' },
                age: { type: 'number' },
                address: {
                    city: { type: 'string' },
                    zip: { type: 'number' }
                }
            };
            const user = { name: 'Jo', age: 105 };  // The address property is missing
        
            const errors = DynamicTypeValidator.validateSchema(user, userSchema);
        
            expect(errors).toContain("Missing property address.city");
            expect(errors).toContain("Missing property address.zip");
        });

        it('detects unwanted properties in instance', () => {
            const user = { name: 'Jo', age: 29, gender: 'male', unwanted: 'unwantedValue' };
            const errors = DynamicTypeValidator.validateSchema(user, userSchema);
            expect(errors).toContain("Constraint failed for property unwanted with value unwantedValue");
        });

        it('validates constraints on nested objects', () => {
            const user = { name: 'Jo', age: 29, address: { city: 'New York', zip: 500 } };
            const errors = DynamicTypeValidator.validateSchema(user, userSchema);
            expect(errors.length).toBe(0);
        });

    });

});