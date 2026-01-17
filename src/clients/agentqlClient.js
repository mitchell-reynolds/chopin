const axios = require('axios');

/**
 * AgentQL REST API Client (TinyFish)
 * Fast structured extraction from specific URLs
 * Documentation: https://docs.agentql.com/rest-api/api-reference
 */

const AGENTQL_API_BASE = 'https://api.agentql.com/v1';
const AGENTQL_API_KEY = process.env.MINO_API_KEY; // Using MINO_API_KEY as confirmed by user
const TIMEOUT = 30000; // 30 seconds per extraction

/**
 * Extract navigation links from homepage to find pricing, careers, blog pages
 */
async function extractNavLinks(url) {
  if (!AGENTQL_API_KEY) {
    throw new Error('MINO_API_KEY (AgentQL) not configured');
  }

  try {
    console.log(`[AgentQL] Extracting nav links from ${url}...`);

    const response = await axios.post(
      `${AGENTQL_API_BASE}/extract`,
      {
        url: url,
        query: `
        {
          navigation_links[] {
            text
            href
          }
        }
        `,
        wait_for: 'networkidle'
      },
      {
        headers: {
          'Authorization': `Bearer ${AGENTQL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: TIMEOUT
      }
    );

    console.log('[AgentQL] ✓ Nav links extracted');

    const links = response.data.data?.navigation_links || [];
    
    // Find relevant pages
    const pricingUrl = links.find(l => 
      l.text?.toLowerCase().includes('pricing') || 
      l.href?.toLowerCase().includes('pricing')
    )?.href;
    
    const careersUrl = links.find(l => 
      l.text?.toLowerCase().includes('career') || 
      l.text?.toLowerCase().includes('jobs') ||
      l.href?.toLowerCase().includes('career')
    )?.href;
    
    const blogUrl = links.find(l => 
      l.text?.toLowerCase().includes('blog') || 
      l.text?.toLowerCase().includes('news') ||
      l.text?.toLowerCase().includes('changelog') ||
      l.href?.toLowerCase().includes('blog')
    )?.href;

    return {
      pricing: pricingUrl ? normalizeUrl(url, pricingUrl) : null,
      careers: careersUrl ? normalizeUrl(url, careersUrl) : null,
      blog: blogUrl ? normalizeUrl(url, blogUrl) : null
    };

  } catch (error) {
    console.error('[AgentQL] Nav extraction error:', error.response?.data || error.message);
    // Non-fatal - return empty if nav extraction fails
    return { pricing: null, careers: null, blog: null };
  }
}

/**
 * Extract structured data from a specific URL
 */
async function extractPageData(url, pageType = 'homepage') {
  if (!AGENTQL_API_KEY) {
    throw new Error('MINO_API_KEY (AgentQL) not configured');
  }

  try {
    console.log(`[AgentQL] Extracting ${pageType} data from ${url}...`);

    // Different queries for different page types
    let query;
    switch (pageType) {
      case 'homepage':
        query = `
        {
          headline
          tagline
          product_description
          target_audience
          key_features[]
          customer_logos[]
        }
        `;
        break;
      case 'pricing':
        query = `
        {
          pricing_model
          plans[] {
            name
            price
            features[]
          }
          free_trial_available
        }
        `;
        break;
      case 'careers':
        query = `
        {
          company_culture
          open_positions_count
          locations[]
          perks[]
        }
        `;
        break;
      case 'blog':
        query = `
        {
          recent_posts[] {
            title
            date
            summary
          }
        }
        `;
        break;
      default:
        query = `{ headline content }`;
    }

    const response = await axios.post(
      `${AGENTQL_API_BASE}/extract`,
      {
        url: url,
        query: query,
        wait_for: 'domcontentloaded'
      },
      {
        headers: {
          'Authorization': `Bearer ${AGENTQL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: TIMEOUT
      }
    );

    console.log(`[AgentQL] ✓ ${pageType} data extracted`);
    return response.data.data || {};

  } catch (error) {
    console.error(`[AgentQL] ${pageType} extraction error:`, error.response?.data || error.message);
    // Non-fatal - return empty object if extraction fails
    return {};
  }
}

/**
 * Main function to extract evidence from company website
 */
async function extractCompanyEvidence(companyDomain) {
  const baseUrl = companyDomain.startsWith('http') 
    ? companyDomain 
    : `https://${companyDomain}`;

  const evidence = {
    homepage_insights: {},
    pricing_insights: null,
    careers_insights: null,
    blog_insights: null
  };

  try {
    // Step 1: Extract homepage data
    evidence.homepage_insights = await extractPageData(baseUrl, 'homepage');

    // Step 2: Find other relevant pages
    const navLinks = await extractNavLinks(baseUrl);

    // Step 3: Extract data from found pages (in parallel for speed)
    const extractions = [];
    
    if (navLinks.pricing) {
      extractions.push(
        extractPageData(navLinks.pricing, 'pricing')
          .then(data => { evidence.pricing_insights = data; })
      );
    }
    
    if (navLinks.careers) {
      extractions.push(
        extractPageData(navLinks.careers, 'careers')
          .then(data => { evidence.careers_insights = data; })
      );
    }
    
    if (navLinks.blog) {
      extractions.push(
        extractPageData(navLinks.blog, 'blog')
          .then(data => { evidence.blog_insights = data; })
      );
    }

    // Wait for all extractions with timeout
    if (extractions.length > 0) {
      await Promise.race([
        Promise.allSettled(extractions),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Extraction timeout')), 45000))
      ]).catch(() => {
        console.log('[AgentQL] Some extractions timed out - continuing with available data');
      });
    }

    console.log('[AgentQL] ✓ Evidence extraction complete');
    return evidence;

  } catch (error) {
    console.error('[AgentQL] Evidence extraction failed:', error.message);
    // Return partial evidence even on failure
    return evidence;
  }
}

/**
 * Normalize relative URLs to absolute
 */
function normalizeUrl(baseUrl, url) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  
  const base = new URL(baseUrl);
  if (url.startsWith('/')) {
    return `${base.protocol}//${base.host}${url}`;
  }
  return `${base.protocol}//${base.host}/${url}`;
}

module.exports = { 
  extractCompanyEvidence,
  extractNavLinks,
  extractPageData
};
