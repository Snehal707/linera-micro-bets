# Deploy Frontend to Vercel - Step by Step Guide

## Prerequisites

- ✅ GitHub account (you already have: Snehal707)
- ✅ Vercel account (free tier works)
- ✅ Your code pushed to GitHub (already done: https://github.com/Snehal707/linera-micro-bets)

---

## Step 1: Create Vercel Account

1. Go to: https://vercel.com
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account
5. Complete the signup process

---

## Step 2: Import Your Project

1. After logging in, you'll see the Vercel dashboard
2. Click **"Add New..."** → **"Project"**
3. You'll see a list of your GitHub repositories
4. Find **"linera-micro-bets"** and click **"Import"**

---

## Step 3: Configure Project Settings

### Basic Configuration:

1. **Project Name:** `linera-micro-bets` (or `stormcast-linera`)
2. **Framework Preset:** Vercel will auto-detect **Next.js** ✅
3. **Root Directory:** 
   - Click **"Edit"** next to Root Directory
   - Change to: `frontend`
   - (This tells Vercel where your Next.js app is)

### Build Settings:

- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

---

## Step 4: Add Environment Variables

Before deploying, you need to add your environment variables:

### Click "Environment Variables" section

Add these variables (one by one):

1. **`NEXT_PUBLIC_LINERA_NETWORK`**
   - Value: `local`
   - (Or `testnet` if using testnet)

2. **`NEXT_PUBLIC_MICRO_BET_APP_ID`**
   - Value: `8cb24e78ab54941d0667f9eeb3b33c4974a8aa0f643521bb1ebe7afa5505e234`
   - (Your micro-bet application ID)

3. **`NEXT_PUBLIC_FUNGIBLE_APP_ID`**
   - Value: `da9f76af8a028fc389c7b9374859662e7d278d2843d0f9cd80ded71669fbf9f3`
   - (Your fungible token application ID)

**Important:** 
- For Next.js, all client-side variables must use `NEXT_PUBLIC_` prefix
- These variables are exposed to the browser
- Server-side variables (without `NEXT_PUBLIC_`) are not accessible in the browser

---

## Step 5: Deploy

1. Click **"Deploy"** button
2. Wait for the build to complete (2-5 minutes)
3. You'll see build logs in real-time
4. Once done, you'll get a URL like: `https://linera-micro-bets.vercel.app`

---

## Step 6: Update Environment Variables for Production

**Important:** Your local Linera service (`localhost:12345`) won't work from Vercel.

### Option A: Use Local Network (For Demo Only)

If you want to demo locally:
1. Keep your Linera service running on your machine
2. Use a tunneling service like **ngrok** or **localtunnel**:
   ```bash
   # Install ngrok
   npm install -g ngrok
   
   # Create tunnel to your local Linera service
   ngrok http 12345
   ```
3. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)
4. Update `NEXT_PUBLIC_NODE_URL` in Vercel to this ngrok URL

### Option B: Deploy Linera Service (Recommended for Production)

For a real production setup, you'd need to:
1. Deploy Linera service to a VPS/cloud
2. Update `NEXT_PUBLIC_NODE_URL` to point to that service

### Option C: Demo Mode (Simplest for Submission)

For the Buildathon submission, you can:
1. Deploy the frontend to Vercel
2. Note in the submission that it connects to a local Linera network
3. Or create a demo mode that works without backend

---

## Step 7: Get Your Live Demo URL

After deployment:
1. Your site will be live at: `https://linera-micro-bets.vercel.app`
2. Copy this URL
3. Use it in the submission form's "Live demo" field

---

## Troubleshooting

### Build Fails

**Error: "Cannot find module"**
- Make sure Root Directory is set to `frontend`
- Check that `package.json` exists in the frontend folder

**Error: "Environment variable not found"**
- Make sure all `NEXT_PUBLIC_` variables are set
- Check variable names match your code

### Site Deploys But Doesn't Work

**CORS Errors:**
- Your Linera service needs to allow requests from Vercel domain
- Update CORS settings in your Linera service

**Connection Errors:**
- `localhost:12345` won't work from Vercel
- Use ngrok or deploy Linera service publicly

**Environment Variables Not Loading:**
- Make sure they start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding new variables

---

## Quick Command Reference

### Update Environment Variables in Vercel:

1. Go to Project → Settings → Environment Variables
2. Add/Edit variables
3. Redeploy (Vercel will auto-redeploy or click "Redeploy")

### Redeploy:

1. Go to Deployments tab
2. Click "..." on latest deployment
3. Click "Redeploy"

---

## Alternative: Deploy with Vercel CLI

If you prefer command line:

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend directory
cd frontend

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name? linera-micro-bets
# - Directory? ./
# - Override settings? No
```

---

## For Buildathon Submission

Since you're submitting to Linera Buildathon:

1. **Deploy frontend to Vercel** (follow steps above)
2. **Get the URL:** `https://linera-micro-bets.vercel.app`
3. **In submission form, add:**
   - Live demo URL: `https://linera-micro-bets.vercel.app`
   - Note: "Frontend connects to local Linera network. For full demo, Linera service must be running locally."

**Or create a demo mode:**
- Add a demo mode that works without backend
- Shows UI with sample data
- Mention in submission that full functionality requires local Linera network

---

## Next Steps After Deployment

1. ✅ Test the deployed site
2. ✅ Check all pages load correctly
3. ✅ Verify environment variables are set
4. ✅ Copy the Vercel URL
5. ✅ Add to submission form

---

## Summary

1. Sign up at vercel.com (with GitHub)
2. Import `linera-micro-bets` repository
3. Set Root Directory to `frontend`
4. Add environment variables (with `NEXT_PUBLIC_` prefix)
5. Deploy
6. Get your URL: `https://linera-micro-bets.vercel.app`
7. Use in submission form!

Good luck! 🚀
