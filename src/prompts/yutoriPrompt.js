/**
 * Yutori Research API Prompt
 * For Corgi AI (startup insurance) pitching to startup founders/COOs
 * 
 * Now includes evidence from AgentQL web scraping for better personalization
 */

function buildYutoriPrompt(companyDomain, companyName, personaTarget, offerType, evidence = null) {
  // Base prompt
  let prompt = `Research ${companyName || companyDomain} and create a sales brief for Corgi AI (startup insurance product).

Target persona: ${personaTarget || 'Founder/CEO/COO'}
Offer: ${offerType || 'Startup Insurance Demo'}
`;

  // Add evidence from AgentQL if available
  if (evidence) {
    prompt += `\n--- EVIDENCE FROM COMPANY WEBSITE ---\n`;
    
    if (evidence.homepage_insights && Object.keys(evidence.homepage_insights).length > 0) {
      prompt += `\nHomepage insights:\n${JSON.stringify(evidence.homepage_insights, null, 2)}\n`;
    }
    
    if (evidence.pricing_insights) {
      prompt += `\nPricing insights:\n${JSON.stringify(evidence.pricing_insights, null, 2)}\n`;
    }
    
    if (evidence.careers_insights) {
      prompt += `\nCareers/hiring insights:\n${JSON.stringify(evidence.careers_insights, null, 2)}\n`;
    }
    
    if (evidence.blog_insights) {
      prompt += `\nRecent blog/news:\n${JSON.stringify(evidence.blog_insights, null, 2)}\n`;
    }
    
    prompt += `--- END EVIDENCE ---\n\n`;
    prompt += `Use the above evidence to make the research more specific and personalized.\n\n`;
  }

  // Output format instructions
  prompt += `Return JSON only (no markdown):
{
  "company": {
    "name": "string",
    "domain": "string", 
    "summary": "2-3 sentences about what they do",
    "industry": "string",
    "stage": "Seed/Series A/Series B/Growth/etc"
  },
  "pain_points": ["3 insurance-related pains specific to this company"],
  "hooks": ["2-3 value props for Corgi AI insurance tailored to this company"],
  "outreach": {
    "email_subject": "string",
    "email_body": "50-75 words cold email, personalized to company",
    "linkedin_dm": "30-40 words"
  },
  "sources": ["2-3 URLs you used for research"]
}`;

  return prompt;
}

module.exports = { buildYutoriPrompt };
