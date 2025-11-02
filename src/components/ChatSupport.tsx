import { useState } from 'react';
import { Mail, MessageCircle, Clock, Phone, ExternalLink, Bot, Send, X } from 'lucide-react';

export function ChatSupport() {
  const [showAIChat, setShowAIChat] = useState(false);
  const [messages, setMessages] = useState<Array<{role: 'user' | 'ai', text: string}>>([
    { role: 'ai', text: 'Hi! I\'m your AI Partner Support Agent. Ask me about AiC tokens, USDC swaps, Arc Network, or partnerships!' }
  ]);
  const [input, setInput] = useState('');

  const handleAIResponse = (userMessage: string) => {
    const lowerMsg = userMessage.toLowerCase();

    if (lowerMsg.includes('aic') || lowerMsg.includes('token')) {
      return 'AiC (AI Cognitive) tokens are instant rewards you earn by answering vocabulary questions correctly. Each correct answer = instant AiC tokens! You can swap them 1:1 for USDC anytime.';
    }
    if (lowerMsg.includes('swap') || lowerMsg.includes('usdc')) {
      return 'Swap AiC to USDC instantly at 1:1 ratio on Arc Network. Lightning-fast transactions with minimal fees. Go to the Swap page to convert your earnings!';
    }
    if (lowerMsg.includes('arc') || lowerMsg.includes('network')) {
      return 'Arc Network is a lightning-fast EVM Layer 1 with native USDC and sub-second finality. No bridging needed - USDC is native gas!';
    }
    if (lowerMsg.includes('partner') || lowerMsg.includes('collaborate')) {
      return 'Interested in partnering? Email shaz@aictokenwordgame.com or connect with Shazia on LinkedIn: www.linkedin.com/in/shazsayee';
    }
    if (lowerMsg.includes('claim') || lowerMsg.includes('withdraw')) {
      return 'Claim your earned AiC tokens from the dashboard. They mint instantly to your wallet. Then swap to USDC whenever you want!';
    }
    if (lowerMsg.includes('how') || lowerMsg.includes('work')) {
      return 'Simple: 1) Play vocabulary game 2) Earn AiC tokens instantly 3) Claim to wallet 4) Swap to USDC anytime. All on Arc Network!';
    }
    return 'Great question! For detailed support, email shaz@aictokenwordgame.com or connect on LinkedIn: www.linkedin.com/in/shazsayee';
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user' as const, text: input };
    const aiResponse = { role: 'ai' as const, text: handleAIResponse(input) };

    setMessages(prev => [...prev, userMsg, aiResponse]);
    setInput('');
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
          Chat With Us
        </h2>
        <p className="text-lg text-gray-300">
          24/7 AI-powered support + human team
        </p>
      </div>

      <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-2xl p-8 border border-purple-500/30 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Bot className="w-10 h-10 text-purple-400" />
          <h3 className="text-2xl font-bold text-white">AI Partner Support Agent</h3>
        </div>
        <p className="text-gray-300 mb-6">
          Get instant answers about AiC tokens, swaps, Arc Network, and partnerships from our intelligent AI agent trained on all platform knowledge.
        </p>
        <button
          onClick={() => setShowAIChat(!showAIChat)}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-lg font-bold hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all flex items-center justify-center gap-2"
        >
          <Bot className="w-5 h-5" />
          {showAIChat ? 'Close AI Agent' : 'Chat with AI Agent'}
        </button>

        {showAIChat && (
          <div className="mt-6 bg-gray-900/50 rounded-xl border border-purple-500/30 overflow-hidden">
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user'
                      ? 'bg-cyan-500/20 border border-cyan-500/30 text-white'
                      : 'bg-purple-500/20 border border-purple-500/30 text-gray-200'
                  }`}>
                    {msg.role === 'ai' && <Bot className="w-4 h-4 inline mr-2 text-purple-400" />}
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-purple-500/30 p-4 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about AiC tokens, swaps, partnerships..."
                className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg border border-purple-500/30 focus:border-purple-500 focus:outline-none"
              />
              <button
                onClick={sendMessage}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-2xl p-8 border border-cyan-500/30">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="w-10 h-10 text-cyan-400" />
            <h3 className="text-2xl font-bold text-white">Live Chat Support</h3>
          </div>
          <p className="text-gray-300 mb-6">
            Get instant help from our team. We're here to assist you with any questions about earning AiC tokens, swapping to USDC, or using our platform features.
          </p>
          <div className="bg-cyan-500/20 rounded-xl p-4 border border-cyan-500/30 mb-6">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">Availability</span>
            </div>
            <p className="text-white font-bold text-lg">24/7 Support</p>
            <p className="text-gray-300 text-sm">We're always here to help you</p>
          </div>
          <a
            href="mailto:shaz@aictokenwordgame.com?subject=Support Request"
            className="block w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-lg font-bold text-center hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all"
          >
            <div className="flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Start Chat Now
            </div>
          </a>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-2xl p-8 border border-blue-500/30">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="w-10 h-10 text-blue-400" />
            <h3 className="text-2xl font-bold text-white">Email Support</h3>
          </div>
          <p className="text-gray-300 mb-6">
            Prefer email? Send us a detailed message and we'll get back to you within 24 hours.
          </p>
          <div className="space-y-4 mb-6">
            <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-500/30">
              <p className="text-blue-400 font-semibold mb-1">General Inquiries</p>
              <a
                href="mailto:shaz@aictokenwordgame.com"
                className="text-white hover:text-blue-300 transition-colors break-all"
              >
                shaz@aictokenwordgame.com
              </a>
            </div>
            <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-500/30">
              <p className="text-blue-400 font-semibold mb-1">Partnership Requests</p>
              <a
                href="mailto:shaz@aictokenwordgame.com?subject=Partnership Inquiry"
                className="text-white hover:text-blue-300 transition-colors break-all"
              >
                shaz@aictokenwordgame.com
              </a>
            </div>
          </div>
          <a
            href="mailto:shaz@aictokenwordgame.com"
            className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-bold text-center hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all"
          >
            <div className="flex items-center justify-center gap-2">
              <Mail className="w-5 h-5" />
              Send Email
            </div>
          </a>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30">
          <h4 className="text-lg font-bold text-white mb-4">Technical Support</h4>
          <p className="text-gray-300 text-sm mb-4">
            Help with wallet connection, transactions, swaps, or any technical issues.
          </p>
          <p className="text-cyan-400 text-sm">Response time: Immediate</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30">
          <h4 className="text-lg font-bold text-white mb-4">Game & Earning</h4>
          <p className="text-gray-300 text-sm mb-4">
            Questions about the vocabulary game, earning AiC tokens, or rewards.
          </p>
          <p className="text-cyan-400 text-sm">Response time: Immediate</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30">
          <h4 className="text-lg font-bold text-white mb-4">Partnership Inquiries</h4>
          <p className="text-gray-300 text-sm mb-4">
            Business partnerships, integrations, or collaboration opportunities.
          </p>
          <p className="text-cyan-400 text-sm">Response time: Within 24 hours</p>
        </div>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Connect With Our Team</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="text-center">
            <p className="text-gray-400 mb-3">Founder & Developer</p>
            <p className="text-white font-bold text-lg mb-4">Shazia Sayeed</p>
            <div className="flex flex-col gap-3">
              <a
                href="https://www.linkedin.com/in/shazsayee"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Connect on LinkedIn
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/SayeedMr1038"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Follow on Twitter
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-xl p-6 border border-cyan-500/20">
            <h4 className="text-lg font-bold text-cyan-400 mb-4">Quick Response Guarantee</h4>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">✓</span>
                <span>Technical issues: Immediate response</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">✓</span>
                <span>General questions: Within 1 hour</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">✓</span>
                <span>Partnership inquiries: Within 24 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">✓</span>
                <span>Available 24/7 via email and chat</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-2xl p-8 border border-cyan-500/30 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Need Immediate Help?</h3>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Our team is standing by 24/7 to help you with any questions or issues. Don't hesitate to reach out!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:shaz@aictokenwordgame.com?subject=Urgent Support Request"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-600 text-white px-8 py-4 rounded-lg font-bold hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-all"
          >
            <Phone className="w-5 h-5" />
            Urgent Support
          </a>
          <a
            href="mailto:shaz@aictokenwordgame.com"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-lg font-bold hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            Start Conversation
          </a>
        </div>
      </div>
    </div>
  );
}
