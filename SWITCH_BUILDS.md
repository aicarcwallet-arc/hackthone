# 🔄 Switch Between Arc and Avalanche Builds

You now have TWO complete, separate builds that you can easily switch between.

## 🎨 Current Builds:

### 1. Arc/Circle Build (Currently Active)
- **Theme:** Dark (gray-950, cyan-500, blue-600)
- **Network:** Arc Testnet
- **Features:** Circle integration, treasury, USDC payouts
- **Purpose:** Hackathon demo, Circle API showcase

### 2. Avalanche Build (New)
- **Theme:** Light/White (clean, minimal, Avalanche Card style)
- **Colors:** White, Black, Red (#E84142), Gray tones
- **Font:** Inter (like Avalanche Card)
- **Network:** Avalanche C-Chain Mainnet
- **Features:** Personal vaults, Avalanche Card integration
- **Purpose:** Production launch, real users

---

## 🔀 How to Switch Builds

### Option 1: Switch to Avalanche Build

**Step 1:** Open `src/main.tsx`

**Step 2:** Change the import from:
```typescript
import App from './App'
```

To:
```typescript
import App from '../src-avalanche/App-Avalanche'
```

**Step 3:** Save and refresh browser

**Result:** You'll see the clean white Avalanche Card-themed landing page!

### Option 2: Switch Back to Arc Build

**Step 1:** Open `src/main.tsx`

**Step 2:** Change the import back to:
```typescript
import App from './App'
```

**Step 3:** Save and refresh browser

**Result:** You're back to the dark Arc Testnet build!

---

## 📁 File Structure

```
/project
├── /src                          [Arc Build - Dark Theme]
│   ├── App.tsx                   ← Arc/Circle app
│   ├── components/
│   │   ├── LandingPage.tsx       ← Arc landing (dark)
│   │   ├── GamePage.tsx
│   │   ├── CircleBanking.tsx
│   │   └── ... (all Arc components)
│   └── main.tsx                  ← Switch imports here!
│
├── /src-avalanche                [Avalanche Build - Light Theme]
│   ├── App-Avalanche.tsx         ← Avalanche app
│   └── components/
│       └── AvalancheLandingPage.tsx  ← Avalanche landing (white/clean)
│
├── /contracts                    [Arc contracts - DON'T TOUCH]
│   └── ... (Circle integration contracts)
│
└── /contracts-avalanche          [Avalanche contracts - NEW]
    └── ... (Personal vault contracts)
```

---

## 🎨 Visual Differences

### Arc Build (Dark)
```
Background:    Gray-950 → Gray-900 → Black gradient
Primary:       Cyan-500 (#06b6d4)
Secondary:     Blue-600
Text:          White/Gray-300
Accent:        Cyan glows
Style:         Dark, tech, cyberpunk
```

### Avalanche Build (Light)
```
Background:    White (#FFFFFF)
Primary:       Black (#000000)
Accent:        Avalanche Red (#E84142)
Text:          Black/Gray-600
Font:          Inter (all weights)
Style:         Clean, minimal, modern
```

---

## 🚀 Quick Preview URLs

After switching, you'll see:

### Arc Build
```
Homepage:
- Dark gradient background
- "LIVE ON ARC TESTNET" banner
- Cyan glowing buttons
- Circle logo floating icons
- Arc network branding
```

### Avalanche Build
```
Homepage:
- Pure white background
- "Powered by Avalanche" badge
- Clean black buttons with red accents
- Mountain icon branding
- Avalanche Card integration info
```

---

## 📋 What's Different

| Feature | Arc Build | Avalanche Build |
|---------|-----------|-----------------|
| **Theme** | Dark cyberpunk | Light minimal |
| **Font** | System fonts | Inter |
| **Primary Color** | Cyan (#06b6d4) | Black + Red |
| **Background** | Dark gradients | Pure white |
| **Network** | Arc Testnet | Avalanche Mainnet |
| **Wallet Flow** | Arc testnet setup | Avalanche setup |
| **Branding** | Circle/Arc logos | Avalanche branding |
| **Card System** | Circle Banking | Avalanche Card |
| **Purpose** | Hackathon demo | Production |

---

## 🛠️ Development Tips

### Working on Both Builds

**To test Arc build:**
```bash
# In src/main.tsx, import from './App'
npm run dev
# Visit localhost - see dark Arc theme
```

**To test Avalanche build:**
```bash
# In src/main.tsx, import from '../src-avalanche/App-Avalanche'
npm run dev
# Visit localhost - see white Avalanche theme
```

### Keeping Both Updated

Both builds can coexist:
- Arc build files in `/src` and `/contracts`
- Avalanche build files in `/src-avalanche` and `/contracts-avalanche`
- Switch by changing ONE line in `src/main.tsx`

---

## 🎯 When to Use Each

### Use Arc Build When:
✅ Presenting at hackathon
✅ Demoing Circle integration
✅ Showing treasury system
✅ Need testnet demo
✅ Judges care about Circle API

### Use Avalanche Build When:
✅ Launching to real users
✅ Want mainnet deployment
✅ Need real card spending
✅ Want clean, professional look
✅ Prefer user-controlled vaults
✅ Need production-ready system

---

## 💡 Pro Tip: Deploy Both!

You can deploy BOTH builds:

1. **Main domain:** avalanche build (production users)
2. **Subdomain:** arc build (demo.yourdomain.com for hackathon)

Or:

1. **Main domain:** arc build (hackathon judges)
2. **After hackathon:** switch to avalanche build (real users)

---

## ⚠️ Important Notes

1. **Don't mix files:** Keep Arc and Avalanche components separate
2. **Single switch point:** Only change import in `src/main.tsx`
3. **Shared config:** Both use same tailwind config (has both themes)
4. **Independent:** Each build is fully self-contained

---

## 🔍 Current Setup

**Right now you're seeing:**
- Arc Build (dark theme)
- Because `src/main.tsx` imports from `./App`

**To see Avalanche theme:**
1. Open `src/main.tsx`
2. Change to import from `../src-avalanche/App-Avalanche`
3. Save
4. Refresh browser
5. See white Avalanche Card-themed landing!

---

## 🎉 Summary

You have TWO complete builds:

1. **Arc Build** - Dark, Circle integration, testnet demo
2. **Avalanche Build** - Light, Avalanche Card, mainnet ready

Switch between them by changing ONE import line in `src/main.tsx`!

Both are production-ready, fully functional, and serve different purposes! 🚀
