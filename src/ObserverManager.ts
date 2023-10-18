/**
 * @file ObserverManager.ts
 * Manages multiple type observers.
 */

import { TypeObserver } from './TypeObserver';
import { TypeLogger } from './TypeLogger';

/**
 * Manages multiple observers.
 */
export class ObserverManager {
  private static observerMap: Map<string, TypeObserver> = new Map();

  /**
   * Adds a new observer.
   * @param name - The name of the observer.
   * @param observer - The observer instance.
   */
  public static addObserver(name: string, observer: TypeObserver): void {
    this.observerMap.set(name, observer);
    TypeLogger.log(`Added new observer: ${name}`);
  }

  /**
   * Removes an existing observer.
   * @param name - The name of the observer to remove.
   */
  public static removeObserver(name: string): void {
    this.observerMap.delete(name);
    TypeLogger.log(`Removed observer: ${name}`);
  }
}
