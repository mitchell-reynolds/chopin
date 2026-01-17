# 🐕 Chopin Demo - READY TO GO!

## ✅ What's Working

The Account Research Agent is LIVE and WORKING:

```
Customer: Corgi AI (Startup Insurance)
Targets: Yutori, Retool, TinyFish/AgentQL, Cline AI, Freepik
Persona: Founders/CEO/COO
```

### Successful Test Output (Freepik)

```json
{
  "company": {
    "name": "Freepik Company S.L.U.",
    "summary": "Freepik is an AI-powered creative platform...",
    "stage": "PE-backed, scale-stage"
  },
  "pain_points": [
    "AI-related liability from generative features...",
    "Cyber exposure due to large user base...",
    "Technology E&O risk from software or API issues..."
  ],
  "hooks": [
    "Purpose-built coverage for AI-driven products...",
    "Fast, modular policies that adapt as new creative AI features ship"
  ],
  "outreach": {
    "email_subject": "Insurance fit for Freepik's AI platform",
    "email_body": "Joaquín—Freepik's AI-powered platform is scaling quickly...",
    "linkedin_dm": "Joaquín—Corgi maps insurance to AI, E&O, and cyber risks..."
  }
}
```

## 🚀 How to Run the Demo

### 1. Server is Already Running
Check it's up:
```bash
curl http://localhost:3000/health
```

### 2. Quick Test
```bash
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{"company_name": "Retool", "company_domain": "retool.com"}'
```

### 3. All Target Companies
```bash
curl http://localhost:3000/targets
```

## 🤖 Retool Agent Setup (5 minutes)

### Step 1: Create Agent
1. Go to Retool → Create new → **Agent**
2. Name: "Chopin - Corgi AI Account Research"

### Step 2: Add API Action
- **Name:** `researchCompany`
- **URL:** `http://localhost:3000/generate` (or ngrok URL for cloud)
- **Method:** POST
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "company_name": "{{company_name}}",
  "company_domain": "{{company_domain}}"
}
```

### Step 3: Agent Instructions
```
You are Chopin, an AI account research assistant for Corgi AI (startup insurance).

When a user asks to research a company, use the researchCompany action to generate 
a sales brief for the Corgi AI insurance product.

Target companies: Yutori, Retool, TinyFish/AgentQL, Cline AI, Freepik

Present results clearly:
1. Company Overview (name, summary, stage)
2. Pain Points (insurance-related risks)
3. Hooks (Corgi AI value props)
4. Email & LinkedIn outreach

The research takes 3-5 minutes. Let the user know you're working on it.
```

### Step 4: Test Prompts
- "Research Retool for me"
- "Generate a brief for Freepik"
- "What insurance pain points does Yutori have?"

## 📊 Demo Flow (3 minutes)

**Minute 1 - Intro**
> "This is Chopin, an AI research agent built for Corgi AI. 
> Corgi sells startup insurance and wants to pitch to tech companies.
> The agent uses Yutori's research API to gather intel and generate outreach."

**Minute 2 - Live Demo**
> "Let me research Retool..."
> [Agent calls API, waits ~3-5 minutes]
> "Here's what it found - personalized pain points and outreach."

**Minute 3 - Results**
> "Notice the outreach is tailored to Retool's specific situation.
> The agent used 3 sponsor APIs: Yutori for research, AgentQL for web scraping, and Freepik for images.
> All orchestrated through Cline in the IDE."

## ⚡ Quick Commands

```bash
# Health check
curl http://localhost:3000/health

# List targets
curl http://localhost:3000/targets

# Research a company
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{"company_name": "Yutori", "company_domain": "yutori.com"}'

# Use ngrok for Retool Agent
ngrok http 3000
```

## 🎯 What Makes This Special

1. **Real AI Research** - Yutori actually researches each company
2. **Personalized Output** - Pain points and outreach tailored to each target
3. **Production Ready** - Graceful fallbacks, error handling, logging
4. **Multiple APIs** - Yutori, AgentQL, Freepik all integrated
5. **Built with Cline** - Entire codebase created via AI assistance

## ⏱️ Timing Notes

- Yutori research takes 3-5 minutes per company
- Pre-generate some results if demo time is tight
- The mock fallback works instantly if APIs fail

---

**Status:** ✅ DEMO READY
**Last tested:** Freepik - 294 seconds - SUCCESS
