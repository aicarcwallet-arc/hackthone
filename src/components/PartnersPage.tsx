import { CreditCard, Building2, Mail, ExternalLink, Globe } from 'lucide-react';

export function PartnersPage() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
          AIC Partners On Board
        </h2>
        <p className="text-lg text-gray-300">
          Building the future of financial freedom together
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-2xl p-8 border border-cyan-500/30">
          <div className="flex items-center gap-3 mb-6">
            <img
              src="/circle.b8b9d808c4509a1c3043e1a2859807b7a83364094f388457832f020fa02cbc37.png"
              alt="Circle"
              className="w-12 h-12"
            />
            <h3 className="text-2xl font-bold text-white">Circle</h3>
          </div>
          <p className="text-gray-300 mb-4">
            Built on Circle's Arc L1 blockchain with native USDC integration. Using Circle's CCTP for cross-chain transfers and programmable USDC for rewards.
          </p>
          <div className="space-y-2 text-sm text-gray-400">
            <p>• Arc L1 Blockchain Infrastructure</p>
            <p>• USDC Stablecoin Integration</p>
            <p>• Circle CCTP Bridge Protocol</p>
            <p>• Programmable USDC Smart Contracts</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-blue-600/10 rounded-2xl p-8 border border-purple-500/30">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-12 h-12 text-purple-400" />
            <h3 className="text-2xl font-bold text-white">OpenAI</h3>
          </div>
          <p className="text-gray-300 mb-4">
            Powered by OpenAI GPT-4 for cognitive validation. Our AI engine validates blockchain vocabulary understanding and ensures authentic learning.
          </p>
          <div className="space-y-2 text-sm text-gray-400">
            <p>• GPT-4 Cognitive Assessment</p>
            <p>• Real-time Vocabulary Validation</p>
            <p>• Copy-Paste Detection</p>
            <p>• Intelligent Learning Feedback</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">
          AIC-Arc Card: Virtual Visa Card
        </h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-8 h-8 text-cyan-400" />
              <h4 className="text-xl font-bold text-white">Card Features</h4>
            </div>
            <ul className="space-y-2 text-gray-300">
              <li>• Spend USDC at 70+ million merchants worldwide</li>
              <li>• Instant crypto-to-fiat conversion at point of sale</li>
              <li>• Virtual Visa card for online and mobile payments</li>
              <li>• 5% AiC cashback on every purchase</li>
              <li>• Real-time transaction notifications</li>
              <li>• Secure chip-and-PIN technology</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-xl p-6 border border-cyan-500/20">
            <h4 className="text-lg font-bold text-cyan-400 mb-3">How It Works</h4>
            <ol className="space-y-3 text-gray-300 text-sm">
              <li>1. Load USDC from your wallet to the virtual card</li>
              <li>2. Use card details for online shopping or add to mobile wallet</li>
              <li>3. Make purchases anywhere Visa is accepted</li>
              <li>4. Earn 5% back in AiC tokens on every transaction</li>
              <li>5. Track spending and rewards in real-time</li>
            </ol>
          </div>
        </div>
        <div className="mt-6 bg-blue-500/20 rounded-xl p-6 border border-blue-500/30">
          <p className="text-center text-gray-300 mb-4">
            <strong className="text-white">Circle Partner Alliance Request:</strong> We're seeking collaboration with Circle's partner network to integrate regulated card issuing services and provide seamless crypto-to-fiat spending globally.
          </p>
          <div className="flex justify-center">
            <a
              href="mailto:shaz@aictokenwordgame.com?subject=AIC-Arc Card Partnership Inquiry"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all"
            >
              <Mail className="w-5 h-5" />
              Contact for Partnership
            </a>
          </div>
        </div>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">
          AIC-Circle Fintech Banking
        </h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-8 h-8 text-purple-400" />
              <h4 className="text-xl font-bold text-white">Banking Features</h4>
            </div>
            <ul className="space-y-2 text-gray-300">
              <li>• ACH Transfer to bank account (FREE, 1-3 days)</li>
              <li>• Wire Transfer (Same day, $15 fee)</li>
              <li>• Instant Transfer (Minutes, $2.50 fee)</li>
              <li>• Direct Deposit - Receive paychecks in USDC</li>
              <li>• FDIC-insured partner banking</li>
              <li>• Traditional bank account integration</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-blue-600/10 rounded-xl p-6 border border-purple-500/20">
            <h4 className="text-lg font-bold text-purple-400 mb-3">Withdrawal Options</h4>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-white font-semibold mb-1">ACH Transfer</p>
                <p className="text-gray-300">Free • 1-3 business days • To any US bank</p>
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Wire Transfer</p>
                <p className="text-gray-300">$15 fee • Same business day • Domestic & International</p>
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Instant Transfer</p>
                <p className="text-gray-300">$2.50 fee • Within minutes • 24/7 availability</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 bg-purple-500/20 rounded-xl p-6 border border-purple-500/30">
          <p className="text-center text-gray-300 mb-4">
            <strong className="text-white">Circle & Arc Banking Partnership Request:</strong> We're requesting assistance in connecting with Circle's in-house banking partners and fintech alliance network to provide seamless USDC-to-USD withdrawals and traditional banking integration.
          </p>
          <div className="flex justify-center">
            <a
              href="mailto:shaz@aictokenwordgame.com?subject=Banking Partnership Request - Circle & Arc"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all"
            >
              <Mail className="w-5 h-5" />
              Request Banking Partnership
            </a>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-2xl p-8 border border-cyan-500/30 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Interested in Partnering with AIC?</h3>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          We're building the future of learn-to-earn finance and looking for strategic partners who share our vision of democratizing financial education and access.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:shaz@aictokenwordgame.com?subject=Partnership Inquiry"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all"
          >
            <Mail className="w-5 h-5" />
            Email Us
          </a>
          <a
            href="https://www.linkedin.com/in/shazsayee"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all"
          >
            Connect on LinkedIn
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
