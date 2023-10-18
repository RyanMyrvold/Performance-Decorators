import { InferableType } from './InferableType';
import { InferenceResult } from './InferenceResult';

export class JsonTypeInferencer {
    /**
     * Infer the JSON data type
     * 
     * @param json - The JSON object to infer
     * @returns An object containing the inferred type information
     */
    public static infer(json: any): InferenceResult {
      if (json === null) {
        return { type: InferableType.Null };
      }
      switch (typeof json) {
        case 'boolean':
          return { type: InferableType.Boolean };
        case 'number':
          return { type: InferableType.Number };
        case 'string':
          return { type: InferableType.String };
        case 'object':
          if (Array.isArray(json)) {
            return { type: InferableType.Array };
          }
          const properties: Record<string, InferenceResult> = {};
          for (const key in json) {
            properties[key] = this.infer(json[key]);
          }
          return { type: InferableType.Object, properties };
        default:
          return {
            type: InferableType.Unknown
          };
      }
    }
  
  /**
   * Recursively infers the types of an object, including nested objects and arrays.
   *
   * @param obj The object to infer the schema for.
   * @param parentType The type of the parent object.
   * @returns The inferred type schema.
   */
  public static inferNestedTypes(obj: any, parentType?: InferableType): InferenceResult {
    const schema: { [key: string]: InferenceResult } = {};
    let isNested = false;

    const inferredType = this.infer(obj).type;

    if (inferredType !== InferableType.Object && inferredType !== InferableType.Array) {
      return { type: inferredType };
    }

    if (Array.isArray(obj)) {
      return {
        type: InferableType.NestedArray,
        items: obj.map(item => this.inferNestedTypes(item, InferableType.Array)),
      };
    }

    for (const key in obj) {
      const value = obj[key];
      const itemType = this.infer(value).type;

      if (itemType === InferableType.Object || itemType === InferableType.Array) {
        isNested = true;
        schema[key] = this.inferNestedTypes(value, parentType === InferableType.Array ? InferableType.NestedArray : InferableType.NestedObject);
      } else {
        schema[key] = { type: itemType };
      }
    }

    // Debug
    // console.log('Current schema:', JSON.stringify(schema));

    if (parentType === InferableType.NestedObject) {
      for (const key in schema) {
        if (schema[key].type === InferableType.Object) {
          schema[key].type = InferableType.NestedObject;
        }
      }
    }

    if (isNested) {
      for (const key in schema) {
        const subSchemaType = schema[key].type;
        if (subSchemaType === InferableType.Object || subSchemaType === InferableType.Array) {
          const nestedSchema = this.inferNestedTypes(obj[key]);
          schema[key].type = nestedSchema.type;
          schema[key].properties = nestedSchema.properties;
        }
      }
    }

    return {
      type: isNested ? InferableType.NestedObject : InferableType.Object,
      properties: schema,
    };
  }
}