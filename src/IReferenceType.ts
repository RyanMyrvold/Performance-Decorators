import { InferenceResult } from "./InferenceResult";
import { InferableType } from "./InferableType";


export interface IReferenceType<T = unknown> {
    type: InferableType;
    properties?: Record<string, InferenceResult>;
    items?: InferenceResult[];
}