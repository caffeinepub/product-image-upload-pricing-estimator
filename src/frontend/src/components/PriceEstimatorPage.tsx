import { useState } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { EstimateResultCard } from './EstimateResultCard';
import { usePriceEstimate } from '../hooks/usePriceEstimate';
import { validateImageFile, createImagePreviewUrl } from '../utils/imageFile';
import { toast } from 'sonner';

export function PriceEstimatorPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { estimate, isLoading, error, submitEstimate, reset } = usePriceEstimate();

  const handleFileSelect = (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid file');
      return;
    }

    // Clean up previous preview
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    const url = createImagePreviewUrl(file);
    setPreviewUrl(url);
    reset(); // Clear previous results
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    reset();
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    await submitEstimate(selectedFile);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Upload Product Image</h2>
        <p className="text-muted-foreground">
          Get instant pricing estimates by uploading a photo of your product
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Image</CardTitle>
          <CardDescription>
            Upload a clear photo of the product (PNG or JPG, max 5MB)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!previewUrl ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/20"
            >
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PNG or JPG (max 5MB)</p>
                  </div>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden border border-border bg-muted/20">
                <img
                  src={previewUrl}
                  alt="Product preview"
                  className="w-full h-auto max-h-96 object-contain"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleRemove}
                  disabled={isLoading}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ImageIcon className="w-4 h-4" />
                <span className="truncate">{selectedFile?.name}</span>
                <span className="text-xs">
                  ({((selectedFile?.size || 0) / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Estimate Price'
                )}
              </Button>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {estimate && <EstimateResultCard estimate={estimate} />}
    </div>
  );
}
