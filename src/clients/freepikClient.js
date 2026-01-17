const axios = require('axios');
const fs = require('fs');
const path = require('path');

/**
 * Freepik Image Generation API Client
 * Generate hero images for account briefs
 * Documentation: https://docs.freepik.com/api-reference/text-to-image/get-image-from-text
 */

const FREEPIK_API_BASE = process.env.FREEPIK_API_BASE || 'https://api.freepik.com/v1';
const FREEPIK_API_KEY = process.env.FREEPIK_API_KEY;
const TIMEOUT = 60000; // 60 seconds for image generation
const POLL_INTERVAL = 3000; // 3 seconds between status checks
const MAX_POLL_ATTEMPTS = 20; // Max 60 seconds of polling (20 × 3s)
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

    const safeCompanyName = String(companyName || 'company');
    const safeIndustry = String(industry || 'Technology');

    // Build a prompt that creates professional B2B cover images
    const prompt = `Professional B2B account brief cover image for ${safeCompanyName}, ${safeIndustry} industry. 
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
          style: 'photo'
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
    console.log('[Freepik] Response keys:', Object.keys(response.data || {}));

    const initialImage = await resolveImageData(response.data);
    if (initialImage) {
      return saveImageResult(initialImage, safeCompanyName);
    }

    const taskId = extractTaskId(response.data);
    if (!taskId) {
      console.log('[Freepik] Response structure:', JSON.stringify(response.data, null, 2).substring(0, 500));
      throw new Error('No image data or task_id in Freepik response');
    }

    console.log(`[Freepik] Task created: ${taskId}. Polling for results...`);
    const polledImage = await pollForImage(taskId);
    if (!polledImage) {
      throw new Error('Freepik image generation returned no image data after polling');
    }

    return saveImageResult(polledImage, safeCompanyName);

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

function extractTaskId(payload) {
  return (
    payload?.task_id ||
    payload?.id ||
    payload?.data?.task_id ||
    payload?.data?.id ||
    payload?.data?.[0]?.task_id ||
    payload?.data?.[0]?.id ||
    payload?.result?.task_id ||
    payload?.result?.id
  );
}

function extractStatus(payload) {
  return (
    payload?.status ||
    payload?.state ||
    payload?.data?.status ||
    payload?.data?.state ||
    payload?.data?.[0]?.status ||
    payload?.data?.[0]?.state ||
    payload?.result?.status ||
    payload?.result?.state
  );
}

function extractImageInfo(payload) {
  const base64 =
    payload?.base64 ||
    payload?.image_base64 ||
    payload?.data?.[0]?.base64 ||
    payload?.data?.[0]?.image?.base64 ||
    payload?.data?.[0]?.image_base64 ||
    payload?.data?.base64 ||
    payload?.data?.image?.base64 ||
    payload?.data?.image_base64 ||
    payload?.data?.images?.[0]?.base64 ||
    payload?.data?.images?.[0]?.image?.base64 ||
    payload?.result?.data?.[0]?.base64 ||
    payload?.result?.[0]?.base64 ||
    payload?.result?.base64 ||
    payload?.result?.image?.base64 ||
    payload?.images?.[0]?.base64 ||
    payload?.image?.base64;

  const url =
    payload?.url ||
    payload?.data?.[0]?.url ||
    payload?.data?.[0]?.image?.url ||
    payload?.data?.url ||
    payload?.data?.image?.url ||
    payload?.result?.data?.[0]?.url ||
    payload?.result?.url ||
    payload?.images?.[0]?.url ||
    payload?.image?.url;

  const mime =
    payload?.mime_type ||
    payload?.mime ||
    payload?.data?.[0]?.mime_type ||
    payload?.data?.[0]?.mime ||
    payload?.data?.mime_type ||
    payload?.data?.mime ||
    payload?.result?.data?.[0]?.mime_type ||
    payload?.result?.mime_type ||
    payload?.image?.mime_type ||
    payload?.image?.mime;

  return { base64, url, mime };
}

function normalizeBase64Payload(base64Value) {
  if (!base64Value || typeof base64Value !== 'string') {
    return { base64: null, mime: null };
  }

  const trimmed = base64Value.trim();
  if (trimmed.startsWith('data:')) {
    const match = trimmed.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      return { base64: match[2], mime: match[1] };
    }
  }

  return { base64: trimmed, mime: null };
}

function extensionForMime(mimeType) {
  if (!mimeType) {
    return 'png';
  }

  const lower = mimeType.toLowerCase();
  if (lower.includes('jpeg') || lower.includes('jpg')) {
    return 'jpg';
  }
  if (lower.includes('webp')) {
    return 'webp';
  }
  if (lower.includes('png')) {
    return 'png';
  }
  return 'png';
}

async function resolveImageData(payload) {
  const { base64, url, mime } = extractImageInfo(payload);
  const normalized = normalizeBase64Payload(base64);
  if (normalized.base64) {
    return { base64: normalized.base64, mime: normalized.mime || mime || 'image/png' };
  }

  if (url) {
    const download = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: TIMEOUT
    });
    const contentType = download.headers?.['content-type'];
    const buffer = Buffer.from(download.data);
    return { base64: buffer.toString('base64'), mime: contentType || mime || 'image/png' };
  }

  return null;
}

async function pollForImage(taskId) {
  for (let attempt = 1; attempt <= MAX_POLL_ATTEMPTS; attempt += 1) {
    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));

    const statusResponse = await axios.get(
      `${FREEPIK_API_BASE}/ai/text-to-image/${taskId}`,
      {
        headers: {
          'x-freepik-api-key': FREEPIK_API_KEY,
          'Accept': 'application/json'
        },
        timeout: 10000
      }
    );

    const status = extractStatus(statusResponse.data);
    const normalizedStatus = typeof status === 'string' ? status.toLowerCase() : status;
    console.log(`[Freepik] Poll ${attempt}/${MAX_POLL_ATTEMPTS}: ${normalizedStatus || 'pending'}`);

    const imageData = await resolveImageData(statusResponse.data);
    if (imageData) {
      return imageData;
    }

    if (normalizedStatus === 'failed' || normalizedStatus === 'error') {
      throw new Error('Freepik image generation failed');
    }
  }

  throw new Error('Freepik image generation timed out while polling');
}

function saveImageResult(imageData, companyName) {
  const extension = extensionForMime(imageData.mime);
  const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'image';
  const filename = `${slug}-${Date.now()}.${extension}`;
  const filepath = path.join(OUTPUT_DIR, filename);

  const buffer = Buffer.from(imageData.base64, 'base64');
  fs.writeFileSync(filepath, buffer);
  console.log(`[Freepik] ✓ Image saved to: ${filepath}`);

  return {
    dataUri: `data:${imageData.mime || 'image/png'};base64,${imageData.base64}`,
    filePath: filepath,
    filename: filename
  };
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
