# Specification

## Summary
**Goal:** Build a single-page product image upload tool that estimates an “accurate price” from market price samples and transparently shows the supporting data.

**Planned changes:**
- Frontend single-page flow to upload a product image (PNG/JPG), preview it, replace/remove it, and submit an “Estimate price” request.
- Frontend states for loading, errors, and results; results show product label (if available), computed price, currency, timestamp, sample count, and sampled prices (when available), including low-confidence messaging when sample count is very small.
- Backend single Motoko actor endpoint to accept an image payload, validate size/type, and return a structured estimate response (productName/confidence optional, samples, computedPrice, currency, generatedAt).
- Backend configurable integration point for an external HTTP product-recognition/pricing API (base URL + API key placeholders) that extracts numeric price samples; graceful failure when not configured or when the call fails.
- Backend deterministic “accurate price” calculation over samples (e.g., median/trimmed mean) with inline code comments documenting the method.
- Apply a coherent, distinct visual theme (not blue/purple as primary), with responsive layout for mobile and desktop.

**User-visible outcome:** Users can upload a product image, preview it, request a price estimate, and see the computed price with timestamp plus transparent sample data (count and values) and clear loading/error/low-confidence states.
