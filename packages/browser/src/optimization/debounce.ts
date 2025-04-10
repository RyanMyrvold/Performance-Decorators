export function Debounce(): MethodDecorator {
  return (_target, _propertyKey, descriptor) => descriptor;
}
