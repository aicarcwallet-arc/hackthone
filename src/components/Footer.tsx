import { Github, Linkedin, Mail, Twitter, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 border-t border-cyan-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/aic toekn .png"
                alt="AiC Logo"
                className="w-10 h-10 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"
              />
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  AI Cognitive Token
                </h3>
                <p className="text-xs text-gray-400">Learn • Earn • Freedom</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              The first AI-powered cognitive token where learning blockchain terms earns you real money.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-cyan-400">Getting Started</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a
                  href="https://docs.circle.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1"
                >
                  Circle Docs
                  <span className="text-xs">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://testnet.arcscan.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1"
                >
                  Arc Explorer
                  <span className="text-xs">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.circle.com/en/usdc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1"
                >
                  About USDC
                  <span className="text-xs">↗</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-cyan-400">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a
                  href="https://developers.circle.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1"
                >
                  Circle SDK
                  <span className="text-xs">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.circle.com/en/circle-bridge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1"
                >
                  Bridge Kit
                  <span className="text-xs">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://openai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1"
                >
                  OpenAI
                  <span className="text-xs">↗</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-cyan-400">Connect With Us</h3>
            <div className="space-y-3">
              <a
                href="https://twitter.com/shaziasayeed"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-cyan-400 transition-colors group"
              >
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                  <Twitter className="w-5 h-5" />
                </div>
                <span>Twitter / X</span>
              </a>
              <a
                href="https://linkedin.com/in/shazia-sayeed"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-cyan-400 transition-colors group"
              >
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </div>
                <span>LinkedIn</span>
              </a>
              <a
                href="https://github.com/shaziasayeed"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-cyan-400 transition-colors group"
              >
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                  <Github className="w-5 h-5" />
                </div>
                <span>GitHub</span>
              </a>
              <a
                href="mailto:shazia@aictoken.io"
                className="flex items-center gap-3 text-gray-400 hover:text-cyan-400 transition-colors group"
              >
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <span>Email Me</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              <span className="font-bold text-cyan-400">AI Cognitive Token (AiC)</span> - Where Learning Becomes Earning
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com/shaziasayeed"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-cyan-500/20 transition-colors"
                title="Follow on Twitter"
              >
                <Twitter className="w-5 h-5 text-gray-400 hover:text-cyan-400" />
              </a>
              <a
                href="https://linkedin.com/in/shazia-sayeed"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-cyan-500/20 transition-colors"
                title="Connect on LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-cyan-400" />
              </a>
              <a
                href="https://github.com/shaziasayeed"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-cyan-500/20 transition-colors"
                title="View on GitHub"
              >
                <Github className="w-5 h-5 text-gray-400 hover:text-cyan-400" />
              </a>
              <a
                href="mailto:shazia@aictoken.io"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-cyan-500/20 transition-colors"
                title="Send Email"
              >
                <Mail className="w-5 h-5 text-gray-400 hover:text-cyan-400" />
              </a>
            </div>
          </div>
          <div className="text-center mt-6 space-y-2">
            <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
              <span>Designed & Developed by</span>
              <a
                href="https://linkedin.com/in/shazia-sayeed"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Shazia Sayeed
              </a>
              <span>with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
            </p>
            <p className="text-gray-500 text-xs">
              © 2025 AiC Token Project. Built for Circle's "AI Agents on Arc with USDC" Hackathon
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
