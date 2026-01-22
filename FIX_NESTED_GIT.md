# Fix: Frontend Has Nested .git Folder

## Problem
Even though you pushed `frontend/`, Vercel still can't find it. This usually means `frontend` has its own `.git` folder (nested repository).

## Solution: Remove Nested .git and Re-add

### Step 1: Check if Frontend Has .git Folder

Run in WSL:

```bash
cd "/mnt/c/Users/ASUS/New folder (2)/linera-micro-bets"
ls -la frontend/ | grep .git
```

If you see `.git`, that's the problem!

---

### Step 2: Remove Nested .git Folder

```bash
# Remove the nested .git folder
rm -rf frontend/.git

# Verify it's gone
ls -la frontend/ | grep .git
# Should show nothing
```

---

### Step 3: Remove Frontend from Git Index

```bash
# Remove from git index
git rm -r --cached frontend/

# Verify
git status
```

---

### Step 4: Re-add Frontend Properly

```bash
# Add frontend without .git
git add frontend/

# Verify files are tracked
git ls-files frontend/package.json
# Should show: frontend/package.json

# Check status
git status
```

---

### Step 5: Commit and Push

```bash
git commit -m "Fix: Remove nested .git from frontend and re-add properly"
git push
```

---

### Step 6: Redeploy in Vercel

1. Go to Vercel dashboard
2. Go to Deployments
3. Click "Redeploy"

---

## Quick Fix (All Commands at Once)

Copy and paste this entire block:

```bash
cd "/mnt/c/Users/ASUS/New folder (2)/linera-micro-bets"

# Remove nested .git
rm -rf frontend/.git

# Remove from git index
git rm -r --cached frontend/

# Re-add properly
git add frontend/

# Verify
git ls-files frontend/package.json

# Commit and push
git commit -m "Fix: Remove nested .git from frontend and re-add properly"
git push
```

Then redeploy in Vercel!

---

## Why This Happens

If `frontend` was initialized as its own git repository (has `.git` folder), Git treats it as a submodule, not regular files. Vercel can't access nested repositories, so it appears empty.

Removing the `.git` folder and re-adding makes it regular files that Vercel can access! ✅
