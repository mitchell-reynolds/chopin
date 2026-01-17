# 🐕 Chopin - Account Research Agent

**Built for the Agentic Orchestration Hackathon**

An AI-powered account research agent that helps **Corgi AI** (startup insurance) pitch to target startups by generating personalized sales briefs.

## 🎯 Demo Use Case

**Customer:** Corgi AI - Startup Insurance Product
**Task:** Research target startups and generate personalized outreach for founders/CEOs

**Target Companies:**
- Yutori
- Retool  
- TinyFish/AgentQL
- Cline AI
- Freepik

## ✅ What's Working

| Component | Status | Notes |
|-----------|--------|-------|
| **Express Server** | ✅ Working | Running on localhost:3000 |
| **Yutori Research API** | ✅ Working | Returns real company research (takes 3-5 mins) |
| **Freepik Image API** | ⚠️ Partial | Calls succeed but image URL not always returned |
| **Mock Fallback** | ✅ Working | Instant fallback if Yutori fails |

## 🚀 Quick Demo (What You Need To Do)

### Step 1: Verify Server is Running
```bash
curl http://localhost:3000/health
```

Expected output:
```json
{"status":"ok","apis":{"yutori":true,"freepik":true},"customer":"Corgi AI"}
```

### Step 2: Test Research API
```bash
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{"company_name": "Retool", "company_domain": "retool.com"}'
```

**This takes 3-5 minutes** - Yutori does real web research!

### Step 3: Set Up Retool Agent (for nice UI)

1. **Get ngrok URL** (Retool can't access localhost):
   ```bash
   ngrok http 3000
   ```
   Copy the `https://xxxxx.ngrok.io` URL

2. **Create Retool Agent:**
   - Go to https://retool.com → Create new → **Agent**
   - Name: "Chopin - Corgi AI Research"

3. **Add API Action:**
   - Name: `researchCompany`
   - Method: POST
   - URL: `https://YOUR-NGROK-URL/generate`
   - Body:
   ```json
   {
     "company_name": "{{company_name}}",
     "company_domain": "{{company_domain}}"
   }
   ```

4. **Add Agent Instructions:**
   ```
   You are Chopin, a research assistant for Corgi AI (startup insurance).
   Use the researchCompany action to generate sales briefs.
   Target companies: Yutori, Retool, TinyFish, Cline AI, Freepik
   Research takes 3-5 minutes. Present results clearly.
   ```

5. **Test with:** "Research Retool for me"

## 📊 3-Minute Demo Script

**Minute 1 - Intro**
> "Chopin is an AI agent built for Corgi AI, a startup insurance company.
> It researches target companies and generates personalized outreach.
> Built with Cline, using Yutori's research API and Freepik for images."

**Minute 2 - Show the Flow**
> [If you pre-generated results, show them]
> "Here's real research data for Freepik - personalized pain points about AI liability, 
> cyber exposure, and E&O risks. Custom email and LinkedIn outreach ready to send."

**Minute 3 - Technical**
> "The agent calls Yutori's research API which does real web research.
> It takes 3-5 minutes per company, but returns genuinely personalized content.
> All built in the IDE with Cline assistance."

## 📁 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Server status and API config |
| `/targets` | GET | List of target companies |
| `/generate` | POST | Generate account brief |

### Generate Request
```json
{
  "company_name": "Retool",
  "company_domain": "retool.com"
}
```

### Generate Response (example)
```json
{
  "status": "success",
  "customer": "Corgi AI",
  "target": "Freepik",
  "data": {
    "company": {
      "name": "Freepik Company S.L.U.",
      "summary": "AI-powered creative platform...",
      "stage": "PE-backed, scale-stage"
    },
    "pain_points": [
      "AI-related liability from generative features...",
      "Cyber exposure due to large user base...",
      "Technology E&O risk..."
    ],
    "hooks": [
      "Purpose-built coverage for AI-driven products...",
      "Fast, modular policies..."
    ],
    "outreach": {
      "email_subject": "Insurance fit for Freepik's AI platform",
      "email_body": "Joaquín—Freepik's AI-powered platform is scaling...",
      "linkedin_dm": "Joaquín—Corgi maps insurance to AI, E&O, and cyber risks..."
    },
    "sources": ["https://www.freepik.com/company/about-us", "..."]
  }
}
```

## ⚡ Key Files

```
chopin/
├── server.js                 # Express server (main entry)
├── src/
│   ├── clients/
│   │   ├── yutoriClient.js   # Yutori Research API ✅
│   │   └── freepikClient.js  # Freepik Image API ⚠️
│   ├── prompts/
│   │   └── yutoriPrompt.js   # Simplified prompt for Corgi AI
│   └── schemas/
│       └── responseSchema.js # Target companies & mock data
├── DEMO_SCRIPT.md            # 3-min demo with pre-saved results ⭐
├── RETOOL_AGENT_SETUP.md     # Quick agent setup (<5 min)
├── QUICKSTART.md             # Getting started guide
├── DEMO_READY.md             # Status & quick commands
└── README.md                 # This file
```

## 🏆 Hackathon Tracks

- ✅ **Yutori** - Real research API integration
- ✅ **Freepik** - Image generation (partial)
- ✅ **Retool** - Agent UI layer
- ✅ **Cline** - Entire codebase built with AI

## 🐛 Troubleshooting

**Server not running?**
```bash
cd /Users/msr/msr/chopin && /opt/homebrew/bin/node server.js
```

**Research times out?**
- Normal - Yutori takes 3-5 minutes for real research
- If it times out after 5 mins, it falls back to mock data

**Retool can't connect?**
- Make sure you're using ngrok URL, not localhost
- Run `ngrok http 3000` and use the https URL

---

**Status:** ✅ DEMO READY | Built for Agentic Orchestration Hackathon
