#!/usr/bin/env node

/**
 * Diagnostic script to check environment variable loading
 * Run with: node check-env.js
 */

require('dotenv').config();

console.log('\n🔍 Environment Variable Diagnostic\n');
console.log('═'.repeat(50));

// Check all API keys
const keys = [
  'YUTORI_API_KEY',
  'HACKATHON_API_KEY',
  'MINO_API_KEY',
  'FREEPIK_API_KEY',
  'CLAUDE_API_KEY'
];

keys.forEach(keyName => {
  const value = process.env[keyName];
  
  console.log(`\n${keyName}:`);
  console.log(`  ✓ Defined: ${!!value}`);
  console.log(`  ✓ Length: ${value?.length || 0}`);
  console.log(`  ✓ Starts with: ${value?.substring(0, 10) || 'N/A'}...`);
  console.log(`  ✓ Full value: ${value || 'UNDEFINED'}`);
});

console.log('\n' + '═'.repeat(50));
console.log('\n🧪 Testing Yutori API Key Loading:\n');

const YUTORI_API_KEY = process.env.YUTORI_API_KEY;
console.log('Loaded as constant:', YUTORI_API_KEY?.substring(0, 10) + '...');
console.log('Direct from process.env:', process.env.YUTORI_API_KEY?.substring(0, 10) + '...');
console.log('Are they equal?', YUTORI_API_KEY === process.env.YUTORI_API_KEY);

console.log('\n' + '═'.repeat(50));
console.log('\n📝 Recommendations:\n');

if (!process.env.YUTORI_API_KEY) {
  console.log('❌ YUTORI_API_KEY is not set!');
  console.log('   Check that .env file exists in:', process.cwd());
  console.log('   Check that .env file has: YUTORI_API_KEY="your_key_here"');
} else if (process.env.YUTORI_API_KEY.includes('"') || process.env.YUTORI_API_KEY.includes("'")) {
  console.log('⚠️  YUTORI_API_KEY contains quotes!');
  console.log('   Remove quotes from .env file');
  console.log('   Should be: YUTORI_API_KEY=yt_...');
  console.log('   NOT: YUTORI_API_KEY="yt_..."');
} else if (!process.env.YUTORI_API_KEY.startsWith('yt_')) {
  console.log('⚠️  YUTORI_API_KEY doesn\'t start with "yt_"');
  console.log('   Are you sure this is a valid Yutori API key?');
} else {
  console.log('✅ YUTORI_API_KEY looks valid!');
  console.log('   Key starts with: ' + process.env.YUTORI_API_KEY.substring(0, 10));
  console.log('\n   If you\'re still getting 403 errors:');
  console.log('   1. Verify you have a paid Yutori plan');
  console.log('   2. Check the key has access to "research tasks" (not just scouts)');
  console.log('   3. Try regenerating the key at https://scouts.yutori.com/settings');
}

console.log('\n');
