# Retool Agent Setup Guide

**IMPORTANT:** This guide is for **Retool Agents**, not Retool Apps or Workflows.

Retool Agents are AI-powered autonomous agents that can call your API as a tool/action.

## What is a Retool Agent?

A Retool Agent is an AI assistant that:
- Takes user input (like "Generate an account brief for Stripe")
- Automatically calls your API with the right parameters
- Presents the results in a conversational way
- Can handle follow-up questions

## Setup Instructions

### Step 1: Access Retool Agents

1. Log in to [Retool](https://login.retool.com)
2. Click **"Create new"** → **"Agent"**
3. Name it: "Account Brief Generator Agent"

### Step 2: Configure Your API as a Tool

In the Agent builder:

1. **Add a Custom Action/Tool:**
   - Click **"Tools"** or **"Actions"** in the left sidebar
   - Click **"+ Add action"** or **"Create custom action"**
   - Name: `generateAccountBrief`

2. **Configure the API Call:**
   - **Type:** REST API / HTTP Request
   - **Method:** POST
   - **URL:** `http://localhost:3000/generate`
   - **Headers:**
     ```json
     {
       "Content-Type": "application/json"
     }
     ```
   
3. **Define Parameters** (so the agent knows what inputs it needs):
   - `company_domain` (string) - "The company's website domain (e.g., stripe.com)"
   - `company_name` (string, optional) - "The company name"
   - `persona_target` (string, optional) - "Target persona like 'VP of Sales'"
   - `offer_type` (string, optional) - "Offer type like 'Product Demo'"

4. **Request Body Template:**
   ```json
   {
     "company_domain": "{{company_domain}}",
     "company_name": "{{company_name}}",
     "persona_target": "{{persona_target}}",
     "offer_type": "{{offer_type}}"
   }
   ```

5. **Add Description** (tells the agent when to use this tool):
   ```
   Use this tool to generate a comprehensive account brief and outreach pack for a target company. 
   The tool conducts web research, extracts evidence, and creates personalized sales materials 
   including email sequences, LinkedIn messages, and objection handling. This takes 30-90 seconds to complete.
   ```

### Step 3: Configure Agent Instructions

In the **Agent Settings** or **System Prompt** section:

```
You are an expert sales development assistant. Your job is to help users generate comprehensive 
account briefs and outreach packs for their target companies.

When a user asks to research a company or create an account brief:
1. Ask for the company domain or name if not provided
2. Use the generateAccountBrief tool to create the brief
3. Present the results in an organized, easy-to-read format
4. Highlight the most important insights: company summary, key pain points, and recommended outreach

The research takes 30-90 seconds, so let the user know you're working on it.

When presenting results, organize them into clear sections:
- Company Overview
- Target Personas
- Pain Points & Hooks
- Email Sequence (show all 3 emails)
- LinkedIn DM
- Call Opener
- Objection Handling
- Sources

Always offer to help refine the outreach or explain any findings.
```

### Step 4: Enable the Tool

1. Make sure the `generateAccountBrief` action is **enabled**
2. Check that it's listed in the agent's available tools
3. Save the agent

### Step 5: Test the Agent

1. Click **"Test"** or **"Preview"** mode
2. Try these prompts:

**Example 1:**
```
Generate an account brief for stripe.com targeting VP of Finance
```

**Example 2:**
```
I need to research Notion and create outreach for their Head of Sales
```

**Example 3:**
```
Create a brief for Retool
```

The agent should:
- Call your API automatically
- Wait for the response (30-90 seconds)
- Parse and present the results nicely
- Offer to help with follow-ups

---

## For Production Deployment

### Use ngrok for Public URL

Since Retool Agents run in the cloud, they can't access `localhost:3000`. Use ngrok:

```bash
# Terminal 1: Start your server
npm start

# Terminal 2: Expose it publicly
ngrok http 3000
```

Copy the ngrok URL (e.g., `https://abc123.ngrok.io`) and update your agent's API action URL to:
```
https://abc123.ngrok.io/generate
```

### Or Deploy to Production

Deploy your server to:
- Render: https://render.com
- Railway: https://railway.app  
- Fly.io: https://fly.io
- Heroku: https://heroku.com

Then update the agent's API URL to your deployment URL.

---

## Agent Prompts to Try

Here are some example user prompts that should work well:

1. **Basic:**
   - "Generate a brief for stripe.com"
   - "Research Notion for me"
   - "Create outreach for Figma"

2. **With persona:**
   - "Generate an account brief for retool.com targeting Director of Engineering"
   - "Research Linear for Head of Product"

3. **With context:**
   - "I'm reaching out to Notion's VP of Sales about a product demo. Generate a brief."
   - "Create outreach materials for Stripe targeting their Finance team"

4. **Follow-ups:**
   - "Can you show me the second email from that sequence?"
   - "What are the main pain points?"
   - "Give me just the LinkedIn DM"

---

## Advantages of Retool Agents vs Apps

**Why use Agents:**
- ✅ Natural language interface - users just ask questions
- ✅ Agent automatically parses results and presents them nicely
- ✅ Can handle follow-up questions
- ✅ No need to design UI components
- ✅ Faster setup (5 minutes vs 20+ minutes for an app)

**When to use Apps instead:**
- If you need precise UI control
- If users want to fill forms vs talk conversationally
- If you want to display data in specific tables/charts

For a hackathon demo, **Agents are faster and more impressive** - they show AI autonomy.

---

## Troubleshooting

### "Agent can't call the API"
- ✅ Check you're using ngrok or a public URL (not localhost)
- ✅ Verify the API action is enabled in the agent
- ✅ Test the API URL directly in your browser or Postman

### "Agent says it doesn't have the tool"
- ✅ Make sure you added the action to the agent
- ✅ Check the action is enabled
- ✅ Try refreshing the agent builder

### "API returns errors"
- ✅ Check server logs for the actual error
- ✅ Verify API keys are set in .env
- ✅ Test the endpoint works with curl first

### "Agent response is slow"
- ✅ Normal! The API takes 30-90 seconds
- ✅ Make sure agent instructions mention this delay
- ✅ Agent should show "thinking" indicator while waiting

---

## Demo Script for Retool Agent

**Minute 1: Introduction**
> "I've built an AI agent that can research any company and generate personalized sales outreach in seconds. 
> It uses 3 sponsor APIs: Yutori for research, AgentQL for web scraping, and Freepik for hero images."

**Minute 2: Live Demo**
> [Open Retool Agent]
> 
> **Type:** "Generate an account brief for Notion targeting Head of Sales"
> 
> [Wait ~45 seconds while agent works]
>
> "The agent is orchestrating all three APIs behind the scenes..."

**Minute 3: Results**
> [Agent displays results]
>
> "Look at this output:
> - Company intelligence from real web research
> - Evidence scraped from their actual website
> - 3-email sequence ready to personalize  
> - LinkedIn DM and call opener
> - Objection handling with rebuttals
> - All sources cited"
>
> **Follow-up prompt:** "Show me just the first email"
>
> [Agent extracts and shows just email 1]
>
> "The agent understands the data structure and can answer follow-up questions naturally."

---

Built for Agentic Orchestration Hack 2025 🚀
