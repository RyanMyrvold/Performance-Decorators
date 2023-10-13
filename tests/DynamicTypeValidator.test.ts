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

        it('should throw custom error messages', () => {
            const validator = new DynamicTypeValidator();
            expect(() => validator.isOfType('string', 'number', 'Custom error message')).toThrow('Custom error message');
            expect(() => validator.isArrayType([1, 'a'], 'number', 'Custom array error message')).toThrow('Custom array error message');
        });

        it('should throw specific error types', () => {
            const validator = new DynamicTypeValidator();
            expect(() => validator.isOfType('string', 'number')).toThrow(TypeError);
            expect(() => validator.isArrayType([1, 'a'], 'number')).toThrow(TypeError);
        });

        it('should validate array types', () => {
            const validator = new DynamicTypeValidator();
            expect(validator.isArrayType([1, 2, 3], 'number')).toBe(true);
            expect(validator.isArrayType(['a', 'b'], 'string')).toBe(true);
            expect(() => validator.isArrayType([1, 'a'], 'number')).toThrow(TypeError);
        });

        it('should handle asynchronous type validation', async () => {
            const validator = new DynamicTypeValidator();
            await expect(validator.isAsyncType('string', 'string')).resolves.toBe(true);
            await expect(validator.isAsyncType('string', 'number')).rejects.toThrow(TypeError);
        });

        it('should handle type coercion', () => {
            const validator = new DynamicTypeValidator();
            expect(() => validator.isStrictType('1', 'number')).toThrow(TypeError);
            expect(() => validator.isStrictType(NaN, 'number')).toThrow(TypeError);
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

    describe('Type Transformation', () => {
        it('should transform types based on schema', () => {
            const validator = new DynamicTypeValidator();
            const transformationSchema = {
                age: (val: string) => parseInt(val, 10),
                isActive: (val: string) => val === 'true'
            };

            const obj = { name: 'John', age: '30', isActive: 'true' };
            const transformedObj = validator.transformTypes(obj, transformationSchema);

            expect(transformedObj).toEqual({ name: 'John', age: 30, isActive: true });
        });

        it('should handle missing keys gracefully', () => {
            const validator = new DynamicTypeValidator();
            const transformationSchema = {
                age: (val: string) => parseInt(val, 10),
                isActive: (val: string) => val === 'true'
            };

            const obj = { name: 'John' };
            const transformedObj = validator.transformTypes(obj, transformationSchema);

            expect(transformedObj).toEqual({ name: 'John' });
        });

        it('should handle nested objects', () => {
            const validator = new DynamicTypeValidator();
            const transformationSchema = {
                'address.zip': (val: string) => parseInt(val, 10)
            };

            const obj = { name: 'John', address: { zip: '12345' } };
            const transformedObj = validator.transformTypes(obj, transformationSchema);

            expect(transformedObj).toEqual({ name: 'John', address: { zip: 12345 } });
        });

        it('should handle arrays', () => {
            const validator = new DynamicTypeValidator();
            const transformationSchema = {
                'scores': (val: string[]) => val.map(v => parseInt(v, 10))
            };

            const obj = { name: 'John', scores: ['90', '85', '77'] };
            const transformedObj = validator.transformTypes(obj, transformationSchema);

            expect(transformedObj).toEqual({ name: 'John', scores: [90, 85, 77] });
        });

        it('should handle custom transformations', () => {
            const validator = new DynamicTypeValidator();
            const transformationSchema = {
                'timestamp': (val: string) => new Date(parseInt(val, 10))
            };

            const obj = { name: 'John', timestamp: '1633027200000' };
            const transformedObj = validator.transformTypes(obj, transformationSchema);

            expect(transformedObj).toEqual({ name: 'John', timestamp: new Date(1633027200000) });
        });
    });

    describe('Assigning default values', () => {
        it('should assign default values based on schema', () => {
            const validator = new DynamicTypeValidator();
            const defaultSchema = {
                age: 30,
                isActive: true
            };

            const obj = { name: 'John' };
            const newObj = validator.assignDefaultValues(obj, defaultSchema);

            expect(newObj).toEqual({ name: 'John', age: 30, isActive: true });
        });

        it('should not overwrite existing values', () => {
            const validator = new DynamicTypeValidator();
            const defaultSchema = {
                age: 30,
                isActive: true
            };

            const obj = { name: 'John', age: 25 };
            const newObj = validator.assignDefaultValues(obj, defaultSchema);

            expect(newObj).toEqual({ name: 'John', age: 25, isActive: true });
        });

        it('should assign default values based on schema', () => {
            const validator = new DynamicTypeValidator();
            const defaultSchema = {
                age: 30,
                isActive: true
            };

            const obj = { name: 'John' };
            const newObj = validator.assignDefaultValues(obj, defaultSchema);

            expect(newObj).toEqual({ name: 'John', age: 30, isActive: true });
        });

        it('should not overwrite existing values', () => {
            const validator = new DynamicTypeValidator();
            const defaultSchema = {
                age: 30,
                isActive: true
            };

            const obj = { name: 'John', age: 25 };
            const newObj = validator.assignDefaultValues(obj, defaultSchema);

            expect(newObj).toEqual({ name: 'John', age: 25, isActive: true });
        });

        it('should handle null and undefined values', () => {
            const validator = new DynamicTypeValidator();
            const defaultSchema = {
                age: 30,
                isActive: null
            };

            const obj = { name: 'John', isActive: undefined };
            const newObj = validator.assignDefaultValues(obj, defaultSchema);

            expect(newObj).toEqual({ name: 'John', age: 30, isActive: null });
        });

        it('should handle empty objects and schemas', () => {
            const validator = new DynamicTypeValidator();

            const obj = {};
            const newObj = validator.assignDefaultValues(obj, {});

            expect(newObj).toEqual({});
        });

        it('should handle nested objects', () => {
            const validator = new DynamicTypeValidator();
            const defaultSchema = {
                address: {
                    city: 'Unknown',
                    zip: '00000'
                }
            };

            const obj = { name: 'John', address: { city: 'San Francisco' } };
            const newObj = validator.assignDefaultValues(obj, defaultSchema);

            expect(newObj).toEqual({ name: 'John', address: { city: 'San Francisco', zip: '00000' } });
        });
    });
});