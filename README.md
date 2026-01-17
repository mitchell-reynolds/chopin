# Account Brief Generator 🚀

**AI-powered account research and outreach pack generator** using 3 sponsor APIs: Yutori Research, AgentQL (TinyFish), and Freepik Image Generation.

Built for the [Agentic Orchestration Hack](https://agentic-orchestration-hack.devpost.com/) - showcasing real-world AI orchestration with production-ready fallbacks.

## 🎯 What It Does

Generate comprehensive sales account briefs in seconds:
- **Company Intelligence**: Industry, size, ICP, personas
- **Pain Points & Hooks**: Targeted value propositions
- **Outreach Materials**: 3-email sequence, LinkedIn DM, call opener
- **Objection Handling**: Common objections with rebuttals
- **Evidence-Based**: Web scraping for credible "receipts"
- **Hero Image**: AI-generated cover image for presentations

## 🏗️ Architecture

```
┌─────────────┐
│   Retool    │ ← Thin UI layer
│     UI      │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│     Express Server (Node.js)            │
│  ┌───────────────────────────────────┐  │
│  │  POST /generate endpoint          │  │
│  └───────────────────────────────────┘  │
│         │         │         │            │
│    Phase 1   Phase 2   Phase 3          │
│         │         │         │            │
│    ┌────▼────┐ ┌─▼──────┐ ┌▼────────┐  │
│    │AgentQL  │ │Yutori  │ │Freepik  │  │
│    │Extract  │ │Research│ │Image    │  │
│    │Evidence │ │& Brief │ │Generate │  │
│    └─────────┘ └────────┘ └─────────┘  │
└─────────────────────────────────────────┘
```

## 📦 Prerequisites

1. **Node.js** (v18+) and npm
   ```bash
   # Install Node.js if not already installed
   brew install node  # macOS
   # or download from https://nodejs.org
   ```

2. **API Keys** (already in `.env`):
   - `YUTORI_API_KEY` - For deep web research
   - `MINO_API_KEY` - AgentQL for web scraping
   - `FREEPIK_API_KEY` - AI image generation

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```

You should see:
```
🚀 Account Brief Generator API
📡 Server running on http://localhost:3000
🔧 API Configuration:
   AgentQL (TinyFish): ✓ Enabled
   Yutori Research:    ✓ Enabled
   Freepik Images:     ✓ Enabled
💡 Ready for Retool integration!
```

### 3. Test the Endpoint

**Using curl:**
```bash
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "company_domain": "stripe.com",
    "company_name": "Stripe",
    "persona_target": "VP of Finance",
    "offer_type": "Product Demo"
  }'
```

**Using Postman/Insomnia:**
- Method: `POST`
- URL: `http://localhost:3000/generate`
- Body (JSON):
```json
{
  "company_domain": "retool.com",
  "company_name": "Retool",
  "persona_target": "Head of Engineering",
  "offer_type": "Partnership Discussion"
}
```

## 🎨 Retool Integration

### Step 1: Create New Retool App
1. Go to [Retool](https://retool.com)
2. Create new app: "Account Brief Generator"

### Step 2: Add Input Components
Add these components to your canvas:

**Text Inputs:**
- `company_domain_input` - Label: "Company Domain"
- `company_name_input` - Label: "Company Name"
- `persona_target_input` - Label: "Target Persona" (default: "VP of Sales")
- `offer_type_input` - Label: "Offer Type" (default: "Product Demo")

**Button:**
- `generate_button` - Label: "Generate Brief"

### Step 3: Create REST API Query
1. Click "+" → Create new → Resource Query
2. Name it: `generateBrief`
3. **Method**: POST
4. **URL**: `http://localhost:3000/generate`
5. **Body** (JSON):
```json
{
  "company_domain": {{ company_domain_input.value }},
  "company_name": {{ company_name_input.value }},
  "persona_target": {{ persona_target_input.value }},
  "offer_type": {{ offer_type_input.value }}
}
```
6. Set trigger: Link to `generate_button` onClick event

### Step 4: Display Results
Add these components:

**Image:**
- Source: `{{ generateBrief.data.data.hero_image_url }}`
- Show if: `{{ generateBrief.data.data.hero_image_url !== null }}`

**JSON Viewer:**
- Data: `{{ generateBrief.data }}`
- Expandable sections for easy navigation

**Optional - Individual Text Fields:**
- Company Summary: `{{ generateBrief.data.data.company.summary }}`
- Email 1: `{{ generateBrief.data.data.outreach.email_sequence[0].body }}`
- LinkedIn DM: `{{ generateBrief.data.data.outreach.linkedin_dm }}`
- Sources (bullet list): `{{ generateBrief.data.data.sources }}`

### Step 5: Add Copy Buttons
For each important field, add a "Copy" button:
```javascript
// Copy email to clipboard
copyToClipboard(generateBrief.data.data.outreach.email_sequence[0].body)
```

## 🎬 3-Minute Demo Script

### Minute 1: Introduction (0:00-1:00)
> "Today I'm demoing an AI-powered Account Brief Generator that orchestrates 3 sponsor APIs to create personalized sales outreach packs in seconds."
>
> **Show:** Retool UI with clean input fields

### Minute 2: Live Generation (1:00-2:00)
> "Let me generate a brief for [Company]. I'll enter their domain, target persona, and click Generate."
>
> **Type in Retool:**
> - Domain: `notion.so`
> - Persona: `Head of Sales`
> - Offer: `Product Demo`
>
> **Click Generate** → Show loading state
>
> "Behind the scenes:
> 1. AgentQL scrapes their website for evidence
> 2. Yutori conducts deep research and generates the brief
> 3. Freepik creates a hero image"

### Minute 3: Results Walkthrough (2:00-3:00)
> **Show hero image at top**
>
> "The output includes:
> - Company intelligence with verified sources
> - Evidence from their actual website (show evidence section)
> - 3-email sequence ready to personalize
> - LinkedIn DM and call opener
> - Objection handling with rebuttals
> - All backed by real URLs as sources"
>
> **Click copy button** → "Ready to use immediately"
>
> "This demonstrates:
> ✓ 3 sponsor tools (Yutori, AgentQL, Freepik)
> ✓ Real production orchestration
> ✓ Graceful fallbacks if APIs timeout
> ✓ Built entirely with Cline for 'Most Innovative Use' track"

## 📋 API Endpoints

### `GET /health`
Health check endpoint
```bash
curl http://localhost:3000/health
```

### `POST /generate`
Generate account brief

**Request Body:**
```json
{
  "company_domain": "example.com",  // Required (or company_name)
  "company_name": "Example Inc",     // Required (or company_domain)
  "persona_target": "VP of Sales",   // Optional
  "offer_type": "Product Demo"       // Optional
}
```

**Response:**
```json
{
  "run_id": "run-1234567890-abc123",
  "timestamp": "2024-01-16T22:30:00.000Z",
  "status": "success",
  "data": {
    "company": { /* ... */ },
    "icp": { /* ... */ },
    "personas": { /* ... */ },
    "pain_points": [ /* ... */ ],
    "hooks": [ /* ... */ ],
    "outreach": {
      "email_sequence": [ /* 3 emails */ ],
      "linkedin_dm": "...",
      "call_opener": "..."
    },
    "objections": [ /* ... */ ],
    "next_steps": [ /* ... */ ],
    "evidence": {
      "homepage_insights": { /* AgentQL data */ },
      "pricing_insights": { /* ... */ },
      "careers_insights": { /* ... */ },
      "blog_insights": { /* ... */ }
    },
    "hero_image_url": "https://...",
    "sources": [ /* URLs */ ]
  },
  "error": null,
  "meta": {
    "duration_seconds": 45.23,
    "apis_used": {
      "agentql": true,
      "yutori": true,
      "freepik": true
    }
  }
}
```

## 🛡️ Production Features

### Graceful Degradation
- If AgentQL fails → continues with Yutori-only research
- If Freepik fails → returns brief without image
- If Yutori fails → returns error (core functionality)

### Timeouts
- AgentQL: 30s per extraction, 45s total
- Yutori: 60s for deep research
- Freepik: 45s for image generation

### Logging
Every run includes:
- Unique `run_id` for tracking
- Phase-by-phase progress logs
- Duration metrics
- API usage tracking

### Error Handling
```javascript
// All APIs have try-catch with specific error messages
// Logs show exactly where failures occur
// Non-fatal errors don't crash the entire generation
```

## 🔧 Development

### Run with Auto-Reload
```bash
npm run dev
```

### Project Structure
```
chopin/
├── server.js                 # Express server & orchestration
├── package.json              # Dependencies
├── .env                      # API keys (not in git)
├── src/
│   ├── clients/
│   │   ├── yutoriClient.js   # Yutori Research API
│   │   ├── agentqlClient.js  # AgentQL REST API
│   │   └── freepikClient.js  # Freepik Image API
│   ├── schemas/
│   │   └── responseSchema.js # Response structure & mock data
│   └── prompts/
│       └── yutoriPrompt.js   # Prompt engineering for Yutori
└── README.md                 # This file
```

## 🐛 Troubleshooting

### "Cannot find module 'express'"
```bash
npm install
```

### Yutori API 403 or 401 Errors
**403 Forbidden:** Your API key doesn't have access to research tasks
- Verify you have a paid Yutori plan
- Check your key at https://scouts.yutori.com/settings
- Ensure the key starts with `yt_`

**401 Unauthorized:** Authentication failed
- Check that `YUTORI_API_KEY` in `.env` is correct
- No spaces or quotes around the key value

### Yutori Task Timeout
The API uses async polling (creates task → polls for results).
- Normal processing time: 20-60 seconds
- If it times out, the API will retry up to 20 times
- Check server logs for specific error messages

### "AgentQL skipped"
This is normal - it's a non-fatal fallback. The brief will still generate without evidence extraction.

### Port 3000 already in use
```bash
PORT=3001 npm start
# Then update Retool URL to http://localhost:3001/generate
```

### Retool can't connect to localhost
**Quick fix with ngrok:**
```bash
# In one terminal:
npm start

# In another terminal:
ngrok http 3000
# Copy the https URL (e.g., https://abc123.ngrok.io)
# Update Retool query URL to: https://abc123.ngrok.io/generate
```

**Or deploy to production:**
1. Push code to GitHub
2. Deploy to Render/Railway/Fly.io
3. Add environment variables (API keys)
4. Update Retool query URL to your deployment URL

### API Returns Mock Data
If you see "Acme Corp" in results, the server is returning mock data because:
- Yutori API key is missing or invalid
- Check server logs for "[Yutori]" error messages
- Verify all 3 API keys are set correctly in `.env`

### Long Generation Times
**Normal processing time:** 30-90 seconds total
- AgentQL extraction: 10-30 seconds
- Yutori research: 20-60 seconds  
- Freepik image: 5-15 seconds

If it takes longer, check:
- Your internet connection
- API rate limits (429 errors in logs)
- Server logs for which API is slow

## 🏆 Hackathon Tracks

This project qualifies for:
- ✅ **Yutori Track** - Deep research with structured output
- ✅ **AgentQL Track** - Evidence extraction from multiple pages
- ✅ **Freepik Track** - AI-generated hero images
- ✅ **Retool Track** - Clean UI for business users
- ✅ **Cline Track** - Entire codebase built with AI assistance

## 📚 API Documentation

- [Yutori Research API](https://docs.yutori.com/)
- [AgentQL REST API](https://docs.agentql.com/rest-api/api-reference)
- [Freepik Image Generation](https://www.freepik.com/api/image-generation)
- [Retool Workflows](https://docs.retool.com/workflows/)

## 📝 License

MIT License - Built for Agentic Orchestration Hack 2025

---

**Built with** ❤️ **by Cline** - Demonstrating real-world AI orchestration with production-ready patterns.
