# Vercel Import - Step by Step (CRITICAL: Root Directory!)

## ⚠️ IMPORTANT: Root Directory MUST be `frontend` or it will FAIL!

---

## Step 1: Click Import

1. Find `linera-micro-bets` in the list
2. Click **"Import"** button

---

## Step 2: Configure Project

### A. Project Name
- Change from: `linera-micro-bets`
- To: `linera_micro_bets` (use underscores!)

### B. Framework Preset
- Should auto-detect: **Next.js** ✅
- If not, select "Next.js" from dropdown

### C. Root Directory ⚠️ CRITICAL STEP!

**This is the MOST IMPORTANT step!**

1. Look for **"Root Directory"** section
2. You'll see: `./` (this is WRONG!)
3. Click **"Edit"** button next to it
4. **A text input field will appear**
5. **Type:** `frontend` (type it manually!)
6. Press Enter or click outside

**VERIFY:** The Root Directory should now show: `frontend`

**If you don't do this, the deployment WILL FAIL!**

### D. Environment Variables

Click to expand "Environment Variables" section, then add:

**Variable 1:**
- Key: `NEXT_PUBLIC_LINERA_NETWORK`
- Value: `local`
- Click "Add" or press Enter

**Variable 2:**
- Key: `NEXT_PUBLIC_MICRO_BET_APP_ID`
- Value: `8cb24e78ab54941d0667f9eeb3b33c4974a8aa0f643521bb1ebe7afa5505e234`
- Click "Add" or press Enter

**Variable 3:**
- Key: `NEXT_PUBLIC_FUNGIBLE_APP_ID`
- Value: `da9f76af8a028fc389c7b9374859662e7d278d2843d0f9cd80ded71669fbf9f3`
- Click "Add" or press Enter

---

## Step 3: Before Clicking Deploy - CHECKLIST ✅

**Before you click "Deploy", verify:**

- [ ] Project Name: `linera_micro_bets` (with underscores)
- [ ] Framework: `Next.js`
- [ ] **Root Directory: `frontend`** ⚠️ (MUST BE THIS!)
- [ ] Environment Variables: All 3 added
- [ ] Ready to deploy

---

## Step 4: Deploy

1. Click **"Deploy"** button
2. Wait for build to complete (2-5 minutes)
3. You'll get a URL like: `https://linera_micro_bets.vercel.app`

---

## If Root Directory Still Shows `./`

**If after clicking "Edit" you can't type `frontend`:**

1. **Option A:** Select root (`./`) for now, deploy, then:
   - Go to Settings → General → Root Directory
   - Change to `frontend`
   - Redeploy

2. **Option B:** Create `vercel.json` file in your repo (I can help with this)

---

## Summary

**The ONE thing that will make it work:**
- Root Directory = `frontend` ✅

**The ONE thing that will make it fail:**
- Root Directory = `./` ❌

**Make sure Root Directory is `frontend` before deploying!**
