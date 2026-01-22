# Vercel Workaround: Frontend Not in Dropdown

## Problem
Vercel dropdown only shows `micro-bet-contract` and `src`, but not `frontend`.

## Solution: Use vercel.json Configuration File

I've created a `vercel.json` file that tells Vercel where your Next.js app is located.

---

## Step 1: Select Root Directory

In the modal:
1. **Select:** `linera-micro-bets` (the root)
2. **Click:** "Continue"

---

## Step 2: Commit and Push vercel.json

The `vercel.json` file I created needs to be in your GitHub repository.

### In WSL Terminal:

```bash
cd "/mnt/c/Users/ASUS/New folder (2)/linera-micro-bets"

# Add vercel.json
git add vercel.json

# Commit
git commit -m "Add vercel.json for Vercel deployment"

# Push to GitHub
git push
```

---

## Step 3: Continue with Vercel Setup

1. **Project Name:** Change to `linera_micro_bets`
2. **Framework:** Should be `Next.js`
3. **Root Directory:** Keep as `./` (root) - the vercel.json will handle it
4. **Environment Variables:** Add all 3
5. **Click:** "Deploy"

---

## What vercel.json Does

The `vercel.json` file tells Vercel:
- Build command: `cd frontend && npm install && npm run build`
- Output directory: `frontend/.next`
- Install command: `cd frontend && npm install`
- Framework: `nextjs`

This way, even though Root Directory is `./`, Vercel will know to look in the `frontend` folder.

---

## Alternative: Change After Deployment

If you don't want to use vercel.json:

1. Select `linera-micro-bets` (root)
2. Complete deployment (it will fail)
3. Go to Settings → General → Root Directory
4. Type `frontend` manually
5. Redeploy

---

## Quick Steps

1. **In Vercel:** Select `linera-micro-bets` → Continue
2. **In Terminal:** Run the git commands above to push vercel.json
3. **In Vercel:** Complete setup and deploy

The vercel.json file will make it work! ✅
