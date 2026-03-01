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
 * Getter decorator context.
 */
export type GetterContext<This, Value> =
  ClassGetterDecoratorContext<This, Value>;
