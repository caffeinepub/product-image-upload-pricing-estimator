import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PriceEstimate {
    estimatedPrice: bigint;
    sampleCount: bigint;
    priceSamples: Array<bigint>;
}
export interface ProductRecognitionResponse {
    probableProducts: Array<[string, bigint]>;
}
export interface backendInterface {
    getPriceEstimate(productValue: bigint): Promise<PriceEstimate>;
    recognizeProducts(): Promise<ProductRecognitionResponse>;
}
