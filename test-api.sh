#!/bin/bash

# Test script for Account Brief Generator API
# Usage: ./test-api.sh [company_domain]

DOMAIN=${1:-"stripe.com"}
API_URL=${2:-"http://localhost:3000"}

echo "🧪 Testing Account Brief Generator API"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Target: $DOMAIN"
echo "API URL: $API_URL"
echo ""

# Test 1: Health check
echo "1️⃣  Testing health endpoint..."
curl -s "$API_URL/health" | jq '.'
echo ""

# Test 2: Generate brief
echo "2️⃣  Generating account brief for $DOMAIN..."
echo "(This may take 30-60 seconds depending on API responses)"
echo ""

curl -s -X POST "$API_URL/generate" \
  -H "Content-Type: application/json" \
  -d "{
    \"company_domain\": \"$DOMAIN\",
    \"company_name\": \"$(echo $DOMAIN | cut -d'.' -f1 | sed 's/^./\U&/')\",
    \"persona_target\": \"VP of Sales\",
    \"offer_type\": \"Product Demo\"
  }" | jq '.'

echo ""
echo "✅ Test complete!"
echo ""
echo "💡 Try with different companies:"
echo "   ./test-api.sh notion.so"
echo "   ./test-api.sh retool.com"
echo "   ./test-api.sh figma.com"
