import { IReferenceType } from "./IReferenceType";
import { InferableType } from "./InferableType";

export interface InferenceResult {
    type: InferableType;
    properties?: Record<string, InferenceResult>;
    items?: InferenceResult[];
  }