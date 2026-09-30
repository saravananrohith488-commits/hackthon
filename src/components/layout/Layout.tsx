import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  Dna,
  GitCompare,
  Link2,
  Server,
  Share2,
  FolderSearch,
  FileText,
  History,
  Settings,
  Bell,
  Search,
  ShieldCheck
} from 'lucide-react';

import { Bot } from 'lucide-react';
import { ChittiChatWidget } from '../ChittiChatWidget';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/attack-history?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navGroups = [
    {
      group: "MAIN",
      items: [
        { name: "Command Center", path: "/", icon: LayoutDashboard },
        { name: "CHITTI AI Assistant", path: "/chitti-ai", icon: Bot, badge: "AI CHAT" },
        { name: "Investigations", path: "/investigations", icon: FolderSearch },
      ]
    },
    {
      group: "INTELLIGENCE",
      items: [
        { name: "BhashaShield Engine", path: "/bhashashield", icon: ShieldAlert },
        { name: "Attack DNA", path: "/attack-dna", icon: Dna },
        { name: "Mutation Trace", path: "/mutation-trace", icon: GitCompare, badge: "NOVELTY" },
        { name: "URL Intelligence", path: "/url-intelligence", icon: Link2 },
        { name: "Infrastructure", path: "/infrastructure", icon: Server },
      ]
    },
    {
      group: "ANALYSIS & FORENSICS",
      items: [
        { name: "Campaign Graph", path: "/campaign-graph", icon: Share2 },
        { name: "Attack History", path: "/attack-history", icon: History },
        { name: "Forensic Reports", path: "/reports", icon: FileText },
      ]
    }
  ];

  const getBreadcrumb = () => {
    const currentPath = location.pathname;
    if (currentPath === '/') return 'SENTINALS / COMMAND CENTER';
    const cleanName = currentPath.substring(1).replace('-', ' ').toUpperCase();
    return `SENTINALS / ${cleanName}`;
  };

  return (
    <div className="flex h-screen bg-[#0A0B0A] text-[#EEF0EA] overflow-hidden font-sans select-none relative">
      {/* FIXED LEFT SIDEBAR (~258px) */}
      <aside className="w-[258px] border-r border-[#23261F] bg-[#131513] flex flex-col justify-between z-20 shrink-0">
        <div>
          {/* Brand Mark & Tagline */}
          <div className="p-4 border-b border-[#23261F]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#34D399] to-[#0F3D2E] flex items-center justify-center text-[#0A0B0A] shadow-sm">
                <ShieldCheck className="w-5 h-5 stroke-[2.2] text-[#0A0B0A]" />
              </div>
              <div>
                <span className="font-grotesk font-bold text-base tracking-tight text-[#EEF0EA]">Sentinals</span>
                <span className="block text-[10px] font-mono text-[#34D399] leading-none mt-0.5">SOC INTELLIGENCE</span>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-[#9BA096] italic font-sans leading-snug">
              "Trace the Attack. Understand the Mutation."
            </p>
          </div>

          {/* Navigation Groups */}
          <nav className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-190px)]">
            {navGroups.map((group, idx) => (
              <div key={idx}>
                <div className="px-2 mb-1.5 text-[10px] font-mono font-semibold tracking-wider text-[#62675C] uppercase">
                  {group.group}
                </div>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 border ${
                          isActive
                            ? "bg-[#0E2019] text-[#34D399] border-[#0F3D2E] font-semibold"
                            : "text-[#9BA096] border-transparent hover:bg-[#191B18] hover:text-[#EEF0EA]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 stroke-[2] ${isActive ? "text-[#34D399]" : "text-[#62675C]"}`} />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[9px] font-mono font-bold tracking-wider uppercase px-1.5 py-0.2 rounded-full bg-[#0E2019] text-[#34D399] border border-[#0F3D2E]">
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer: Model Status & Analyst Profile */}
        <div className="p-3 border-t border-[#23261F] bg-[#191B18] space-y-2">
          <NavLink
            to="/settings"
            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
              location.pathname === '/settings' 
                ? 'bg-[#0E2019] text-[#34D399] border-[#0F3D2E]' 
                : 'text-[#9BA096] border-transparent hover:bg-[#1E211D] hover:text-[#EEF0EA]'
            }`}
          >
            <Settings className="w-4 h-4 text-[#62675C]" />
            <span>System Settings</span>
          </NavLink>

          {/* Model Status Indicator with Pulsing Ring */}
          <div className="flex items-center justify-between px-2.5 py-1.5 bg-[#131513] border border-[#23261F] rounded-lg">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34D399]"></span>
              </span>
              <span className="text-[11px] font-mono text-[#EEF0EA]">Multilingual Engine Online</span>
            </div>
            <span className="text-[10px] font-mono text-[#62675C]">v2.4</span>
          </div>

          {/* Analyst Profile */}
          <div className="flex items-center gap-2 px-2.5 pt-1">
            <div className="w-6 h-6 rounded-full bg-[#1E211D] border border-[#31352C] flex items-center justify-center text-[#34D399] font-mono font-bold text-[10px]">
              SA
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-semibold text-[#EEF0EA] leading-tight">SOC Analyst</span>
              <span className="text-[10px] font-mono text-[#62675C] leading-tight">secops@sentinals.net</span>
            </div>
          </div>
        </div>
      </aside>

      {/* RIGHT CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* TOP BAR */}
        <header className="h-12 border-b border-[#23261F] bg-[#131513] px-6 flex items-center justify-between z-10">
          {/* Monospace Slash-Separated Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#9BA096]">
            <span className="font-semibold text-[#34D399]">{getBreadcrumb()}</span>
          </div>

          {/* Global Search Input & Controls */}
          <div className="flex items-center gap-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#62675C]" />
              <input
                type="text"
                placeholder="Search Attack ID, Hash, Domain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-8 pr-8 py-1 rounded-lg border border-[#23261F] bg-[#191B18] text-xs font-mono text-[#EEF0EA] placeholder-[#62675C] focus:outline-none focus:border-[#0F3D2E] focus:bg-[#1E211D] transition"
              />
              <span className="absolute right-2.5 top-2 text-[10px] font-mono text-[#62675C] bg-[#131513] px-1 rounded border border-[#23261F]">⌘K</span>
            </form>

            <div className="h-4 w-px bg-[#23261F]"></div>

            {/* Notification Bell */}
            <button className="relative p-1.5 text-[#9BA096] hover:text-[#EEF0EA] transition">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#F0554A]"></span>
            </button>

            {/* Live Node Pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#0E2019] border border-[#0F3D2E] rounded-full text-xs text-[#34D399]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]"></span>
              <span className="text-[10px] font-mono">Sentinals Node #01</span>
            </div>
          </div>
        </header>

        {/* MAIN WORKSPACE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#0A0B0A]">
          {children}
        </main>
      </div>

      {/* FLOATING CHITTI AI CHATBOT WIDGET */}
      <ChittiChatWidget />
    </div>
  );
};
