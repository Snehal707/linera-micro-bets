# Fix: Frontend Directory Not Showing in Vercel

## Quick Solution

Since `frontend` isn't showing in the directory selector:

### Step 1: Select Root Directory for Now

1. **Select:** `linera-micro-bets` (the root directory)
2. **Click:** "Continue"
3. **Complete the deployment** (it will fail, but that's okay)

### Step 2: Change Root Directory After Project Creation

1. After the project is created, go to **Project Settings**
2. Click on **"General"** tab
3. Scroll to **"Root Directory"** section
4. Click **"Edit"**
5. Type: `frontend`
6. Click **"Save"**

### Step 3: Redeploy

1. Go to **"Deployments"** tab
2. Click **"Redeploy"** on the latest deployment
3. Or trigger a new deployment

---

## Alternative: Check if Frontend is in Git

The `frontend` directory might not be committed to git. Let's verify:

### Check in WSL Terminal:

```bash
cd "/mnt/c/Users/ASUS/New folder (2)/linera-micro-bets"
git ls-files frontend/ | head -10
```

If this shows files, `frontend` is in git. If it's empty, we need to add it.

### If Frontend is Not in Git:

```bash
# Add frontend directory
git add frontend/

# Commit
git commit -m "Add frontend directory"

# Push to GitHub
git push
```

Then try importing to Vercel again.

---

## Why This Happens

Vercel only shows directories that:
1. Are committed to git
2. Contain recognizable project files (package.json, etc.)
3. Are not nested git repositories

If `frontend` has its own `.git` folder, Vercel won't show it as a selectable directory.

---

## Recommended Approach

**For now:**
1. Select `linera-micro-bets` (root)
2. Complete the deployment setup
3. Change Root Directory to `frontend` in Settings
4. Redeploy

This will work! ✅
