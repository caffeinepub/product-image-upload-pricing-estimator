import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import type { PriceEstimateResult } from '../hooks/usePriceEstimate';

interface EstimateResultCardProps {
  estimate: PriceEstimateResult;
}

export function EstimateResultCard({ estimate }: EstimateResultCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: estimate.currency,
    }).format(price);
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(timestamp);
  };

  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Price Estimate
            </CardTitle>
            <CardDescription>Generated {formatTimestamp(estimate.timestamp)}</CardDescription>
          </div>
          {estimate.productLabel && (
            <Badge variant="secondary" className="text-sm">
              {estimate.productLabel}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Price Display */}
        <div className="bg-primary/5 rounded-lg p-6 text-center border border-primary/20">
          <p className="text-sm text-muted-foreground mb-2">Estimated Price</p>
          <p className="text-4xl font-bold text-primary flex items-center justify-center gap-2">
            <DollarSign className="w-8 h-8" />
            {formatPrice(estimate.computedPrice)}
          </p>
        </div>

        {/* Low Confidence Warning */}
        {estimate.lowConfidence && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Low confidence estimate: Only {estimate.sampleCount} price sample
              {estimate.sampleCount !== 1 ? 's' : ''} available. Results may be less accurate.
            </AlertDescription>
          </Alert>
        )}

        {/* Sample Information */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Price Analysis
            </h4>
            <Badge variant="outline">{estimate.sampleCount} samples</Badge>
          </div>

          {estimate.samples.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Market price samples:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {estimate.samples.map((sample, index) => (
                  <div
                    key={index}
                    className="bg-muted/50 rounded px-3 py-2 text-sm font-medium text-center border border-border"
                  >
                    {formatPrice(sample)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {estimate.samples.length === 0 && (
            <p className="text-sm text-muted-foreground italic">
              No market samples available for comparison.
            </p>
          )}
        </div>

        {/* Additional Info */}
        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Currency</p>
              <p className="font-medium text-foreground">{estimate.currency}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Confidence</p>
              <p className="font-medium text-foreground">
                {estimate.lowConfidence ? 'Low' : 'High'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
