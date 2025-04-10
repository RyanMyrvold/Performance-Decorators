export function LogStackTrace(): MethodDecorator {
  return (_target, _propertyKey, descriptor) => descriptor;
}
