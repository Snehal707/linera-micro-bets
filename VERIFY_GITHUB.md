# Verify Your GitHub Repository Setup

## ✅ Success! Your code is on GitHub

Your repository is live at: **https://github.com/Snehal707/linera-micro-bets**

---

## Step 1: Verify on GitHub Website

1. Go to: https://github.com/Snehal707/linera-micro-bets
2. You should see:
   - ✅ All your files listed
   - ✅ README.md displayed
   - ✅ All folders (micro-bet-contract, frontend, linera-protocol, etc.)
   - ✅ Commit history showing "Initial commit"

---

## Step 2: Configure Credential Helper (So You Don't Enter Token Every Time)

You already ran:
```bash
git config --global credential.helper store
```

**Next time you push**, it will ask for credentials **once more**, then save them.

To test it:

```bash
cd "/mnt/c/Users/ASUS/New folder (2)/linera-micro-bets"

# Make a small change
echo "# Test" >> README.md

# Add and commit
git add README.md
git commit -m "Test commit"

# Push (will ask for credentials ONE MORE TIME, then save them)
git push
```

After this, future pushes won't ask for credentials!

---

## Step 3: Verify Git Configuration

Check your git setup:

```bash
# Check remote
git remote -v

# Should show:
# origin  https://github.com/Snehal707/linera-micro-bets.git (fetch)
# origin  https://github.com/Snehal707/linera-micro-bets.git (push)

# Check branch
git branch -a

# Should show:
# * main
#   remotes/origin/main

# Check status
git status

# Should say: "Your branch is up to date with 'origin/main'"
```

---

## Step 4: Future Workflow

Now that everything is set up, here's your workflow:

### Making Changes:

```bash
# 1. Make changes to files
# 2. Stage changes
git add .

# 3. Commit
git commit -m "Description of changes"

# 4. Push to GitHub
git push
```

### Pulling Latest Changes:

```bash
# Get latest from GitHub
git pull origin main
```

### Checking Status:

```bash
# See what changed
git status

# See commit history
git log --oneline
```

---

## Common Commands Reference

```bash
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# Pull from GitHub
git pull

# View commit history
git log --oneline

# Check remote
git remote -v
```

---

## Troubleshooting

### If push asks for credentials every time:

```bash
# Check credential helper is set
git config --global credential.helper

# Should show: store

# If not, set it again
git config --global credential.helper store

# Clear stored credentials and re-enter
git credential reject https://github.com
# Then push again and enter token once more
```

### If you get "permission denied":

- Make sure you're using a Personal Access Token (not password)
- Verify token hasn't expired
- Check repository name is correct

### If you want to change remote URL:

```bash
# Remove old remote
git remote remove origin

# Add new remote
git remote add origin https://github.com/Snehal707/linera-micro-bets.git

# Verify
git remote -v
```

---

## 🎉 Congratulations!

Your Linera Micro-Bets project is now on GitHub! You can:
- Share the repository URL with others
- Clone it on other machines
- Collaborate with others
- Track changes and versions

---

## Next Steps

1. ✅ Verify repository on GitHub website
2. ✅ Test making a small change and pushing
3. ✅ Set up credential helper (already done!)
4. ✅ Start developing!

Your repository: **https://github.com/Snehal707/linera-micro-bets**
