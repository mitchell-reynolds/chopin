# 🤖 Retool Agent Setup (<5 Minutes)

Create a Corgi AI research agent in Retool.

---

## ⚡ Quick Setup (Copy-Paste Ready)

### Step 1: Create Agent (30 seconds)
1. Go to [Retool](https://login.retool.com)
2. Click **Create new** → **Agent**
3. Name: `Chopin - Corgi AI Research`

### Step 2: Add API Resource (1 minute)
1. Click **Resources** in left sidebar
2. Click **+ Add resource** → **REST API**
3. Configure:
   - **Name:** `Chopin API`
   - **Base URL:** Your ngrok URL (e.g., `https://abc123.ngrok.io`)
   
   > ⚠️ Get ngrok URL first: `ngrok http 3000`

4. Click **Save**

### Step 3: Add Action (2 minutes)
1. Back in the Agent, click **+ Add action**
2. **Action name:** `researchCompany`
3. **Resource:** Select `Chopin API`
4. **Method:** `POST`
5. **Path:** `/generate`
6. **Body:** Paste this exactly:
```json
{
  "company_name": "{{ company_name }}",
  "company_domain": "{{ company_domain }}"
}
```

7. **Parameters** - Add two:
   | Name | Type | Description |
   |------|------|-------------|
   | `company_name` | string | Company name (e.g., "Retool") |
   | `company_domain` | string | Company domain (e.g., "retool.com") |

8. **Action description** (paste this):
```
Research a target startup and generate an insurance sales brief for Corgi AI. 
Returns company summary, pain points, hooks, and personalized email/LinkedIn outreach.
Note: Research takes 3-5 minutes to complete.
```

9. Click **Save**

### Step 4: Set Agent Instructions (1 minute)
Click the **Agent settings** tab and paste:

```
You are Chopin, an AI research assistant for Corgi AI (startup insurance).

Your job: Research target startups and generate personalized sales briefs.

Target companies: Yutori, Retool, TinyFish/AgentQL, Cline AI, Freepik

When a user asks to research a company:
1. Use the researchCompany action with company_name and company_domain
2. Wait for results (takes 3-5 minutes)
3. Present findings in this order:
   - Company Overview
   - Pain Points (insurance-related risks)  
   - Hooks (Corgi AI value props)
   - Email outreach
   - LinkedIn DM

Keep responses concise and actionable.
```

### Step 5: Test (30 seconds)
Try this prompt:
```
Research Retool for me
```

---

## 🎯 Test Prompts That Work

```
Research Freepik for Corgi AI
```
```
Generate a sales brief for Yutori
```
```
What insurance pain points does Retool have?
```

---

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| "Can't connect" | Check ngrok is running, use https URL |
| "Action not found" | Make sure action is saved and enabled |
| "Timeout" | Normal - research takes 3-5 min. Wait. |

---

## ✅ You're Done!

Total time: ~5 minutes

The agent will now:
- Research any target company
- Generate Corgi AI insurance pitch
- Create personalized outreach

---

Built for Agentic Orchestration Hack 2025 🚀
