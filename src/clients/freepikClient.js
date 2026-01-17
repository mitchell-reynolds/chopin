const axios = require('axios');
const fs = require('fs');
const path = require('path');

/**
 * Freepik Image Generation API Client
 * Generate hero images for account briefs
 * Documentation: https://docs.freepik.com/api-reference/text-to-image/get-image-from-text
 */

const FREEPIK_API_BASE = 'https://api.freepik.com/v1';
const FREEPIK_API_KEY = process.env.FREEPIK_API_KEY;
const TIMEOUT = 60000; // 60 seconds for image generation
const OUTPUT_DIR = path.join(process.cwd(), 'output', 'images');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Generate a hero image for the account brief
 * Returns object with base64 data URI and saved file path
 */
async function generateHeroImage(companyName, industry) {
  if (!FREEPIK_API_KEY) {
    throw new Error('FREEPIK_API_KEY not configured');
  }

  try {
    console.log('[Freepik] Generating hero image...');
    console.log(`[Freepik] Company: ${companyName}, Industry: ${industry}`);

    // Build a prompt that creates professional B2B cover images
    const prompt = `Professional B2B account brief cover image for ${companyName}, ${industry} industry. 
Clean modern design, abstract tech shapes, minimal aesthetic, plenty of whitespace, corporate colors, 
widescreen format, high quality, professional, business presentation style`;

    const response = await axios.post(
      `${FREEPIK_API_BASE}/ai/text-to-image`,
      {
        prompt: prompt,
        negative_prompt: 'busy, cluttered, text, words, letters, logos, faces, people, chaotic, messy',
        num_images: 1,
        image: {
          size: 'landscape_16_9'
        },
        styling: {
          style: 'photo',
          effects: {
            color: 'cool',
            lightning: 'natural'
          }
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

    console.log('[Freepik] ✓ Response received');
    console.log('[Freepik] Response keys:', Object.keys(response.data));

    // API returns base64 image data, not a URL
    if (response.data && response.data.data && response.data.data[0]) {
      const imageData = response.data.data[0];
      
      if (imageData.base64) {
        console.log('[Freepik] ✓ Base64 image data received');
        
        // Save to file
        const filename = `${companyName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}.png`;
        const filepath = path.join(OUTPUT_DIR, filename);
        
        // Write base64 to PNG file
        const buffer = Buffer.from(imageData.base64, 'base64');
        fs.writeFileSync(filepath, buffer);
        console.log(`[Freepik] ✓ Image saved to: ${filepath}`);
        
        // Return both data URI (for immediate use) and file path
        return {
          dataUri: `data:image/png;base64,${imageData.base64}`,
          filePath: filepath,
          filename: filename
        };
      }
    }

    console.log('[Freepik] Response structure:', JSON.stringify(response.data, null, 2).substring(0, 500));
    throw new Error('No base64 image data in Freepik response');

  } catch (error) {
    console.error('[Freepik] Image generation error:', error.response?.data || error.message);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Freepik API timeout - image generation took too long');
    }
    
    if (error.response) {
      console.error('[Freepik] Status:', error.response.status);
      console.error('[Freepik] Response:', JSON.stringify(error.response.data, null, 2));
      throw new Error(`Freepik API error (${error.response.status}): ${error.response.data?.message || error.response.data?.error || error.message}`);
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
