import { TypeConstraint } from "./DynamicTypeReflection";

/**
 * Contains utilities for code generation based on templates.
 */
export class CodeGenerator {

    /**
     * Populates a template based on the provided type constraints.
     * @param template The code template.
     * @param typeConstraints Constraints for the code.
     * @returns Populated code as a string.
     */
    public static populateTemplate(template: string, constraints: any): string {
        function replacePlaceholders(temp: string, constraint: any, prefix = ''): string {
            for (let key in constraint) {
                if (typeof constraint[key] === 'object' && !Array.isArray(constraint[key])) {
                    temp = replacePlaceholders(temp, constraint[key], prefix + key + '.');
                } else {
                    const placeholder = `{{${prefix}${key}}}`;
                    const value = Array.isArray(constraint[key]) ? constraint[key].join(', ') : constraint[key];
                    let previousTemp;
                    do {
                        previousTemp = temp;
                        temp = temp.replace(placeholder, value);
                    } while (temp !== previousTemp);
                }
            }
            return temp;
        }
        return replacePlaceholders(template, constraints);
    }

    /**
     * Compiles a template with enhanced logic.
     * @param template The code template.
     * @param typeConstraints Constraints for the code.
     * @returns Compiled code as a string.
     */
    public static compileComplexTemplate(template: string, typeConstraints: TypeConstraint): string {
        // Use a regular expression to match loop templates.
        const loopTemplate = /@for\(([^)]+)\) (.+?)@endfor/g;

        // Replace loop templates with generated code.
        template = template.replace(loopTemplate, (_, loopVar, loopContent) => {
            const loopItems = typeConstraints[loopVar];
            if (Array.isArray(loopItems)) {
                // Safely replace items in the content.
                return loopItems.map(item => {
                    const safeItem = item.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
                    return loopContent.replace(new RegExp(`{{item}}`, 'g'), safeItem);
                }).join('');
            }
            return '';
        });

        // Remove trailing commas and extra whitespace.
        template = template.replace(/,(\s*[@}])/g, '$1');
        template = template.replace(/\s{2,}/g, ' ');
        template = template.replace(/,\s*$/g, '');

        // Populate the template with the type constraints.
        return this.populateTemplate(template, typeConstraints);
    }
}