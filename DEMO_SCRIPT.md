# 🎬 3-Minute Demo Script

**Total Time:** 3 minutes  
**Setup:** Have terminal + Retool Agent open side-by-side

---

## ⏱️ Timing Breakdown

| Section | Time | What to Show |
|---------|------|--------------|
| Intro | 0:00-0:45 | Explain Corgi AI use case |
| Show Results | 0:45-2:00 | Pre-saved Freepik brief |
| Tech Stack | 2:00-2:45 | Quick API explanation |
| Wrap Up | 2:45-3:00 | Hackathon tracks covered |

---

## 📝 Script

### Minute 1: Introduction (0:00-0:45)

> "This is **Chopin**, an AI research agent I built for **Corgi AI**, a startup insurance company.
>
> **The problem:** Corgi's sales team needs to research target startups before outreach, which takes hours per company.
>
> **The solution:** Chopin uses **Yutori's research API** to automatically research any startup and generate personalized insurance sales briefs in minutes.
>
> Let me show you what it produces."

### Minute 2: Show Pre-Saved Results (0:45-2:00)

> "Here's a real research brief for **Freepik** - one of our target accounts."

**Show this output (copy from below):**

```json
{
  "company": {
    "name": "Freepik Company S.L.U.",
    "summary": "AI-powered creative platform providing graphics, photos, and design tools to 100M+ monthly users.",
    "industry": "Design/Media",
    "stage": "PE-backed, scale-stage"
  },
  "pain_points": [
    "AI-related liability from generative image features that could produce copyrighted or problematic content",
    "Cyber exposure due to massive user base storing designs and account data",
    "Technology E&O risk from API and software tools used by enterprise customers"
  ],
  "hooks": [
    "Purpose-built coverage for AI-driven products - unlike traditional insurers who don't understand AI risk",
    "Fast, modular policies that adapt as new creative AI features ship"
  ],
  "outreach": {
    "email_subject": "Insurance fit for Freepik's AI platform",
    "email_body": "Joaquín—Freepik's AI-powered platform is scaling quickly, and with 100M users, liability exposure grows too. Corgi specializes in insuring AI companies—we can map coverage to your generative features, cyber exposure, and E&O risks. Quick call this week?",
    "linkedin_dm": "Joaquín—Corgi maps insurance to AI, E&O, and cyber risks for creative platforms like Freepik. Happy to share how we've helped similar companies. Quick chat?"
  },
  "sources": [
    "https://www.freepik.com/company/about-us",
    "https://www.linkedin.com/company/freepik"
  ]
}
```

**Call out key points:**
> - "Notice the **pain points** are specific to Freepik - AI liability, cyber exposure, E&O"
> - "The **email** is personalized to their CEO Joaquín and mentions their 100M users"
> - "These aren't generic templates - this is **real research** from Yutori's API"

### Minute 3: Technical & Wrap-up (2:00-3:00)

> "**How it works:**
> - Express server calls **Yutori** for deep web research (takes 3-5 min per company)
> - Optionally generates a hero image via **Freepik** API
> - Serves results through a **Retool Agent** for conversational UI
> 
> **The entire codebase was built with Cline** - AI-assisted development in VS Code.
>
> **Hackathon tracks covered:** Yutori, Freepik, Retool, and Cline.
>
> Thank you!"

---

## 📊 Pre-Saved Results (Reference)

### Freepik Brief
```json
{
  "status": "success",
  "customer": "Corgi AI",
  "target": "Freepik",
  "data": {
    "company": {
      "name": "Freepik Company S.L.U.",
      "summary": "AI-powered creative platform providing graphics, photos, and design tools to 100M+ monthly users.",
      "industry": "Design/Media",
      "stage": "PE-backed, scale-stage"
    },
    "pain_points": [
      "AI-related liability from generative image features that could produce copyrighted or problematic content",
      "Cyber exposure due to massive user base storing designs and account data",
      "Technology E&O risk from API and software tools used by enterprise customers"
    ],
    "hooks": [
      "Purpose-built coverage for AI-driven products - unlike traditional insurers who don't understand AI risk",
      "Fast, modular policies that adapt as new creative AI features ship"
    ],
    "outreach": {
      "email_subject": "Insurance fit for Freepik's AI platform",
      "email_body": "Joaquín—Freepik's AI-powered platform is scaling quickly, and with 100M users, liability exposure grows too. Corgi specializes in insuring AI companies—we can map coverage to your generative features, cyber exposure, and E&O risks. Quick call this week?",
      "linkedin_dm": "Joaquín—Corgi maps insurance to AI, E&O, and cyber risks for creative platforms like Freepik. Happy to share how we've helped similar companies. Quick chat?"
    },
    "sources": [
      "https://www.freepik.com/company/about-us",
      "https://www.linkedin.com/company/freepik"
    ]
  },
  "meta": {
    "duration_seconds": 294,
    "yutori_used": true,
    "freepik_used": false
  }
}
```

### Retool Brief (Backup)
```json
{
  "status": "success",
  "customer": "Corgi AI", 
  "target": "Retool",
  "data": {
    "company": {
      "name": "Retool Inc.",
      "summary": "Low-code platform for building internal tools, serving thousands of enterprises including Fortune 500 companies.",
      "industry": "Developer Tools",
      "stage": "Series D, $3.2B valuation"
    },
    "pain_points": [
      "Data security exposure - Retool apps often connect to sensitive internal databases and APIs",
      "Growing team liability as they scale from 200 to 500+ employees",
      "Technology E&O risk from enterprise customers relying on Retool for critical business operations"
    ],
    "hooks": [
      "Insurance that understands developer tools and data security requirements",
      "Fast coverage for high-growth companies without the enterprise paperwork"
    ],
    "outreach": {
      "email_subject": "Insurance built for Retool's growth",
      "email_body": "David—As Retool scales past $3B valuation and deeper enterprise adoption, insurance requirements get complex. Corgi helps dev tool companies like yours get D&O, E&O, and cyber coverage without the typical friction. 15 min call?",
      "linkedin_dm": "David—Corgi insures dev tools companies at scale. Happy to share how we've streamlined coverage for similar high-growth teams. Quick chat?"
    },
    "sources": [
      "https://retool.com",
      "https://www.linkedin.com/company/retool"
    ]
  }
}
```

---

## 🎯 Demo Commands (If Needed)

### Show Server Health
```bash
curl http://localhost:3000/health | jq
```

### Show Target Companies
```bash
curl http://localhost:3000/targets | jq
```

### Live Generate (Only if you have 5+ min!)
```bash
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{"company_name": "Yutori", "company_domain": "yutori.com"}' | jq
```

---

## ✅ Pre-Demo Checklist

- [ ] Server running (`npm start`)
- [ ] This script open on second monitor
- [ ] Pre-saved JSON ready to show
- [ ] Retool Agent tab open (optional)
- [ ] Timer visible

---

**Good luck! 🍀**
