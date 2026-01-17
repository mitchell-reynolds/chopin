# Understanding Yutori API Polling

## What is Polling?

Yutori's Research API is **asynchronous** - it works like this:

1. **Step 1:** You send a research request → Get back a `task_id`
2. **Step 2:** The task starts processing (takes 1-5 minutes)
3. **Step 3:** You repeatedly check "Is it done yet?" by calling GET with the task_id
4. **Step 4:** When status = "completed", you get the results

This is called **polling** - repeatedly checking if something is ready.

## Why It Takes So Long

Yutori's research API:
- Searches the web for information
- Reads multiple pages
- Analyzes content
- Generates structured output

**Typical time:** 1-3 minutes
**Max time we wait:** 5 minutes (300 seconds)

## Current Polling Settings

```javascript
POLL_INTERVAL = 5000        // Check every 5 seconds
MAX_POLL_ATTEMPTS = 60      // Try 60 times max
Total wait time = 60 × 5s = 300 seconds (5 minutes)
```

## What You'll See in Logs

```
[Yutori] Task created: task-abc123. Polling for results...
[Yutori] This may take 1-3 minutes for research to complete.
[Yutori] Poll 1/60 (5s elapsed): pending
[Yutori] Poll 2/60 (10s elapsed): pending
[Yutori] Poll 3/60 (15s elapsed): processing
...
[Yutori] Poll 25/60 (125s elapsed): processing
[Yutori] Poll 26/60 (130s elapsed): completed
[Yutori] ✓ Research completed
```

## If You Hit Max Attempts

**Error message:**
```
Yutori task timeout - research did not complete within 300 seconds (60 polling attempts). 
The task may still be processing on Yutori's end.
```

**What this means:**
- Your research task took longer than 5 minutes
- The task might still complete on Yutori's side, but we stopped waiting
- This is rare but can happen with complex queries

**Solutions:**

### Option 1: Increase Polling Limit (if needed)
Edit `src/clients/yutoriClient.js`:
```javascript
const MAX_POLL_ATTEMPTS = 120;  // 10 minutes (120 × 5s = 600s)
```

### Option 2: Simplify the Query
The prompt in `src/prompts/yutoriPrompt.js` is very detailed. You could:
- Reduce the required output fields
- Ask for fewer examples
- Simplify the instructions

### Option 3: Use Mock Data for Testing
If Yutori keeps timing out, the server automatically falls back to mock data when:
```javascript
if (USE_YUTORI) {
  // Try Yutori
} else {
  // Use mock data
  briefData = mockResponse.data;
}
```

## Troubleshooting Slow Research

### 1. Check Task Status Manually

If it times out, you can manually check if it completed:
```bash
curl -X GET https://api.yutori.com/v1/research/tasks/YOUR_TASK_ID \
  -H "x-api-key: YOUR_API_KEY"
```

Look for `"status": "completed"` in the response.

### 2. Check Yutori Dashboard

Go to https://scouts.yutori.com and see if your task shows up in the history.

### 3. Test with a Simpler Query

Try a basic test:
```bash
curl -X POST https://api.yutori.com/v1/research/tasks \
  -H "x-api-key: YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"What is Stripe?","max_results":3}'
```

Then poll for results:
```bash
curl -X GET https://api.yutori.com/v1/research/tasks/TASK_ID \
  -H "x-api-key: YOUR_KEY"
```

If this simple query also times out, there might be an issue with:
- Your API key permissions
- Yutori's service (check their status page)
- Your network connection

## For Hackathon Demo

**Best practices:**

1. **Pre-generate results** before your demo
   - Run the API once, save the output
   - Use that as your demo data if live API is slow

2. **Use the graceful fallback**
   - If Yutori fails, server returns mock data
   - You can still demo the full flow

3. **Set expectations**
   - In Retool Agent instructions, mention "This takes 1-3 minutes"
   - Shows patience, not a bug

4. **Test beforehand**
   - Run `./test-api.sh stripe.com` 30 minutes before demo
   - Verify it completes successfully
   - If not, use mock data mode

## Current Status

✅ **Polling now allows up to 5 minutes**
✅ **Shows progress every 5 seconds**
✅ **Displays elapsed time**
✅ **Clear error message if timeout occurs**

If you're consistently hitting the 5-minute limit, there may be an issue with:
- The complexity of your prompt
- Yutori's API performance
- Your API key's plan limits

Try the diagnostic steps above to isolate the issue.
