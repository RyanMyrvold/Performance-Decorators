import { CodeGenerator } from "../src/CodeGenerator";
import { TypeConstraint } from "../src/DynamicTypeReflection";

describe('CodeGenerator', () => {
    describe('populateTemplate', () => {
        it('should generate code with type constraints', () => {
            const template = 'function {{name}}() { return {{value}}; }';
            const constraints = { name: 'getName', value: '"Alice"' };
            const generatedCode = CodeGenerator.populateTemplate(template, constraints);
            expect(generatedCode).toBe('function getName() { return "Alice"; }');
        });

        it('should generate code even with missing constraints', () => {
            const template = 'function {{name}}() { return {{value}}; }';
            const constraints = { name: 'getName' }; // missing value
            const generatedCode = CodeGenerator.populateTemplate(template, constraints);
            expect(generatedCode).toBe('function getName() { return {{value}}; }');
        });

        it('should handle nested constraints', () => {
            const template = 'The car is {{car.color}} and travels at {{car.speed}} mph';
            const constraints = { car: { color: 'red', speed: '100' } };
            const generatedCode = CodeGenerator.populateTemplate(template, constraints);
            expect(generatedCode).toBe('The car is red and travels at 100 mph');
        });

        it('should not replace placeholders for which constraints are not available', () => {
            const template = 'My name is {{name}} and I live in {{city}}';
            const constraints = { name: 'Alice' };
            const generatedCode = CodeGenerator.populateTemplate(template, constraints);
            expect(generatedCode).toBe('My name is Alice and I live in {{city}}');
        });

        it('should substitute placeholders with provided type constraints', () => {
            const template = "Hello, {{name}}! Age: {{age}}";
            const constraints = { name: "John", age: "25" };
            const result = CodeGenerator.populateTemplate(template, constraints);
            expect(result).toBe("Hello, John! Age: 25");
        });

        it('should handle array values in constraints', () => {
            const template = "Values: {{values}}";
            const constraints = { values: ["1", "2", "3"] };
            const result = CodeGenerator.populateTemplate(template, constraints);
            expect(result).toBe("Values: 1, 2, 3");
        });
    });

    describe('compileComplexTemplate', () => {
        it('should handle loops and substitute placeholders', () => {
            const template = "Names: @for(names) {{item}}, @endfor";
            const constraints = { names: ["John", "Doe", "Jane"] };
            const result = CodeGenerator.compileComplexTemplate(template, constraints);
            expect(result).toBe("Names: John, Doe, Jane");
        });

        it('should handle complex templates with loops and placeholders', () => {
            const template = "Hello, {{name}}! Friends: @for(friends) {{item}}, @endfor";
            const constraints = { name: "John", friends: ["Doe", "Jane"] };
            const result = CodeGenerator.compileComplexTemplate(template, constraints);
            expect(result).toBe("Hello, John! Friends: Doe, Jane");
        });

        it('should process loops and then fill in remaining placeholders', () => {
            const template = "Hello, {{name}}! @for(days) On {{item}}, @endfor I will code.";
            const constraints = { name: "John", days: ["Monday", "Tuesday", "Wednesday"] };
            const result = CodeGenerator.compileComplexTemplate(template, constraints);
            expect(result).toBe("Hello, John! On Monday, On Tuesday, On Wednesday, I will code.");
        });


        it('should return an empty string for loops with no items', () => {
            const template = 'Friends: @for(friends) {{item}}, @endfor';
            const constraints: TypeConstraint = { friends: [] };
            const generatedCode = CodeGenerator.compileComplexTemplate(template, constraints);
            expect(generatedCode).toBe('Friends: ');
        });

        it('should not properly process nested loops', () => {
            const template = '@for(groups) Group: {{item}} @for(members) {{item}}, @endfor @endfor';
            const constraints: TypeConstraint = {
                groups: ["Developers", "Designers"],
                members: ["John", "Jane"]
            };
            const generatedCode = CodeGenerator.compileComplexTemplate(template, constraints);
            expect(generatedCode).toBe('Group: Developers @for(members) Developers, Group: Designers @for(members) Designers @endfor');
        });

        it('should sanitize special characters in loop items', () => {
            const template = 'Output: @for(items) {{item}} @endfor';
            const constraints: TypeConstraint = { items: ['[Special]', '(Characters)'] };
            const generatedCode = CodeGenerator.compileComplexTemplate(template, constraints);
            expect(generatedCode).toBe('Output: \\[Special\\] \\(Characters\\) ');
        });
    });
});