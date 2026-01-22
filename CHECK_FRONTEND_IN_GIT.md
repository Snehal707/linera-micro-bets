# Check if Frontend is Actually in Git

## Step 1: Verify Frontend Files are Tracked

Run this in WSL to check if frontend is actually in git:

```bash
cd "/mnt/c/Users/ASUS/New folder (2)/linera-micro-bets"

# Check if frontend/package.json is tracked
git ls-files frontend/package.json

# Check all frontend files
git ls-files frontend/ | head -20

# Check if frontend has .git folder
ls -la frontend/ | grep "\.git"
```

---

## Step 2: If Frontend Has .git Folder

If you see `.git` in the output, run:

```bash
# Remove nested .git
rm -rf frontend/.git

# Remove from git cache
git rm -r --cached frontend/

# Re-add
git add frontend/

# Verify
git ls-files frontend/package.json
```

---

## Step 3: If Frontend Files Are NOT Tracked

If `git ls-files frontend/package.json` shows nothing, then frontend isn't in git:

```bash
# Check what's in frontend
ls frontend/

# Add frontend
git add frontend/

# Check status
git status

# Commit
git commit -m "Add frontend directory to repository"

# Push
git push
```

---

## Step 4: Check Latest Commit

After pushing, verify the new commit:

```bash
git log --oneline -1
```

The commit hash should be different from `4c90df0`.

---

## Step 5: Force Vercel to Use Latest Commit

After pushing:
1. Go to Vercel
2. Go to Settings → Git
3. Click "Redeploy" or trigger a new deployment
4. Make sure it uses the latest commit (not `4c90df0`)

---

Run the check commands first to see what's actually happening!
