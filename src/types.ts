/**
 * Core helper types for TypeScript 5+ decorators.
 *
 * These helpers cover:
 * - Class decorators
 * - Method decorators
 * - Field decorators
 * - Accessor decorators (getter/setter/accessor)
 * - Auto-accessor decorators
 *
 * Static block decorators DO NOT exist in TS and are intentionally omitted.
 */

/**
 * Shared method signature type.
 */
export type Method<This, Args extends unknown[], Return> = (
  this: This,
  ...args: Args
) => Return;

/**
 * Method decorator context.
 */
export type MethodContext<This, Args extends unknown[], Return> =
  ClassMethodDecoratorContext<This, Method<This, Args, Return>>;

/**
 * Generic class constructor type.
 */
export type ClassType<Instance, Args extends unknown[] = any[]> =
  abstract new (...args: Args) => Instance;

/**
 * Class decorator type.
 */
export type ClassDecoratorFn<C extends ClassType<any>> = (
  value: C,
  context: ClassDecoratorContext<C>
) => C | void;

/**
 * Field decorator context.
 *
 * Applies to:
 * - public/private instance fields
 * - public/private static fields
 */
export type FieldContext<This, Value> =
  ClassFieldDecoratorContext<This, Value>;

/**
 * Getter decorator context.
 */
export type GetterContext<This, Value> =
  ClassGetterDecoratorContext<This, Value>;

/**
 * Setter decorator context.
 */
export type SetterContext<This, Value> =
  ClassSetterDecoratorContext<This, Value>;

/**
 * Accessor decorator context.
 *
 * Applies to:
 * - accessor foo = …
 * - accessor #privateFoo = …
 */
export type AccessorContext<This, Value> =
  ClassAccessorDecoratorContext<This, Value>;

/**
 * Generic decorator pattern:
 * value + context → newValue | void
 */
export type GenericDecorator<Value, Context> = (
  value: Value,
  context: Context
) => Value | void;
