// ./src/index.ts

/**
 * Barrel file for type-related modules.
 */

// Export classes and types from TypeObserver
export type { TypeObserver } from './TypeObserver';

// Export classes and types from TypeValidator
export { TypeValidator } from './TypeValidator';

// Export classes and types from TypeInspector
export { TypeInspector } from './TypeInspector';

// Export classes and types from TypeConstraint
export type { TypeConstraint } from './TypeConstraint';

// Export classes and types from TypeRegistry
export { TypeRegistry } from './TypeRegistry';

// Export classes and types from ObserverManager
export { ObserverManager } from './ObserverManager';

// Export classes and types from ErrorManager
export { ErrorManager, ErrorType } from './ErrorManager';

// Export classes and types from TypeLogger
export { TypeLogger } from './TypeLogger';