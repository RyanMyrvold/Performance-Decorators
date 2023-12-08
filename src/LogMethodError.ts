/**
 * Decorator to log any errors that occur during the method execution. Optionally re-throws the error based on a parameter.
 * @param rethrow - A boolean to determine whether to rethrow the error after logging. Defaults to true.
 * @param errorHandler - An optional custom error handler function that takes the error and method name as parameters.
 * @returns MethodDecorator
 */
function LogMethodError(rethrow: boolean = true, errorHandler?: (error: Error, methodName: string) => void): MethodDecorator {
    return function(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
        if (typeof descriptor.value !== 'function') {
            throw new Error('🐞 [Log Method Error] Can only be applied to methods.');
        }

        const originalMethod = descriptor.value;
        descriptor.value = function(...args: any[]) {
            try {
                return originalMethod.apply(this, args);
            } catch (error) {
                if (error instanceof Error) {
                    console.error(`🚨 [Error] ${target.constructor.name}.${String(propertyKey)} encountered an error: ${error.message}`, error.stack);
                    errorHandler?.(error, `${target.constructor.name}.${String(propertyKey)}`);
                } else {
                    console.error(`🚨 [Error] ${target.constructor.name}.${String(propertyKey)} encountered a non-Error exception: `, error);
                    errorHandler?.(new Error(`Non-Error exception: ${error}`), `${target.constructor.name}.${String(propertyKey)}`);
                }
                if (rethrow) throw error;
            }
        };
        return descriptor;
    };
}

export default LogMethodError;