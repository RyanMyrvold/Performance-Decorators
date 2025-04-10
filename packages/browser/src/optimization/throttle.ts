export function Throttle(): MethodDecorator {
  return (_target, _propertyKey, descriptor) => descriptor;
}
