const axios = require('axios');

/**
 * Freepik Image Generation API Client
 * Generate hero images for account briefs
 * Documentation: https://www.freepik.com/api/image-generation
 */

const FREEPIK_API_BASE = 'https://api.freepik.com/v1';
const FREEPIK_API_KEY = process.env.FREEPIK_API_KEY;
const TIMEOUT = 45000; // 45 seconds for image generation

/**
 * Generate a hero image for the account brief
 */
async function generateHeroImage(companyName, industry) {
  if (!FREEPIK_API_KEY) {
    throw new Error('FREEPIK_API_KEY not configured');
  }

  try {
    console.log('[Freepik] Generating hero image...');

    // Build a prompt that creates professional B2B cover images
    const prompt = `Professional B2B account brief cover image for ${companyName}, ${industry} industry. 
Clean modern design, abstract tech shapes, minimal aesthetic, plenty of whitespace, corporate colors, 
widescreen 16:9 format, high quality, professional, business presentation style`;

    const response = await axios.post(
      `${FREEPIK_API_BASE}/ai/text-to-image`,
      {
        prompt: prompt,
        negative_prompt: 'busy, cluttered, text, words, letters, logos, faces, people, chaotic, messy',
        num_images: 1,
        image: {
          size: 'landscape_16_9' // or use specific dimensions
        },
        styling: {
          style: 'photo',
          color: 'cool',
          lighting: 'natural'
        }
      },
      {
        headers: {
          'x-freepik-api-key': FREEPIK_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: TIMEOUT
      }
    );

    console.log('[Freepik] ✓ Hero image generated');

    // Extract image URL from response
    if (response.data && response.data.data && response.data.data[0]) {
      const imageUrl = response.data.data[0].url || response.data.data[0].image?.url;
      return imageUrl;
    }

    // Handle different response structures
    if (response.data.url) {
      return response.data.url;
    }

    if (response.data.image_url) {
      return response.data.image_url;
    }

    throw new Error('No image URL in Freepik response');

  } catch (error) {
    console.error('[Freepik] Image generation error:', error.response?.data || error.message);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Freepik API timeout - image generation took too long');
    }
    
    if (error.response) {
      throw new Error(`Freepik API error (${error.response.status}): ${error.response.data?.message || error.message}`);
    }
    
    throw new Error(`Freepik client error: ${error.message}`);
  }
}

/**
 * Generate image with graceful fallback
 * Returns null instead of throwing on error
 */
async function generateHeroImageSafe(companyName, industry) {
  try {
    return await generateHeroImage(companyName, industry);
  } catch (error) {
    console.warn('[Freepik] Failed to generate image (non-fatal):', error.message);
    return null;
  }
}

module.exports = { 
  generateHeroImage,
  generateHeroImageSafe
};
