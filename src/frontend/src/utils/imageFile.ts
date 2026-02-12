const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageFile(file: File): ValidationResult {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a PNG or JPG image.',
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit.`,
    };
  }

  return { valid: true };
}

export function createImagePreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

export function revokeImagePreviewUrl(url: string): void {
  URL.revokeObjectURL(url);
}
