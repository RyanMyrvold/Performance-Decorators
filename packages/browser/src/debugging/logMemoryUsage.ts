export function LogMemoryUsage(): MethodDecorator {
  return (_target, _propertyKey, descriptor) => descriptor;
}
