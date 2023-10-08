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
    public static populateTemplate(template: string, typeConstraints: TypeConstraint): string {
        let code = template;
        for (let key in typeConstraints) {
            const value = typeConstraints[key];
            const placeholder = `{{${key}}}`;

            if (Array.isArray(value)) {
                code = code.replace(new RegExp(placeholder, 'g'), value.join(','));
            } else {
                code = code.replace(new RegExp(placeholder, 'g'), String(value));
            }
        }

        code = code.replace(/,([^ ])/g, ', $1');
        return code;
    }

    /**
     * Compiles a template with enhanced logic.
     * @param template The code template.
     * @param typeConstraints Constraints for the code.
     * @returns Compiled code as a string.
     */
    public static compileComplexTemplate(template: string, typeConstraints: TypeConstraint): string {
        let loopTemplate = /@for\(([^)]+)\) (.+?)@endfor/g;  
        template = template.replace(loopTemplate, (_, loopVar, loopContent) => {
            const loopItems = typeConstraints[loopVar];
            if (Array.isArray(loopItems)) {
                return loopItems.map(item => loopContent.replace(/{{item}}/g, item)).join('');
            }
            return '';
        });

        template = template.replace(/,(\s*[@}])/g, '$1');
        template = template.replace(/\s{2,}/g, ' ');
        template = template.replace(/,\s*$/g, '');

        return this.populateTemplate(template, typeConstraints);
    }
}
