# Fix: Root Directory Must Be Set to "frontend"

## The Problem

Vercel is looking for `package.json` in the root directory (`./`), but your Next.js app is in the `frontend` folder.

**Error:** "No Next.js version detected. Make sure your package.json has "next" in either "dependencies" or "devDependencies". Also check your Root Directory setting matches the directory of your package.json file."

---

## Solution: Change Root Directory in Settings

### Step 1: Go to Project Settings

1. The deployment will fail (that's okay)
2. Go to your Vercel dashboard
3. Click on your project: `linera_micro_bets`
4. Click **"Settings"** (top menu)
5. Click **"General"** tab

### Step 2: Change Root Directory

1. Scroll down to **"Root Directory"** section
2. You'll see: `./` (current value)
3. Click **"Edit"** button
4. **Type:** `frontend` (you can type it here!)
5. Click **"Save"**

### Step 3: Redeploy

1. Go to **"Deployments"** tab
2. Click **"Redeploy"** on the failed deployment
3. Or click **"Deploy"** button

---

## Alternative: Use vercel.json Configuration

If you can't change it in settings, create a `vercel.json` file in your repository root:

### Create vercel.json in root:

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/.next",
  "installCommand": "cd frontend && npm install",
  "framework": "nextjs",
  "rootDirectory": "frontend"
}
```

Then commit and push:

```bash
cd "/mnt/c/Users/ASUS/New folder (2)/linera-micro-bets"
# Create vercel.json
cat > vercel.json << 'EOF'
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/.next",
  "installCommand": "cd frontend && npm install",
  "framework": "nextjs",
  "rootDirectory": "frontend"
}
EOF

# Commit and push
git add vercel.json
git commit -m "Add vercel.json configuration"
git push
```

Then redeploy in Vercel.

---

## Recommended: Use Settings (Easier)

**Just go to Settings → General → Root Directory → Edit → Type "frontend" → Save → Redeploy**

This is the easiest way! ✅
