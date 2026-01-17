require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { TARGET_COMPANIES, mockResponse } = require('./src/schemas/responseSchema');
const { generateAccountBrief } = require('./src/clients/yutoriClient');
const { generateHeroImageSafe } = require('./src/clients/freepikClient');

const app = express();
const PORT = process.env.PORT || 3000;

// Feature flags
const USE_YUTORI = !!process.env.YUTORI_API_KEY;
const USE_FREEPIK = !!process.env.FREEPIK_API_KEY;

// Middleware
app.use(cors());
app.use(express.json());

// Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    apis: { yutori: USE_YUTORI, freepik: USE_FREEPIK },
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
    
    let briefData = null;
    let heroImageUrl = null;

    // Phase 1: Yutori Research (or mock)
    if (USE_YUTORI) {
      try {
        console.log(`[${runId}] Calling Yutori Research API...`);
        briefData = await generateAccountBrief(domain, company_name, persona, offer);
        console.log(`[${runId}] ✓ Yutori research complete`);
      } catch (error) {
        console.error(`[${runId}] Yutori failed: ${error.message}`);
        console.log(`[${runId}] Using mock data as fallback`);
        briefData = mockResponse.data;
        briefData.company.name = company_name || domain;
        briefData.company.domain = domain;
      }
    } else {
      console.log(`[${runId}] Yutori disabled - using mock data`);
      briefData = mockResponse.data;
      briefData.company.name = company_name || domain;
      briefData.company.domain = domain;
    }

    // Phase 2: Freepik Image (optional)
    if (USE_FREEPIK && briefData) {
      try {
        console.log(`[${runId}] Generating hero image...`);
        heroImageUrl = await generateHeroImageSafe(
          briefData.company?.name || company_name,
          'Startup Insurance'
        );
        if (heroImageUrl) {
          console.log(`[${runId}] ✓ Image generated`);
          briefData.hero_image_url = heroImageUrl;
        }
      } catch (error) {
        console.log(`[${runId}] Freepik skipped: ${error.message}`);
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[${runId}] === DONE in ${duration}s ===\n`);

    res.json({
      run_id: runId,
      timestamp: new Date().toISOString(),
      status: 'success',
      customer: 'Corgi AI',
      target: company_name || domain,
      data: briefData,
      meta: {
        duration_seconds: parseFloat(duration),
        yutori_used: USE_YUTORI,
        freepik_used: !!heroImageUrl
      }
    });
    
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
  console.log(`   Yutori: ${USE_YUTORI ? '✓' : '✗'}`);
  console.log(`   Freepik: ${USE_FREEPIK ? '✓' : '✗'}`);
  console.log(`\n📋 Endpoints:`);
  console.log(`   GET  /health    - Status check`);
  console.log(`   GET  /targets   - Target company list`);
  console.log(`   POST /generate  - Generate account brief`);
  console.log(`\n🎯 Demo targets: Yutori, Retool, TinyFish, Cline AI, Freepik\n`);
});
