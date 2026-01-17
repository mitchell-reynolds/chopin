const axios = require('axios');
const { buildYutoriPrompt } = require('../prompts/yutoriPrompt');

/**
 * Yutori Research API Client
 * Handles one-shot web research with structured output
 * Documentation: https://docs.yutori.com/
 */

const YUTORI_API_BASE = 'https://api.yutori.com/v1';
const YUTORI_API_KEY = process.env.YUTORI_API_KEY;
const TIMEOUT = 120000; // 120 seconds for research queries
const POLL_INTERVAL = 5000; // 5 seconds between status checks
const MAX_POLL_ATTEMPTS = 60; // Max 5 minutes of polling (60 × 5s = 300s)

async function generateAccountBrief(companyDomain, companyName, personaTarget, offerType, evidence = null) {
  if (!YUTORI_API_KEY) {
    throw new Error('YUTORI_API_KEY not configured');
  }

  // DEBUG: Log API key info (without exposing full key)
  console.log('[Yutori] API Key check:');
  console.log(`  - Key defined: ${!!YUTORI_API_KEY}`);
  console.log(`  - Key length: ${YUTORI_API_KEY?.length}`);
  console.log(`  - Key starts with: ${YUTORI_API_KEY?.substring(0, 5)}...`);
  console.log(`  - From env var: ${process.env.YUTORI_API_KEY?.substring(0, 5)}...`);

  const prompt = buildYutoriPrompt(companyDomain, companyName, personaTarget, offerType, evidence);

  try {
    console.log('[Yutori] Creating research task...');
    console.log('[Yutori] Endpoint:', `${YUTORI_API_BASE}/research/tasks`);
    console.log('[Yutori] Headers being sent:', {
      'x-api-key': `${YUTORI_API_KEY?.substring(0, 10)}...`,
      'Content-Type': 'application/json'
    });

    
    // Step 1: Create research task
    const createResponse = await axios.post(
      `${YUTORI_API_BASE}/research/tasks`,
      {
        query: prompt,
        instructions: 'Return ONLY valid JSON matching the exact schema provided in the query. No markdown, no explanations.',
        max_results: 10
      },
      {
        headers: {
          'x-api-key': YUTORI_API_KEY,
          'Content-Type': 'application/json'
        },
        timeout: TIMEOUT
      }
    );

    const taskId = createResponse.data.task_id || createResponse.data.id;
    if (!taskId) {
      throw new Error('No task_id returned from Yutori API');
    }

    console.log(`[Yutori] Task created: ${taskId}. Polling for results...`);
    console.log(`[Yutori] This may take 1-3 minutes for research to complete.`);

    // Step 2: Poll for results
    let attempts = 0;
    while (attempts < MAX_POLL_ATTEMPTS) {
      await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
      attempts++;

      const statusResponse = await axios.get(
        `${YUTORI_API_BASE}/research/tasks/${taskId}`,
        {
          headers: {
            'x-api-key': YUTORI_API_KEY
          },
          timeout: 10000
        }
      );

      const status = statusResponse.data.status;
      const elapsed = Math.floor((attempts * POLL_INTERVAL) / 1000);
      console.log(`[Yutori] Poll ${attempts}/${MAX_POLL_ATTEMPTS} (${elapsed}s elapsed): ${status}`);

      if (status === 'completed' || status === 'succeeded') {
        console.log('[Yutori] ✓ Research completed!');
        console.log('[Yutori] Full response keys:', Object.keys(statusResponse.data));
        
        // Parse the result - try multiple possible locations
        let result = statusResponse.data.result || 
                     statusResponse.data.data || 
                     statusResponse.data.output ||
                     statusResponse.data.response ||
                     statusResponse.data;
        
        console.log('[Yutori] Result type:', typeof result);
        console.log('[Yutori] Result preview:', JSON.stringify(result)?.substring(0, 500));
        
        let briefData;
        
        if (typeof result === 'string') {
          // Remove markdown code blocks if present
          const cleaned = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          try {
            briefData = JSON.parse(cleaned);
          } catch (e) {
            console.log('[Yutori] Could not parse as JSON, using raw string');
            briefData = { raw_response: cleaned };
          }
        } else if (result && typeof result === 'object') {
          briefData = result;
        } else {
          console.log('[Yutori] Unknown result format, returning full response');
          briefData = statusResponse.data;
        }
        
        return briefData;
      } else if (status === 'failed' || status === 'error') {
        throw new Error(`Yutori task failed: ${statusResponse.data.error || 'Unknown error'}`);
      }
      
      // Status is still 'pending' or 'processing', continue polling
    }

    const totalTime = Math.floor((MAX_POLL_ATTEMPTS * POLL_INTERVAL) / 1000);
    throw new Error(`Yutori task timeout - research did not complete within ${totalTime} seconds (${MAX_POLL_ATTEMPTS} polling attempts). The task may still be processing on Yutori's end.`);

  } catch (error) {
    console.error('[Yutori] DETAILED ERROR:');
    console.error('  - Error type:', error.constructor.name);
    console.error('  - Error message:', error.message);
    console.error('  - Response status:', error.response?.status);
    console.error('  - Response data:', JSON.stringify(error.response?.data, null, 2));
    console.error('  - Request headers sent:', error.config?.headers);
    console.error('  - Request URL:', error.config?.url);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Yutori Research API timeout - query took too long');
    }
    
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      if (status === 401) {
        throw new Error(`Yutori API 401 Unauthorized - API key may be invalid. Check .env file. Key starts with: ${YUTORI_API_KEY?.substring(0, 5)}`);
      } else if (status === 403) {
        throw new Error(`Yutori API 403 Forbidden - API key "${YUTORI_API_KEY?.substring(0, 10)}..." does not have access to research tasks. Response: ${JSON.stringify(data)}`);
      } else if (status === 429) {
        throw new Error('Yutori API rate limit exceeded');
      }
      
      throw new Error(`Yutori API error (${status}): ${data?.message || data?.error || JSON.stringify(data) || error.message}`);
    }
    
    throw new Error(`Yutori client error: ${error.message}`);
  }
}

module.exports = { generateAccountBrief };
