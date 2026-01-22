# How to Create and Use GitHub Personal Access Token

## Why You Need a Token

GitHub no longer accepts passwords for git operations. You **must** use a Personal Access Token instead.

---

## Part 1: Create Personal Access Token

### Step 1: Go to GitHub Settings

1. Open https://github.com in your browser
2. **Sign in** to your account (Snehal707)
3. Click your **profile picture** (top right)
4. Click **"Settings"**

### Step 2: Navigate to Developer Settings

1. Scroll down the left sidebar
2. Click **"Developer settings"** (at the bottom)

### Step 3: Go to Personal Access Tokens

1. Click **"Personal access tokens"** in the left sidebar
2. Click **"Tokens (classic)"**

### Step 4: Generate New Token

1. Click **"Generate new token"** button
2. Select **"Generate new token (classic)"**

### Step 5: Configure Token

Fill in the form:

- **Note:** `Linera Micro-Bets` (or any name you want)
- **Expiration:** 
  - Choose **30 days**, **60 days**, **90 days**, or **No expiration**
  - For your project, **90 days** or **No expiration** is fine
- **Select scopes:** Check these boxes:
  - ✅ **`repo`** (Full control of private repositories)
    - This includes: `repo:status`, `repo_deployment`, `public_repo`, `repo:invite`, `security_events`

**Important:** You only need to check **`repo`** - it will automatically select the sub-options.

### Step 6: Generate and Copy Token

1. Scroll down and click **"Generate token"** (green button)
2. **⚠️ IMPORTANT:** GitHub will show your token **ONCE**
3. **COPY IT IMMEDIATELY** - it looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
4. **Save it somewhere safe** (password manager, text file, etc.)

**⚠️ WARNING:** If you close this page, you **cannot** see the token again. You'll need to create a new one.

---

## Part 2: Use Token When Pushing

### Method 1: Use Token as Password (Easiest)

When you run `git push`, it will ask for credentials:

```bash
git push -u origin main
```

**When prompted:**

1. **Username:** `Snehal707` (your GitHub username)
2. **Password:** Paste your **Personal Access Token** (the `ghp_...` string)

**Example:**
```
Username for 'https://github.com': Snehal707
Password for 'https://Snehal707@github.com': ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Method 2: Store Token in Git Credential Manager (Recommended)

This way you don't have to enter it every time:

#### On Windows (PowerShell):
```powershell
# Store token in Windows Credential Manager
git config --global credential.helper wincred

# Then when you push, enter token once and it's saved
git push -u origin main
```

#### On WSL/Linux:
```bash
# Store token in Git credential helper
git config --global credential.helper store

# Then when you push, enter token once and it's saved
git push -u origin main
```

After the first push, Git will remember your token.

### Method 3: Include Token in URL (Not Recommended - Less Secure)

You can include the token directly in the remote URL:

```bash
# Add remote with token (replace YOUR_TOKEN with actual token)
git remote add origin https://YOUR_TOKEN@github.com/Snehal707/linera-micro-bets.git

# Then push (won't ask for password)
git push -u origin main
```

**⚠️ Warning:** This stores the token in plain text in `.git/config`. Only use this if you're okay with that.

---

## Part 3: Complete Push Example

Here's the complete flow:

```bash
# 1. Navigate to project
cd "/mnt/c/Users/ASUS/New folder (2)/linera-micro-bets"

# 2. Add remote (if not done)
git remote add origin https://github.com/Snehal707/linera-micro-bets.git

# 3. Push (will prompt for credentials)
git branch -M main
git push -u origin main

# When prompted:
# Username: Snehal707
# Password: ghp_your_token_here
```

---

## Part 4: Verify Token Works

After pushing, you should see:

```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
Compressing objects: 100% (X/X), done.
Writing objects: 100% (X/X), done.
Total X (delta Y), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (Y/Y), completed.
To https://github.com/Snehal707/linera-micro-bets.git
 * [new branch]      main -> main
Branch 'main' set up to track 'remote branch 'main' from 'origin'.
```

If you see an error, check:
- Token is correct (no extra spaces)
- Token hasn't expired
- `repo` scope is selected

---

## Part 5: Troubleshooting

### "Authentication failed" or "Invalid credentials"

**Solutions:**
1. Make sure you're using the **token**, not your GitHub password
2. Check token hasn't expired
3. Verify token has `repo` scope
4. Try creating a new token

### "Permission denied"

**Solutions:**
1. Check repository name is correct
2. Verify repository exists on GitHub
3. Make sure you're the owner or have write access

### "Token not found" or "Token expired"

**Solutions:**
1. Create a new token (follow Part 1)
2. Update your stored credentials:
   ```bash
   # Remove old credentials
   git credential reject https://github.com
   
   # Push again (will ask for new token)
   git push -u origin main
   ```

### "fatal: could not read Username"

**Solutions:**
1. Make sure you're using HTTPS URL (not SSH)
2. Try the push command again
3. If using credential helper, clear it:
   ```bash
   git credential reject https://github.com
   ```

---

## Part 6: Security Best Practices

### ✅ DO:
- Use tokens with **minimum required scopes** (just `repo` for your project)
- Set **expiration dates** (90 days is good)
- Store tokens in a **password manager**
- **Revoke tokens** you're not using anymore

### ❌ DON'T:
- Share tokens publicly
- Commit tokens to git
- Use the same token for multiple projects (create separate ones)
- Use tokens with excessive permissions

### Revoke a Token (if compromised):

1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Find your token
3. Click **"Revoke"**
4. Create a new token

---

## Quick Reference

**Token Format:** `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**When to use:**
- When `git push` asks for password
- Use token as the **password** (not your GitHub password)

**Where to create:**
- GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)

**Required scope:**
- ✅ `repo` (for private/public repositories)

---

## Complete Example Workflow

```bash
# 1. Set up git (if not done)
git config --global user.name "Snehal707"
git config --global user.email "snehal707@users.noreply.github.com"

# 2. Initialize and commit (if not done)
git init
git add .
git commit -m "Initial commit"

# 3. Add remote
git remote add origin https://github.com/Snehal707/linera-micro-bets.git

# 4. Push (will ask for credentials)
git branch -M main
git push -u origin main

# When prompted:
# Username: Snehal707
# Password: ghp_paste_your_token_here
```

That's it! After the first push, if you set up credential helper, you won't need to enter it again.
