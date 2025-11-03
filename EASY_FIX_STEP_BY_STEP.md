# Easy Fix: Set Supabase Secrets (Step by Step)

## Copy-Paste These Commands One at a Time

### Step 1: Login to Supabase

Copy and paste this:
```bash
npx supabase login
```

- A browser window will open
- Login with your Supabase account
- Come back to terminal when done

### Step 2: Link to Your Project

Copy and paste this:
```bash
npx supabase link --project-ref kujoudvjmhuypxyntrkm
```

- It will ask for your database password
- Enter your password and press Enter

### Step 3: Set First Secret (Minter Key)

Copy and paste this ENTIRE command:
```bash
npx supabase secrets set GAME_MINTER_PRIVATE_KEY="0x90e5340c08b03769795bdf15a0cf5f2f9f32090c650275ac9399bf7541819e61"
```

Wait for: ✅ "Successfully set secret GAME_MINTER_PRIVATE_KEY"

### Step 4: Set Second Secret (Token Address)

Copy and paste this ENTIRE command:
```bash
npx supabase secrets set VITE_AIC_TOKEN_ADDRESS="0x4B71cD610AfCCDf0B02d566dA0071C74444a8666"
```

Wait for: ✅ "Successfully set secret VITE_AIC_TOKEN_ADDRESS"

### Step 5: Verify Secrets Are Set

Copy and paste this:
```bash
npx supabase secrets list
```

You should see:
```
GAME_MINTER_PRIVATE_KEY
VITE_AIC_TOKEN_ADDRESS
```

## Done! Now Claim Your Tokens

1. **Go to your app** (Rewards page)
2. **Refresh the page** (F5 or Cmd+R)
3. **Click "Claim 3184 AIC Tokens"**
4. **Wait 2 seconds**
5. **Go to Convert or Bridge page**
6. **You'll see 3184 AIC!** ✅

## If You Get Stuck

### "Cannot find project-ref"
Your project might not be linked. Try:
```bash
npx supabase projects list
```

Then link with the correct project ID.

### "Invalid credentials"
Make sure you're logged into the correct Supabase account at:
https://supabase.com/dashboard

### "Permission denied"
You need to be the project owner or have admin access.

---

## Alternative: Direct API Method (If CLI Doesn't Work)

If the CLI isn't working, I can set secrets directly via Supabase Management API. Let me know and I'll create a script for that!
