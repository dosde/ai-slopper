import { fal } from '@fal-ai/client';

// Configure fal client
// API key should be set via VITE_FAL_KEY environment variable
const FAL_KEY = import.meta.env.VITE_FAL_KEY;

if (FAL_KEY) {
  fal.config({ credentials: FAL_KEY });
}

// Cache generated images to avoid re-generating
const imageCache = new Map();

export const generateSlopImage = async (prompt) => {
  if (!FAL_KEY) {
    // Return placeholder when no API key
    return null;
  }

  const cacheKey = prompt;
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey);
  }

  try {
    const result = await fal.run('fal-ai/flux/schnell', {
      input: {
        prompt: `${prompt}, high quality, detailed, funny cartoon illustration`,
        image_size: 'square_hd',
        num_inference_steps: 4,
        num_images: 1,
        enable_safety_checker: true,
      },
    });

    const imageUrl = result?.images?.[0]?.url;
    if (imageUrl) {
      imageCache.set(cacheKey, imageUrl);
      return imageUrl;
    }
    return null;
  } catch (err) {
    console.warn('Fal.ai image generation failed:', err.message);
    return null;
  }
};

export const isFalConfigured = () => Boolean(FAL_KEY);
