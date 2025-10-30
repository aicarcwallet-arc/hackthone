# 📱 AIC Token PWA - Install as Native App

Your AIC Token app is now a **Progressive Web App (PWA)** that can be installed on mobile devices like a native app!

## ✨ Features

- 📲 **Install on Home Screen** - Works like a native mobile app
- 🚀 **Fast Loading** - Cached assets for instant startup
- 📴 **Offline Support** - Basic functionality works without internet
- 🔔 **Full Screen Mode** - No browser UI, pure app experience
- 💾 **Auto Updates** - Service worker updates automatically

## 📱 Installation Instructions

### **Android (Chrome/Edge/Samsung Internet)**

1. **Open the app** in Chrome, Edge, or Samsung Internet browser
2. **Look for the install prompt** at the bottom of the screen (appears after 3 seconds)
3. **Tap "Install Now"** button
4. **Or manually install:**
   - Tap the **⋮** menu (3 dots) in the top-right corner
   - Select **"Add to Home screen"** or **"Install app"**
   - Tap **"Install"** or **"Add"** to confirm
5. **Launch from home screen** - The app icon appears on your home screen

### **iOS (Safari)**

1. **Open the app** in Safari browser
2. **Look for the install instructions** at the bottom (appears after 3 seconds)
3. **Follow these steps:**
   - Tap the **Share button** (⎋) at the bottom of Safari
   - Scroll down and tap **"Add to Home Screen"**
   - Edit the name if desired (default: "AIC Token")
   - Tap **"Add"** in the top-right corner
4. **Launch from home screen** - The app icon appears on your home screen

### **Desktop (Chrome/Edge/Brave)**

1. **Open the app** in Chrome, Edge, or Brave browser
2. **Look for the install icon** in the address bar (⊕ or computer icon)
3. **Click the install button** or:
   - Click the **⋮** menu (3 dots) in the top-right
   - Select **"Install AIC Token..."** or **"Install app"**
4. **Or use the install prompt** that appears at the bottom
5. **Launch from:** Start menu, taskbar, or desktop shortcut

## 🎯 What You Get

### **Native App Experience**
- ✅ Home screen icon with AIC Token logo
- ✅ Splash screen on startup
- ✅ Full-screen mode (no browser UI)
- ✅ Runs in standalone window
- ✅ App switcher shows "AIC Token" not browser

### **Performance Benefits**
- ⚡ Instant loading (cached assets)
- 📦 Smaller download size after first load
- 🔄 Background updates
- 📴 Works offline for basic features

### **Mobile Optimizations**
- 📱 Perfect mobile responsiveness
- 👆 Touch-optimized buttons and inputs
- 🎨 Cyan theme color matches app
- 🚫 No pull-to-refresh interference

## 🔧 Technical Details

### **Manifest Configuration**
- **Name:** AIC Token - Earn & Swap
- **Short Name:** AIC Token
- **Theme Color:** #06b6d4 (Cyan)
- **Background:** #0a0a0a (Dark)
- **Display:** Standalone
- **Orientation:** Portrait-primary

### **Service Worker Features**
- Caches critical assets (HTML, CSS, JS, images)
- Network-first strategy for API calls
- Fallback to cached content when offline
- Auto-cleanup of old caches
- Version: `aic-token-v1`

### **Cached Assets**
- App shell (HTML, CSS, JS)
- AIC Token logo
- Arc logo
- USDC logo
- Circle logo
- All static images

### **Network Exclusions**
Service worker **does not cache**:
- Supabase API calls
- Ethereum/MetaMask transactions
- Real-time blockchain data

## 📊 Browser Support

| Platform | Browser | Install Method | Status |
|----------|---------|----------------|--------|
| Android | Chrome 90+ | Install prompt + Menu | ✅ Full |
| Android | Edge 90+ | Install prompt + Menu | ✅ Full |
| Android | Samsung Internet | Install prompt + Menu | ✅ Full |
| Android | Firefox | Not supported | ❌ No PWA |
| iOS | Safari 15+ | Share → Add to Home | ✅ Full |
| iOS | Chrome/Edge | Not supported | ⚠️ Use Safari |
| Desktop | Chrome/Edge/Brave | Install prompt + Menu | ✅ Full |
| Desktop | Firefox | Not supported | ❌ No PWA |

## 🎨 App Icon

The app uses the **AIC Token logo** (`/aic toekn  copy.png`) as the app icon:
- Displayed on home screen
- Shows in app switcher
- Appears in splash screen
- Used in notifications (future)

## 🔐 Security

- ✅ Served over HTTPS (required for PWA)
- ✅ Service worker runs in secure context
- ✅ No credentials cached by service worker
- ✅ MetaMask signatures still required for transactions
- ✅ All blockchain calls use live network data

## 📲 Uninstalling

### **Android**
1. Long-press the app icon on home screen
2. Select "Uninstall" or drag to "Uninstall"
3. Confirm removal

### **iOS**
1. Long-press the app icon on home screen
2. Tap "Remove App"
3. Select "Delete App"
4. Confirm deletion

### **Desktop**
1. Open the app
2. Click ⋮ menu in app window
3. Select "Uninstall AIC Token..."
4. Confirm removal

## 🚀 Benefits of PWA vs Native App

### **Advantages**
- ✅ No app store approval required
- ✅ Instant updates (no user action needed)
- ✅ Smaller size than native apps
- ✅ Cross-platform (one codebase)
- ✅ Direct URL access still works
- ✅ No native app development needed

### **Limitations**
- ⚠️ iOS has some PWA restrictions
- ⚠️ Less access to device APIs than native
- ⚠️ No app store discoverability
- ⚠️ Requires modern browser support

## 🆘 Troubleshooting

### **Install Prompt Not Appearing?**
- Wait 3 seconds after page loads
- You may have dismissed it before (check localStorage)
- Clear site data and reload
- Try manual installation via browser menu

### **App Not Installing?**
- Ensure you're using a supported browser
- Check that site is served over HTTPS
- Verify manifest.json is accessible
- Try clearing browser cache

### **App Not Working Offline?**
- Service worker needs one online visit first
- Some features require internet (blockchain data)
- Check if service worker registered (DevTools → Application)

### **iOS Specific Issues**
- **Must use Safari** for PWA installation
- Chrome/Edge on iOS don't support PWA install
- Some features may be limited on iOS
- Update to iOS 15+ for best experience

## 📝 Notes

- The install prompt **auto-dismisses** if not installed within session
- Users can **re-enable** by clearing site data
- **iOS shows instructions** instead of install button (Safari limitation)
- Service worker updates **automatically** when you deploy new version
- App works in **portrait mode only** for optimal mobile experience

## 🎉 Enjoy Your Native-Like AIC Token App!

Now you can:
- 💰 Earn AIC tokens
- 🔄 Swap crypto instantly
- 🌉 Bridge assets cross-chain
- 📊 Track your wallet balances
- 📜 View transaction history

All from a **fast, installable mobile app**! 📱✨
