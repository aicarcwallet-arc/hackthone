# Get Valid Circle API Key - Step by Step

## 🚨 Current Issue:
Your API keys are returning **401 Unauthorized** - they're either:
- Test/placeholder keys (not real)
- Expired
- Not verified
- From a deleted project

---

## ✅ Solution: Get Fresh API Key (5 minutes)

### **Step 1: Go to Circle Developer Console**
🔗 https://console.circle.com/

### **Step 2: Sign Up / Login**
- If new: Sign up with email
- If existing: Login

### **Step 3: Verify Your Account**
- Check your email for verification link
- Complete any required steps
- **IMPORTANT**: Some API features need identity verification

### **Step 4: Create API Key**

1. **Go to**: API Keys section (left sidebar)
2. **Click**: "Create API Key"
3. **Choose**:
   - **Testnet** (for testing) - Use "Testnet" environment
   - **Mainnet** (for production) - Requires more verification
4. **Copy** the full API key (starts with `TEST_API_KEY:` or `LIVE_API_KEY:`)

**Example valid format:**
```
TEST_API_KEY:abc123def456ghi789:xyz987uvw654rst321
```

### **Step 5: Update Your .env**

Replace the old key with your new one:

```bash
# Open .env and update this line:
VITE_CIRCLE_API_KEY=TEST_API_KEY:your_new_key_here
```

---

## 🔍 Alternative: Check If You Already Have Access

### **Option A: Check Circle Dashboard**

1. Go to: https://console.circle.com/
2. Login with your account
3. Check **API Keys** section
4. See if you have any active keys
5. If yes, copy one and use it

### **Option B: Contact Circle Support**

If you're having issues:
- Email: support@circle.com
- Discord: https://discord.gg/circle
- Tell them: "Need API access for developer-controlled wallets testnet"

---

## 📝 Quick Test Your New Key

Once you have a new key, test it:

### **Method 1: Use Browser Console**

```javascript
// Open browser console (F12) and run:
const apiKey = "TEST_API_KEY:your_new_key_here";

fetch('https://api.circle.com/v1/w3s/config/entity', {
  headers: {
    'Authorization': `Bearer ${apiKey}`
  }
})
.then(r => r.json())
.then(d => console.log(d));
```

**Expected result:**
- ✅ Returns config data = Key is valid
- ❌ Returns 401 = Key is invalid

### **Method 2: Use curl**

```bash
curl -H "Authorization: Bearer TEST_API_KEY:your_key_here" \
     https://api.circle.com/v1/w3s/config/entity
```

---

## 🎯 What You Need for Circle Programmable Wallets:

### **Free Tier (Testnet):**
- ✅ Email verification
- ✅ Create account
- ✅ Generate API key
- ✅ Start building immediately

### **Production (Mainnet):**
- Identity verification (KYC)
- Business verification
- Compliance review
- Can take 1-2 weeks

---

## 💡 Don't Have Circle Account Yet?

### **Step-by-Step Sign Up:**

1. **Go to**: https://console.circle.com/signup

2. **Fill in**:
   - Email
   - Password
   - Company name (can be personal project)

3. **Verify email** (check inbox/spam)

4. **Complete profile**:
   - First/Last name
   - Use case: "Developer tools" or "Crypto payments"
   - Testnet access is immediate!

5. **Get API Key**:
   - Dashboard → API Keys → Create
   - Copy the full key
   - **Save it somewhere safe!** (Circle only shows it once)

---

## 🔒 Security Notes:

- **NEVER** share your API key publicly
- **NEVER** commit it to GitHub
- Store in `.env` file (already gitignored)
- Each key is for one environment (testnet vs mainnet)

---

## ⚡ Quick Alternative: Use Mock System

If you can't get Circle API key right now, you can test with the mock system:

**Your app already has:**
- ✅ Treasury wallet with 24 USDC
- ✅ MockUSDC contract
- ✅ Direct blockchain withdrawals

**To use it:**
- Users withdraw directly to their MetaMask
- No Circle needed (but less convenient)
- Already working!

---

## 📞 Need Help?

### **Circle Resources:**
- Docs: https://developers.circle.com/wallets
- Quickstart: https://developers.circle.com/wallets/docs/quickstart
- API Reference: https://developers.circle.com/wallets/reference

### **Common Issues:**

**"Account pending verification"**
→ Wait for email, or use testnet which doesn't need verification

**"API key not found"**
→ Key was deleted, create a new one

**"Rate limit exceeded"**
→ Wait 1 minute, try again

**"Invalid authentication"**
→ Check if you copied the full key (including prefix)

---

## ✅ Next Steps After Getting Valid Key:

1. Update `.env` with new key
2. Open `create-circle-wallet-only.html`
3. Paste new key
4. Create wallet
5. Done! 🎉
