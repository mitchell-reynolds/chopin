# ⚡ Quick Start Checklist

Get your hackathon demo running in 5 minutes!

## ✅ Pre-Flight Checklist

- [x] API Keys configured in `.env`
  - [x] YUTORI_API_KEY
  - [x] MINO_API_KEY (AgentQL)
  - [x] FREEPIK_API_KEY
- [x] Node.js installed (v18+)
- [x] Dependencies installed (`npm install`)
- [x] Server running (`npm start`)
- [ ] Retool app created

---

## 🚀 5-Minute Setup

### Step 1: Install Node.js (if needed)
```bash
# Check if you have Node.js
node --version

# If not installed:
brew install node  # macOS
```

### Step 2: Install Dependencies
```bash
cd /Users/msr/msr/chopin
npm install
```

### Step 3: Start Server
```bash
npm start
```

**Expected output:**
```
🚀 Account Brief Generator API
📡 Server running on http://localhost:3000
🔧 API Configuration:
   AgentQL (TinyFish): ✓ Enabled
   Yutori Research:    ✓ Enabled
   Freepik Images:     ✓ Enabled
💡 Ready for Retool integration!
```

### Step 4: Test Locally (Optional)
```bash
# In a new terminal:
./test-api.sh stripe.com
```

### Step 5: Set Up Retool
See [RETOOL_SETUP.md](./RETOOL_SETUP.md) for detailed instructions.

**Ultra-quick version:**
1. Create Retool app
2. Add button and JSON viewer
3. Add REST query to `http://localhost:3000/generate`
4. Click generate!

---

## 🎬 Demo Checklist

Before your 3-minute demo:

- [ ] Server is running
- [ ] Tested with at least one company
- [ ] Retool app is open and ready
- [ ] Have backup result pre-generated (in case of API timeout)
- [ ] Know your demo script (see README.md)

### Quick Demo Script
1. **Intro (30s):** "I built an AI orchestration system that generates personalized sales briefs using 3 sponsor APIs"
2. **Live Demo (90s):** Type company domain → Click Generate → Wait → Show results
3. **Walkthrough (60s):** Show evidence, emails, objections, sources, hero image

---

## 📊 API Usage Summary

Your demo uses **all 3 sponsor tools**:

| API | Purpose | Track Eligible |
|-----|---------|----------------|
| **Yutori** | Deep web research + structured brief generation | ✅ Yutori Track |
| **AgentQL** | Web scraping for evidence (homepage, pricing, careers, blog) | ✅ AgentQL Track |
| **Freepik** | AI-generated hero image for the brief | ✅ Freepik Track |
| **Retool** | UI layer for business users | ✅ Retool Track |
| **Cline** | Entire codebase built with AI assistance | ✅ Cline Track |

---

## 🐛 Quick Troubleshooting

### Server won't start
```bash
# Check if Node.js is installed
node --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### "EADDRINUSE" error (port 3000 in use)
```bash
# Use a different port
PORT=3001 npm start
```

### API timeouts during demo
**Don't panic!** This is why we have graceful fallbacks:
- AgentQL fails → Brief still generates without evidence
- Freepik fails → Brief still generates without image
- Show the logs to demonstrate error handling

### Retool can't connect
```bash
# Option 1: Use ngrok for public URL
ngrok http 3000

# Option 2: Check server is running
curl http://localhost:3000/health
```

---

## 📁 File Overview

```
chopin/
├── 📄 server.js              ← Main orchestration logic
├── 📄 package.json           ← Dependencies
├── 📄 .env                   ← API keys (✓ already configured)
├── 📄 README.md              ← Full documentation
├── 📄 RETOOL_SETUP.md        ← Retool integration guide
├── 📄 QUICKSTART.md          ← This file
├── 🧪 test-api.sh            ← Test script
└── 📁 src/
    ├── clients/              ← API client modules
    │   ├── yutoriClient.js
    │   ├── agentqlClient.js
    │   └── freepikClient.js
    ├── prompts/              ← Prompt engineering
    │   └── yutoriPrompt.js
    └── schemas/              ← Response structure
        └── responseSchema.js
```

---

## 🎯 What Makes This Demo Special

1. **Real Production Patterns**
   - Graceful degradation
   - Timeout handling
   - Structured logging
   - Run ID tracking

2. **True Multi-API Orchestration**
   - AgentQL → Yutori → Freepik pipeline
   - Evidence feeds into research
   - Each API failure handled independently

3. **Actually Useful Output**
   - Not just a toy demo
   - Real sales teams could use this
   - 3-email sequence + LinkedIn + call opener
   - Sources for credibility

4. **Clean Architecture**
   - Thin UI (Retool)
   - Fat backend (Node + Express)
   - Easy to test, debug, and extend

---

## ⏱️ Time Estimate

- **Install Node.js:** 2 minutes
- **npm install:** 1 minute
- **Test locally:** 1 minute
- **Set up Retool:** 5-15 minutes (depending on UI complexity)
- **Total:** ~10-20 minutes to full demo

---

## 🏆 Ready to Ship?

When everything above is checked:
- ✅ Server running
- ✅ Retool connected
- ✅ One successful test generation
- ✅ Demo script prepared

**You're ready to present!** 🎉

---

## 💡 Pro Tips

1. **Pre-generate a backup** before your live demo
2. **Use a well-known company** (Stripe, Notion, Figma) - APIs work better
3. **Show the logs** - they're designed to be demo-friendly
4. **Copy an email live** - proves it's real, usable output
5. **Emphasize the orchestration** - that's what makes this special

---

Built for Agentic Orchestration Hack 2025 🚀
