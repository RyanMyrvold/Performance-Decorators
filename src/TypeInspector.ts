/**
 * @file TypeInspector.ts
 * 
 * Provides utilities for inspecting types of variables and objects.
 * Includes methods for fetching enumerable properties, checking for properties, and more.
 * 
 * Dependencies:
 * - TypeLogger.ts for logging activities.
 * 
 */

import { TypeLogger } from './TypeLogger';

/**
 * Class for inspecting types and providing type information.
 */
export class TypeInspector {
  /**
   * Inspects if an object has a certain property.
   * @param obj - The object to inspect.
   * @param property - The property to check for.
   * @returns true if the property exists, otherwise false.
   */
  public static hasProperty(obj: object | null | undefined, property: string): boolean {
    if (obj === null || obj === undefined) {
      return false;
    }

    // Include inherited properties
    return property in obj;
  }

/**
 * Retrieves properties from an object.
 * 
 * @param obj - The object to inspect.
 * @returns An array of property names.
 *
 * @example
 * Here is how you can use `getProperties` method to retrieve enumerable property names from an object.
 * @code
 * const myObject = { prop1: 'value1', prop2: 42 };
 * Object.defineProperty(myObject, 'prop3', { value: 'non-enumerable', enumerable: false });
 *
 * const properties = TypeInspector.getProperties(myObject);
 * console.log(properties);  // Output will be ['prop1', 'prop2']
 * @endcode
 */
public static getProperties(obj: object | null | undefined): string[] {
  if (obj === null || obj === undefined) {
    TypeLogger.log('Received null or undefined object.'); // Using custom logging
    return [];
  }

  TypeLogger.log(`Inspecting object: ${JSON.stringify(obj)}`); // Using custom logging

  // Getting all properties regardless of their enumerability
  const allProperties = Object.getOwnPropertyNames(obj);
  
  // Filtering only enumerable properties
  const enumerableProperties = allProperties.filter(prop => {
    const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
    return descriptor ? descriptor.enumerable : false;
  });

  TypeLogger.log(`Found properties: ${JSON.stringify(enumerableProperties)}`); // Using custom logging

  return enumerableProperties;
}
}
