# Vercel Environment Variables - Copy These

## Add These Environment Variables

In Vercel, expand "Environment Variables" section and add these one by one:

---

### Variable 1:

**Key:**
```
NEXT_PUBLIC_LINERA_NETWORK
```

**Value:**
```
testnet
```

---

### Variable 2:

**Key:**
```
NEXT_PUBLIC_LINERA_CHAIN_ID
```

**Value:**
```
<YOUR_TESTNET_CHAIN_ID>
```

---

### Variable 3:

**Key:**
```
NEXT_PUBLIC_MICRO_BET_APP_ID
```

**Value:**
```
<YOUR_MICRO_BET_APP_ID>
```

---

### Variable 4:

**Key:**
```
NEXT_PUBLIC_FUNGIBLE_APP_ID
```

**Value:**
```
<YOUR_FUNGIBLE_APP_ID>
```

---

### Variable 5 (Option A):

**Key:**
```
NEXT_PUBLIC_LINERA_GRAPHQL_URL
```

**Value:**
```
https://<your-linera-service>/chains/<chain_id>/applications/<micro_bet_app_id>
```

---

### Variable 6 (Option B):

**Key:**
```
NEXT_PUBLIC_LINERA_SERVICE_URL
```

**Value:**
```
https://<your-linera-service>
```

---

## How to Add in Vercel

1. Click to expand "Environment Variables" section
2. For each variable:
   - Type the **Key** in the first field
   - Type the **Value** in the second field
   - Press Enter or click "Add"
3. You should have **5 variables** if you use Option A, or **6 variables** if you use Option B

---

## Quick Copy-Paste Reference

**Variable 1:**
- Key: `NEXT_PUBLIC_LINERA_NETWORK`
- Value: `testnet`

**Variable 2:**
- Key: `NEXT_PUBLIC_LINERA_CHAIN_ID`
- Value: `<YOUR_TESTNET_CHAIN_ID>`

**Variable 3:**
- Key: `NEXT_PUBLIC_MICRO_BET_APP_ID`
- Value: `<YOUR_MICRO_BET_APP_ID>`

**Variable 4:**
- Key: `NEXT_PUBLIC_FUNGIBLE_APP_ID`
- Value: `<YOUR_FUNGIBLE_APP_ID>`

**Variable 5 (Option A):**
- Key: `NEXT_PUBLIC_LINERA_GRAPHQL_URL`
- Value: `https://<your-linera-service>/chains/<chain_id>/applications/<micro_bet_app_id>`

**Variable 6 (Option B):**
- Key: `NEXT_PUBLIC_LINERA_SERVICE_URL`
- Value: `https://<your-linera-service>`

---

That's it! Add these and you're done! ✅
