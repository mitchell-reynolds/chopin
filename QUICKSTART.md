# ⚡ Quick Start - Chopin for Corgi AI

Get the Corgi AI account research demo running in 5 minutes!

## ✅ Pre-Flight Checklist

- [x] API Keys configured in `.env`
  - [x] YUTORI_API_KEY
  - [x] FREEPIK_API_KEY
- [x] Node.js installed (v18+)
- [x] Dependencies installed (`npm install`)
- [x] Server running (`npm start`)
- [ ] Retool Agent created (see RETOOL_AGENT_SETUP.md)

---

## 🐕 About This Project

**Customer:** Corgi AI (Startup Insurance)  
**Use Case:** Research target startups and generate personalized insurance sales outreach  
**Target Personas:** Founders, CEOs, COOs of tech startups

---

## 🚀 5-Minute Setup

### Step 1: Start Server
```bash
cd /Users/msr/msr/chopin
npm start
```

**Expected output:**
```
🐕 Chopin - Account Research Agent
📋 Customer: Corgi AI (Startup Insurance)
📡 Server: http://localhost:3000

🔧 APIs:
   Yutori: ✓
   Freepik: ✓

📋 Endpoints:
   GET  /health    - Status check
   GET  /targets   - Target company list
   POST /generate  - Generate account brief

🎯 Demo targets: Yutori, Retool, TinyFish, Cline AI, Freepik
```

### Step 2: Verify Health
```bash
curl http://localhost:3000/health
```

### Step 3: Set Up Retool Agent
See [RETOOL_AGENT_SETUP.md](./RETOOL_AGENT_SETUP.md) - takes ~5 minutes

---

## 📊 API Usage

| API | Purpose | Track |
|-----|---------|-------|
| **Yutori** | Deep web research + structured brief generation | ✅ Yutori Track |
| **Freepik** | AI-generated hero image for brief | ✅ Freepik Track |
| **Retool** | Agent UI for conversational interface | ✅ Retool Track |
| **Cline** | Entire codebase built with AI assistance | ✅ Cline Track |

---

## 📁 Key Files

```
chopin/
├── server.js                 # Express server (main entry)
├── src/
│   ├── clients/
│   │   ├── yutoriClient.js   # Yutori Research API
│   │   └── freepikClient.js  # Freepik Image API
│   ├── prompts/
│   │   └── yutoriPrompt.js   # Prompt for Corgi AI research
│   └── schemas/
│       └── responseSchema.js # Target companies & mock data
├── DEMO_SCRIPT.md            # 3-minute demo with pre-saved results
├── RETOOL_AGENT_SETUP.md     # Quick agent setup (<5 min)
└── README.md                 # Full documentation
```

---

## ⏱️ Important Timing Notes

- **Yutori research takes 3-5 minutes** per company
- For demo, use **pre-saved results** (see DEMO_SCRIPT.md)
- Mock fallback works instantly if Yutori fails

---

## 🐛 Quick Troubleshooting

### Server won't start
```bash
node --version   # Need v18+
npm install      # Reinstall deps
```

### Port 3000 in use
```bash
PORT=3001 npm start
```

### Retool can't connect
```bash
# Use ngrok for public URL
ngrok http 3000
```

---

Built for Agentic Orchestration Hack 2025 🚀
