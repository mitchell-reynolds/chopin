/**
 * Simplified Yutori Research API Prompt
 * For Corgi AI (startup insurance) pitching to startup founders/COOs
 */

function buildYutoriPrompt(companyDomain, companyName, personaTarget, offerType, evidence = null) {
  // Keep prompt SHORT for faster responses
  const prompt = `Research ${companyName || companyDomain} and create a sales brief for Corgi AI (startup insurance product).

Target persona: ${personaTarget || 'Founder/CEO/COO'}
Offer: ${offerType || 'Startup Insurance Demo'}

Return JSON only (no markdown):
{
  "company": {
    "name": "string",
    "domain": "string", 
    "summary": "2 sentences max",
    "industry": "string",
    "stage": "Seed/Series A/Series B/etc"
  },
  "pain_points": ["3 insurance-related pains for startups"],
  "hooks": ["2 value props for Corgi AI insurance"],
  "outreach": {
    "email_subject": "string",
    "email_body": "50 words max cold email",
    "linkedin_dm": "30 words max"
  },
  "sources": ["2-3 URLs used"]
}`;

  return prompt;
}

module.exports = { buildYutoriPrompt };
