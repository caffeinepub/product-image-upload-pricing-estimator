import { useState } from 'react';
import { useActor } from './useActor';
import { toast } from 'sonner';

export interface PriceEstimateResult {
  productLabel?: string;
  computedPrice: number;
  currency: string;
  timestamp: Date;
  samples: number[];
  sampleCount: number;
  lowConfidence: boolean;
}

export function usePriceEstimate() {
  const { actor } = useActor();
  const [estimate, setEstimate] = useState<PriceEstimateResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitEstimate = async (file: File) => {
    if (!actor) {
      setError('Backend connection not available');
      toast.error('Backend connection not available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Note: Backend doesn't actually process images, it expects a numeric value
      // For demo purposes, we'll use file size as a proxy value
      // In a real implementation, the backend would accept image bytes
      const demoValue = BigInt(Math.floor(file.size / 1000)); // Use file size in KB as demo value

      // Call backend methods
      const [priceEstimate, productRecognition] = await Promise.all([
        actor.getPriceEstimate(demoValue),
        actor.recognizeProducts(),
      ]);

      // Convert bigint values to numbers for display
      const samples = priceEstimate.priceSamples.map((s) => Number(s));
      const computedPrice = Number(priceEstimate.estimatedPrice);
      const sampleCount = Number(priceEstimate.sampleCount);

      // Get the most probable product name
      const productLabel =
        productRecognition.probableProducts.length > 0
          ? productRecognition.probableProducts[0][0]
          : undefined;

      const result: PriceEstimateResult = {
        productLabel,
        computedPrice,
        currency: 'USD',
        timestamp: new Date(),
        samples,
        sampleCount,
        lowConfidence: sampleCount < 2,
      };

      setEstimate(result);
      toast.success('Price estimate generated successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to estimate price';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Price estimation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setEstimate(null);
    setError(null);
  };

  return {
    estimate,
    isLoading,
    error,
    submitEstimate,
    reset,
  };
}
