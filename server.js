require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { TARGET_COMPANIES, mockResponse } = require('./src/schemas/responseSchema');
const { generateAccountBrief } = require('./src/clients/yutoriClient');
const { generateHeroImageSafe } = require('./src/clients/freepikClient');
const { extractCompanyEvidence } = require('./src/clients/agentqlClient');

const app = express();
const PORT = process.env.PORT || 3000;

// Feature flags
const USE_YUTORI = !!process.env.YUTORI_API_KEY;
const USE_FREEPIK = !!process.env.FREEPIK_API_KEY;
const USE_AGENTQL = !!process.env.MINO_API_KEY;

// Output directory for saved results
const OUTPUT_DIR = path.join(process.cwd(), 'output');
const RESULTS_DIR = path.join(OUTPUT_DIR, 'results');

// Ensure output directories exist
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(RESULTS_DIR)) fs.mkdirSync(RESULTS_DIR, { recursive: true });

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from public directory (frontend)
app.use(express.static(path.join(process.cwd(), 'public')));

// Serve static files from output directory (for images and results)
app.use('/output', express.static(OUTPUT_DIR));

// Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    apis: { 
      agentql: USE_AGENTQL,
      yutori: USE_YUTORI, 
      freepik: USE_FREEPIK 
    },
    customer: 'Corgi AI',
    use_case: 'Startup Insurance Research'
  });
});

// Get target companies list
app.get('/targets', (req, res) => {
  res.json({
    customer: 'Corgi AI',
    targets: TARGET_COMPANIES,
    message: 'Pre-built list of startup targets for insurance pitch'
  });
});

// List saved results
app.get('/results', (req, res) => {
  try {
    const files = fs.readdirSync(RESULTS_DIR)
      .filter(f => f.endsWith('.json'))
      .map(f => {
        const filepath = path.join(RESULTS_DIR, f);
        const stats = fs.statSync(filepath);
        return {
          filename: f,
          created: stats.mtime,
          path: `/output/results/${f}`
        };
      })
      .sort((a, b) => b.created - a.created); // newest first
    
    res.json({
      count: files.length,
      results: files
    });
  } catch (error) {
    res.json({ count: 0, results: [] });
  }
});

// Get a specific saved result
app.get('/results/:filename', (req, res) => {
  try {
    const filepath = path.join(RESULTS_DIR, req.params.filename);
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'Result not found' });
    }
    const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Main endpoint - Generate account brief
app.post('/generate', async (req, res) => {
  const runId = `run-${Date.now()}`;
  const startTime = Date.now();
  
  try {
    console.log(`\n[${runId}] === STARTING RESEARCH ===`);
    
    const { company_domain, company_name, persona_target, offer_type } = req.body;
    
    if (!company_domain && !company_name) {
      return res.status(400).json({
        run_id: runId,
        status: 'error',
        error: 'Provide company_domain or company_name'
      });
    }

    const domain = company_domain || `${company_name?.toLowerCase().replace(/\s+/g, '')}.com`;
    const persona = persona_target || 'Founder/CEO';
    const offer = offer_type || 'Startup Insurance Demo';
    
    console.log(`[${runId}] Target: ${company_name || domain}, Persona: ${persona}`);
    
    let evidence = null;
    let briefData = null;
    let heroImage = null;

    // Phase 1: AgentQL Web Scraping (gather evidence)
    if (USE_AGENTQL) {
      try {
        console.log(`[${runId}] Calling AgentQL to scrape ${domain}...`);
        evidence = await extractCompanyEvidence(domain);
        console.log(`[${runId}] ✓ AgentQL evidence collected`);
        
        // Log what was found
        const hasHomepage = Object.keys(evidence.homepage_insights || {}).length > 0;
        const hasPricing = evidence.pricing_insights !== null;
        const hasCareers = evidence.careers_insights !== null;
        const hasBlog = evidence.blog_insights !== null;
        console.log(`[${runId}]   Homepage: ${hasHomepage ? '✓' : '✗'}, Pricing: ${hasPricing ? '✓' : '✗'}, Careers: ${hasCareers ? '✓' : '✗'}, Blog: ${hasBlog ? '✓' : '✗'}`);
      } catch (error) {
        console.error(`[${runId}] AgentQL failed (non-fatal): ${error.message}`);
        evidence = null;
      }
    } else {
      console.log(`[${runId}] AgentQL disabled - skipping web scraping`);
    }

    // Phase 2: Yutori Research (with evidence context)
    if (USE_YUTORI) {
      try {
        console.log(`[${runId}] Calling Yutori Research API...`);
        briefData = await generateAccountBrief(domain, company_name, persona, offer, evidence);
        console.log(`[${runId}] ✓ Yutori research complete`);
      } catch (error) {
        console.error(`[${runId}] Yutori failed: ${error.message}`);
        console.log(`[${runId}] Using mock data as fallback`);
        briefData = JSON.parse(JSON.stringify(mockResponse.data)); // Deep copy
        briefData.company.name = company_name || domain;
        briefData.company.domain = domain;
      }
    } else {
      console.log(`[${runId}] Yutori disabled - using mock data`);
      briefData = JSON.parse(JSON.stringify(mockResponse.data)); // Deep copy
      briefData.company.name = company_name || domain;
      briefData.company.domain = domain;
    }

    // Phase 3: Freepik Image (optional)
    if (USE_FREEPIK && briefData) {
      try {
        console.log(`[${runId}] Generating hero image...`);
        const industry = briefData.company?.industry || 'Technology';
        heroImage = await generateHeroImageSafe(
          briefData.company?.name || company_name,
          industry
        );
        if (heroImage) {
          console.log(`[${runId}] ✓ Image generated: ${heroImage.filename}`);
          briefData.hero_image = {
            filename: heroImage.filename,
            path: `/output/images/${heroImage.filename}`,
            dataUri: heroImage.dataUri?.substring(0, 100) + '...' // Truncate for response
          };
        }
      } catch (error) {
        console.log(`[${runId}] Freepik skipped: ${error.message}`);
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[${runId}] === DONE in ${duration}s ===\n`);

    // Build final response
    const result = {
      run_id: runId,
      timestamp: new Date().toISOString(),
      status: 'success',
      customer: 'Corgi AI',
      target: company_name || domain,
      data: briefData,
      evidence: evidence, // Include scraped evidence in response
      meta: {
        duration_seconds: parseFloat(duration),
        agentql_used: USE_AGENTQL && evidence !== null,
        yutori_used: USE_YUTORI,
        freepik_used: !!heroImage
      }
    };

    // Save result to file
    const safeCompanyName = (company_name || domain).toLowerCase().replace(/[^a-z0-9]/g, '-');
    const resultFilename = `${safeCompanyName}-${runId}.json`;
    const resultPath = path.join(RESULTS_DIR, resultFilename);
    
    // Save full result (with complete dataUri for hero image)
    const resultToSave = JSON.parse(JSON.stringify(result));
    if (heroImage && briefData.hero_image) {
      resultToSave.data.hero_image.dataUri = heroImage.dataUri; // Full dataUri for saved file
    }
    fs.writeFileSync(resultPath, JSON.stringify(resultToSave, null, 2));
    console.log(`[${runId}] Result saved to: ${resultPath}`);
    
    // Add path info to response
    result.saved_to = `/output/results/${resultFilename}`;

    res.json(result);
    
  } catch (error) {
    console.error(`[${runId}] ERROR: ${error.message}`);
    res.status(500).json({
      run_id: runId,
      status: 'error',
      error: error.message
    });
  }
});

// 404
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Start
app.listen(PORT, () => {
  console.log(`\n🐕 Chopin - Account Research Agent`);
  console.log(`📋 Customer: Corgi AI (Startup Insurance)`);
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`\n🔧 APIs:`);
  console.log(`   AgentQL: ${USE_AGENTQL ? '✓' : '✗'} (web scraping)`);
  console.log(`   Yutori:  ${USE_YUTORI ? '✓' : '✗'} (research)`);
  console.log(`   Freepik: ${USE_FREEPIK ? '✓' : '✗'} (images)`);
  console.log(`\n📂 Output:`);
  console.log(`   Results: ${RESULTS_DIR}`);
  console.log(`   Images:  ${path.join(OUTPUT_DIR, 'images')}`);
  console.log(`\n📋 Endpoints:`);
  console.log(`   GET  /health    - Status check`);
  console.log(`   GET  /targets   - Target company list`);
  console.log(`   GET  /results   - List saved results`);
  console.log(`   POST /generate  - Generate account brief`);
  console.log(`\n🎯 Demo targets: Yutori, Retool, TinyFish, Cline AI, Freepik`);
  console.log(`\n⚡ Pipeline: AgentQL (scrape) → Yutori (research) → Freepik (image)\n`);
});
