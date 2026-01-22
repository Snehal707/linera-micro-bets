# Fix Authentication Error - Quick Solution

## The Problem

You're seeing:
- ❌ "Password authentication is not supported"
- ❌ "Permission denied" (403 error)

**Reason:** GitHub requires a Personal Access Token, not your password.

---

## Quick Fix (3 Steps)

### Step 1: Create Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Fill in:
   - **Note:** `Linera Micro-Bets`
   - **Expiration:** 90 days (or your choice)
   - **Scopes:** Check ✅ **`repo`**
4. Click **"Generate token"**
5. **COPY THE TOKEN** (starts with `ghp_...`) - you won't see it again!

### Step 2: Clear Old Credentials

In your WSL terminal, run:

```bash
cd "/mnt/c/Users/ASUS/New folder (2)/linera-micro-bets"

# Clear any stored credentials
git credential reject https://github.com
```

### Step 3: Push Again with Token

```bash
git push -u origin main
```

**When prompted:**
- **Username:** `Snehal707`
- **Password:** **Paste your token** (the `ghp_...` string) - NOT your GitHub password!

---

## Alternative: Use Token in URL (One-Time)

If you want to avoid entering it each time:

```bash
# Remove existing remote
git remote remove origin

# Add remote with token (replace YOUR_TOKEN with actual token)
git remote add origin https://YOUR_TOKEN@github.com/Snehal707/linera-micro-bets.git

# Push (won't ask for password)
git push -u origin main
```

**Example:**
```bash
git remote add origin https://ghp_abc123xyz789@github.com/Snehal707/linera-micro-bets.git
```

⚠️ **Note:** This stores the token in `.git/config`. Only use if you're okay with that.

---

## Store Token for Future Use (Recommended)

After successfully pushing once, store it:

```bash
# Configure git to store credentials
git config --global credential.helper store

# Now push (enter token once, it's saved)
git push -u origin main
```

After this, you won't need to enter the token again.

---

## Still Getting 403 Error?

If you still get "Permission denied" after using a token:

1. **Check repository exists:**
   - Go to https://github.com/Snehal707/linera-micro-bets
   - Make sure it exists and you're the owner

2. **Verify token has correct scope:**
   - Token must have `repo` scope checked
   - Create a new token if needed

3. **Check repository name:**
   - Make sure it's exactly `linera-micro-bets` (case-sensitive)

4. **Try creating repository again:**
   - Make sure you didn't initialize it with README
   - Repository should be empty when you push

---

## Complete Command Sequence

```bash
# 1. Navigate to project
cd "/mnt/c/Users/ASUS/New folder (2)/linera-micro-bets"

# 2. Clear old credentials
git credential reject https://github.com

# 3. Configure credential helper (optional, but recommended)
git config --global credential.helper store

# 4. Push with token
git push -u origin main

# When prompted:
# Username: Snehal707
# Password: [paste your ghp_... token here]
```

---

## Need Help Creating Token?

See `GITHUB_TOKEN_GUIDE.md` for detailed step-by-step instructions with screenshots.
