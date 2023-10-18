/**
 * @file TypeObserver.ts
 * Observes and reports changes to types.
 */
import { EventEmitter } from "events";
import { TypeLogger } from "./TypeLogger";

/**
 * Class representing a type observer that observes registered types and notifies subscribers about changes.
 */
export class TypeObserver extends EventEmitter {
  /**
   * Initializes a new instance of the TypeObserver class.
   */
  constructor() {
    super();
  }

  /**
   * Adds a type, triggering any subscribed "typeAdded" event listeners.
   * @param typeName - The name of the type being added.
   */
  addType(typeName: string): void {
    TypeLogger.log(`Type added: ${typeName}`);
    this.emit("typeAdded", typeName);
  }

  /**
   * Removes a type, triggering any subscribed "typeRemoved" event listeners.
   * @param typeName - The name of the type being removed.
   */
  removeType(typeName: string): void {
    TypeLogger.log(`Type removed: ${typeName}`);
    this.emit("typeRemoved", typeName);
  }
}

