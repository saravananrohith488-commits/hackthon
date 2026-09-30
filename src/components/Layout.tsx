import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Search, Network, GitCompare, History, BookOpen, Settings, Zap, CheckCircle, Sparkles } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [demoStatus, setDemoStatus] = useState<string>("● AI Engine Online (Demo Mode)");
  const [isDemoLoading, setIsDemoLoading] = useState<boolean>(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Shield, emoji: '🏠' },
    { path: '/analyze', label: 'Analyze Email', icon: Search, emoji: '🔬' },
    { path: '/graph', label: 'Attack Graph', icon: Network, emoji: '🕸️' },
    { path: '/compare', label: 'Compare Emails', icon: GitCompare, emoji: '⚖️' },
    { path: '/history', label: 'Threat History', icon: History, emoji: '📜' },
    { path: '/methodology', label: 'Methodology', icon: BookOpen, emoji: '📐' },
    { path: '/settings', label: 'Settings', icon: Settings, emoji: '⚙️' },
  ];

  const handleQuickDemo = async () => {
    setIsDemoLoading(true);
    try {
      const res = await fetch('/api/demo/load', { method: 'POST' });
      const data = await res.json();
      setIsDemoLoading(false);
      // Navigate directly to analyze email with demo loaded
      navigate('/analyze', { state: { demoEmail: data.featured_email } });
    } catch (err) {
      console.error(err);
      setIsDemoLoading(false);
      navigate('/analyze');
    }
  };

  return (
    <div className="min-h-screen bg-confetti-grid flex flex-col md:flex-row relative">
      {/* Floating Ambient Color Balloons */}
      <div className="fixed top-12 left-12 w-64 h-64 bg-[#FF5DA2]/20 rounded-full blur-3xl pointer-events-none animate-float-slow z-0"></div>
      <div className="fixed bottom-16 right-20 w-80 h-80 bg-[#FFD23F]/25 rounded-full blur-3xl pointer-events-none animate-float-delayed z-0"></div>
      <div className="fixed top-1/2 left-1/3 w-72 h-72 bg-[#2EC4B6]/20 rounded-full blur-3xl pointer-events-none animate-float-slow z-0"></div>

      {/* Sidebar Navigation (Goofy Sticker Corkboard Panel) */}
      <aside className="w-full md:w-72 bg-[#FFFDF9] border-b-4 md:border-b-0 md:border-r-4 border-[#241A3D] p-5 flex flex-col justify-between z-10 shadow-[4px_0px_0px_#241A3D] relative">
        {/* Top Washi Tape */}
        <div className="hidden md:block absolute -top-3 left-10 w-28 h-6 washi-tape-pink transform -rotate-3"></div>

        <div>
          {/* Logo & Branding */}
          <div className="flex items-center gap-3 mb-6 p-2 bg-[#FFF8EF] border-3 border-[#241A3D] rounded-2xl shadow-[3px_3px_0px_#241A3D]">
            <div className="w-11 h-11 bg-[#FF5DA2] border-2 border-[#241A3D] rounded-xl flex items-center justify-center text-2xl shadow-[2px_2px_0px_#241A3D]">
              🛡️
            </div>
            <div>
              <h1 className="font-fredoka text-2xl text-[#241A3D] leading-none tracking-tight">
                BHASHASHIELD
              </h1>
              <span className="font-caveat text-sm font-bold text-[#FF5DA2]">
                Multilingual AI Threat Defense 🕵️
              </span>
            </div>
          </div>

          {/* Quick Demo Trigger Button for Hackathon Judges */}
          <button
            onClick={handleQuickDemo}
            disabled={isDemoLoading}
            className="w-full mb-6 p-3 bg-gradient-to-r from-[#FF5DA2] via-[#FFD23F] to-[#2EC4B6] text-[#241A3D] font-fredoka text-sm font-bold rounded-2xl border-3 border-[#241A3D] shadow-sticker hover:shadow-sticker-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-[#FFD23F] text-[#241A3D]" />
            {isDemoLoading ? 'Loading Story...' : '⚡ Quick Demo Scenario'}
          </button>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              // Slightly alternate tilt per nav item for corkboard feel!
              const tilts = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2'];
              const tilt = tilts[idx % tilts.length];

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border-2 border-[#241A3D] font-fredoka text-sm transition-all ${tilt} ${
                    isActive
                      ? 'bg-[#FF5DA2] text-white shadow-[3px_3px_0px_#241A3D] scale-[1.02] font-bold'
                      : 'bg-[#FFF3E4] text-[#241A3D] hover:bg-[#FFD23F] hover:shadow-[3px_3px_0px_#241A3D]'
                  }`}
                >
                  <span className="text-lg">{item.emoji}</span>
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* System Status Footer */}
        <div className="mt-8 pt-4 border-t-2 border-dashed border-[#241A3D]">
          <div className="p-3 bg-[#FFF3E4] border-2 border-[#241A3D] rounded-2xl shadow-[2px_2px_0px_#241A3D] text-xs font-mono font-bold text-[#241A3D] flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[#06D6A0]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#06D6A0] animate-pulse"></span>
              AI Engine Online
            </span>
            <span className="px-2 py-0.5 bg-[#FFD23F] rounded border border-[#241A3D] text-[10px]">
              DEMO
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 z-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};
