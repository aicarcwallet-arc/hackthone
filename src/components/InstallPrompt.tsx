import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    if (isIOSDevice) {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      if (!isStandalone && !localStorage.getItem('iosInstallPromptDismissed')) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!localStorage.getItem('installPromptDismissed')) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    if (isIOS) {
      localStorage.setItem('iosInstallPromptDismissed', 'true');
    } else {
      localStorage.setItem('installPromptDismissed', 'true');
    }
  };

  if (!showPrompt) return null;

  if (isIOS) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up safe-area-inset">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl shadow-[0_0_50px_rgba(34,211,238,0.6)] p-4 max-w-md mx-auto border border-white/20">
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 text-white/80 hover:text-white touch-manipulation"
            aria-label="Dismiss install prompt"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-3">
            <div className="bg-white/20 p-2.5 rounded-lg flex-shrink-0 shadow-lg">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 pr-6">
              <h3 className="text-white font-bold mb-1.5 text-base">Install AIC Token App</h3>
              <p className="text-white/95 text-sm mb-3 leading-relaxed">
                Add to your home screen for quick access and offline support
              </p>
              <div className="bg-white/20 rounded-lg p-3 text-sm text-white space-y-2 backdrop-blur-sm">
                <p className="flex items-center gap-2">
                  <span className="text-lg">📤</span>
                  <span>1. Tap the Share button</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-lg">➕</span>
                  <span>2. Tap "Add to Home Screen"</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-lg">✅</span>
                  <span>3. Tap "Add" to confirm</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up safe-area-inset">
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl shadow-[0_0_50px_rgba(34,211,238,0.6)] p-4 max-w-md mx-auto border border-white/20">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-white/80 hover:text-white touch-manipulation"
          aria-label="Dismiss install prompt"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-3">
          <div className="bg-white/20 p-2.5 rounded-lg flex-shrink-0 shadow-lg">
            <Download className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 pr-6">
            <h3 className="text-white font-bold mb-1.5 text-base">Install AIC Token App</h3>
            <p className="text-white/95 text-sm mb-3 leading-relaxed">
              Install as a native app for faster access and offline support
            </p>
            <button
              onClick={handleInstallClick}
              className="w-full bg-white text-cyan-600 font-bold py-2.5 px-4 rounded-lg hover:bg-white/95 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg touch-manipulation"
            >
              <Download className="w-4 h-4" />
              Install Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
