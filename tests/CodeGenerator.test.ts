import { CodeGenerator } from "../src/CodeGenerator";

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
        });
    });