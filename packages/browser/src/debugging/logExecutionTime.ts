export function LogExecutionTime(): MethodDecorator {
  return (_target, _propertyKey, descriptor) => descriptor;
}
