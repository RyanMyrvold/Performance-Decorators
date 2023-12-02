/**
 * Decorator to log any errors that occur during the method execution.
 * @returns MethodDecorator
 */
function LogMethodError(): MethodDecorator {
    return function(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
        if (typeof descriptor.value !== 'function') {
            throw new Error('🐞 [Log Method Error] Can only be applied to methods.');
        }

        const originalMethod = descriptor.value;
        descriptor.value = function(...args: any[]) {
            try {
                return originalMethod.apply(this, args);
            } catch (error) {
                console.error(`🚨 [Error] ${target.constructor.name}.${String(propertyKey)} encountered an error: ${error}`);
                throw error;
            }
        };
        return descriptor;
    };
}

export default LogMethodError;