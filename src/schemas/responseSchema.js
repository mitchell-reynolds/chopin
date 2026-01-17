/**
 * Simplified Response schema for Corgi AI Demo
 * Account research for startup insurance pitches
 */

// Pre-built target companies for the demo
const TARGET_COMPANIES = [
  { domain: 'yutori.com', name: 'Yutori', industry: 'AI/Research', persona: 'Founder' },
  { domain: 'retool.com', name: 'Retool', industry: 'Developer Tools', persona: 'CEO/COO' },
  { domain: 'agentql.com', name: 'TinyFish/AgentQL', industry: 'AI/Web Scraping', persona: 'Founder' },
  { domain: 'cline.ai', name: 'Cline AI', industry: 'AI Coding', persona: 'CEO' },
  { domain: 'freepik.com', name: 'Freepik', industry: 'Design/Media', persona: 'COO' }
];

// Mock response for fast demo fallback
const mockResponse = {
  run_id: 'mock-' + Date.now(),
  timestamp: new Date().toISOString(),
  status: 'success',
  data: {
    company: {
      name: 'Yutori',
      domain: 'yutori.com',
      summary: 'AI-powered web research and automation platform for enterprises.',
      industry: 'AI/Research',
      stage: 'Series A'
    },
    pain_points: [
      'Growing team = more liability exposure as startup scales',
      'Traditional insurance quotes take weeks and are designed for big corps',
      'Need D&O coverage before next funding round closes'
    ],
    hooks: [
      'Get startup insurance quote in 10 minutes, not 10 weeks',
      'Coverage designed for AI companies and their unique risks'
    ],
    outreach: {
      email_subject: 'Quick insurance question for Yutori',
      email_body: 'Hi - noticed Yutori is scaling fast. Before your next round, you\'ll need D&O and E&O coverage. We help AI startups get insured in days, not months. Quick call this week?',
      linkedin_dm: 'Congrats on Yutori\'s growth! Happy to share how AI startups are handling insurance before their next round.'
    },
    hero_image_url: null,
    sources: [
      'https://yutori.com',
      'https://www.linkedin.com/company/yutori'
    ]
  },
  meta: {
    customer: 'Corgi AI',
    use_case: 'Startup Insurance',
    target_persona: 'Founder/CEO/COO'
  },
  error: null
};

module.exports = {
  TARGET_COMPANIES,
  mockResponse
};
