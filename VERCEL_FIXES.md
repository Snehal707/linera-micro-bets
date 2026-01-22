# Fix Vercel Configuration Issues

## Issue 1: Project Name Error ❌

**Error:** "The name contains invalid characters"

**Fix:**
1. Change Project Name from: `linera-micro-bets`
2. To: `linera_micro_bets` (use underscores instead of hyphens)
3. Or: `lineramicrobets` (no special characters)

---

## Issue 2: Root Directory ❌

**Current:** `./` (root)

**Fix:**
1. Click "Edit" next to Root Directory
2. Change to: `frontend`
3. Save

---

## Issue 3: Environment Variables ❌

**Problems:**
- `NEXT_PUBLIC_MICRO_BET_APP_ID` value looks incomplete
- There's a duplicate/incorrect third row

**Fix:**

### Remove the incorrect third row:
1. Click the "—" button next to the third row
2. Delete the row with key: `8cb24e78ab54941d0667f9eeb3b33c4`

### Fix the environment variables:

**Row 1:** ✅ Correct
- Key: `NEXT_PUBLIC_LINERA_NETWORK`
- Value: `local`

**Row 2:** ❌ Fix this
- Key: `NEXT_PUBLIC_MICRO_BET_APP_ID`
- Value: `8cb24e78ab54941d0667f9eeb3b33c4974a8aa0f643521bb1ebe7afa5505e234`
- (Make sure it's the FULL ID)

**Add Row 3:** ✅ Add this
- Key: `NEXT_PUBLIC_FUNGIBLE_APP_ID`
- Value: `da9f76af8a028fc389c7b9374859662e7d278d2843d0f9cd80ded71669fbf9f3`

---

## Complete Fix Steps

1. **Change Project Name:**
   - From: `linera-micro-bets`
   - To: `linera_micro_bets`

2. **Change Root Directory:**
   - Click "Edit"
   - Change from `./` to `frontend`

3. **Fix Environment Variables:**
   - Delete the incorrect third row
   - Update `NEXT_PUBLIC_MICRO_BET_APP_ID` to full value: `8cb24e78ab54941d0667f9eeb3b33c4974a8aa0f643521bb1ebe7afa5505e234`
   - Add `NEXT_PUBLIC_FUNGIBLE_APP_ID`: `da9f76af8a028fc389c7b9374859662e7d278d2843d0f9cd80ded71669fbf9f3`

4. **Click Deploy**

---

## Correct Environment Variables (Final)

You should have exactly 3 variables:

1. `NEXT_PUBLIC_LINERA_NETWORK` = `local`
2. `NEXT_PUBLIC_MICRO_BET_APP_ID` = `8cb24e78ab54941d0667f9eeb3b33c4974a8aa0f643521bb1ebe7afa5505e234`
3. `NEXT_PUBLIC_FUNGIBLE_APP_ID` = `da9f76af8a028fc389c7b9374859662e7d278d2843d0f9cd80ded71669fbf9f3`

---

Fix these and click Deploy! ✅
