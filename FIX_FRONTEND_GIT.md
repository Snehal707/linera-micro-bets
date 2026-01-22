# Fix: Frontend Not in Git Repository

## Problem
Vercel can't find `/vercel/path0/frontend/package.json` because the `frontend` folder isn't committed to git.

## Solution: Add Frontend to Git

### Step 1: Check if Frontend is in Git

Run this in WSL terminal:

```bash
cd "/mnt/c/Users/ASUS/New folder (2)/linera-micro-bets"
git ls-files frontend/ | head -10
```

If this shows files, frontend is in git. If it's empty, we need to add it.

---

### Step 2: Add Frontend to Git

Run these commands in WSL:

```bash
cd "/mnt/c/Users/ASUS/New folder (2)/linera-micro-bets"

# Check git status
git status

# Add frontend directory
git add frontend/

# Check what will be committed
git status

# Commit
git commit -m "Add frontend directory to repository"

# Push to GitHub
git push
```

---

### Step 3: Check .gitignore

Make sure `frontend` isn't being ignored:

```bash
# Check if frontend is in .gitignore
grep -i "^frontend" .gitignore

# If it shows "frontend", remove it from .gitignore
```

If `frontend` is in `.gitignore`, remove that line.

---

### Step 4: Verify Frontend is Committed

```bash
# Check if frontend files are tracked
git ls-files frontend/package.json

# Should show: frontend/package.json
```

---

### Step 5: Redeploy in Vercel

After pushing to GitHub:

1. Go to Vercel dashboard
2. Go to your project
3. Go to "Deployments" tab
4. Click "Redeploy" on the latest deployment
5. Or Vercel will auto-redeploy when it detects the push

---

## Quick Fix Commands

Copy and paste this entire block in WSL:

```bash
cd "/mnt/c/Users/ASUS/New folder (2)/linera-micro-bets"
git add frontend/
git commit -m "Add frontend directory to repository"
git push
```

Then redeploy in Vercel!

---

## Why This Happened

The `frontend` folder might have:
- Its own `.git` folder (nested repository)
- Been added to `.gitignore`
- Never been committed to git

Adding it now will fix the issue! ✅
