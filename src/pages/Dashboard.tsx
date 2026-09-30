import React, { useEffect, useState } from 'react';
import { AnalysisResult, CampaignSummary } from '../types';
import { Shield, AlertTriangle, Network, Globe, Flame, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const [emails, setEmails] = useState<AnalysisResult[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [emRes, campRes] = await Promise.all([
        fetch('/api/threat-history'),
        fetch('/api/campaigns')
      ]);
      const emData = await emRes.json();
      const campData = await campRes.json();
      setEmails(emData);
      setCampaigns(campData);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalAnalyzed = emails.length;
  const threatsDetected = emails.filter(e => (e.classification || e.threat_level) === 'RISKY' || (e.risk_score ?? e.threat_score ?? 0) > 45).length;
  const activeCampaigns = campaigns.length;
  const mutationsDetected = emails.filter(e => e.mutation_detected).length;
  const languagesCount = new Set(emails.map(e => e.language)).size;
  const criticalThreats = threatsDetected;

  const metricCards = [
    { title: 'Total Analyzed', value: totalAnalyzed, icon: '📩', color: 'bg-[#FFFDF9]', tilt: '-rotate-2', tape: 'washi-tape-pink' },
    { title: 'Threats Detected', value: threatsDetected, icon: '🚨', color: 'bg-[#FFEBEB]', tilt: 'rotate-1', tape: 'washi-tape-teal' },
    { title: 'Active Campaigns', value: activeCampaigns, icon: '🎯', color: 'bg-[#FFF3E4]', tilt: '-rotate-1', tape: 'washi-tape-pink' },
    { title: 'Mutations Found', value: mutationsDetected, icon: '🧬', color: 'bg-[#F0FDF4]', tilt: 'rotate-2', tape: 'washi-tape-teal' },
    { title: 'Languages', value: `${languagesCount} Languages`, icon: '🌐', color: 'bg-[#FFFDF9]', tilt: '-rotate-2', tape: 'washi-tape-pink' },
    { title: 'Critical Risk', value: criticalThreats, icon: '⚡', color: 'bg-[#FFEBEB]', tilt: 'rotate-1', tape: 'washi-tape-teal' },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFD23F] border-2 border-[#241A3D] rounded-full text-xs font-bold font-mono text-[#241A3D] mb-2 shadow-[2px_2px_0px_#241A3D]">
          <span>🕵️ COMMAND CENTER CORKBOARD</span>
        </div>
        <h1 className="font-fredoka text-4xl text-[#241A3D] squiggly-line inline-block">
          BhashaShield Cyber Intelligence
        </h1>
        <p className="font-caveat text-2xl text-[#FF5DA2] mt-1">
          "Tracking email threat DNA & multilingual scam mutations in real time! 🧬"
        </p>
      </div>

      {/* Top 6 Clumsy Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metricCards.map((card, idx) => (
          <div
            key={idx}
            className={`relative p-5 ${card.color} border-[3px] border-[#241A3D] rounded-3xl shadow-sticker sticker-card transform ${card.tilt}`}
          >
            {/* Corner Washi Tape */}
            <div className={`absolute -top-2.5 left-4 w-16 h-4 ${card.tape} transform -rotate-6`}></div>

            <div className="text-2xl mb-2">{card.icon}</div>
            <div className="font-fredoka text-2xl text-[#241A3D] font-bold">{card.value}</div>
            <div className="font-mono text-xs text-[#241A3D]/80 font-bold mt-1 uppercase">{card.title}</div>
          </div>
        ))}
      </div>

      {/* Main Grid: Active Campaigns & Language Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Active Campaigns Cards (7 Cols) */}
        <div className="lg:col-span-7 bg-[#FFFDF9] border-[3px] border-[#241A3D] rounded-3xl p-6 shadow-sticker relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-fredoka text-2xl text-[#241A3D]">Active Threat Campaigns</h2>
              <p className="font-caveat text-lg text-[#FF5DA2]">"Tracked across languages & infrastructure shifts"</p>
            </div>
            <Link to="/graph" className="font-mono text-xs font-bold text-[#241A3D] underline flex items-center gap-1">
              View Graph <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                className="p-4 bg-[#FFF8EF] border-2 border-[#241A3D] rounded-2xl shadow-[3px_3px_0px_#241A3D] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#FF5DA2] text-white border border-[#241A3D] rounded-md">
                      {camp.id}
                    </span>
                    <span className="font-fredoka text-lg text-[#241A3D] font-bold">{camp.name}</span>
                  </div>
                  <div className="text-xs font-nunito text-[#241A3D]/80 flex flex-wrap items-center gap-3">
                    <span>📩 {camp.email_count} Emails</span>
                    <span>🧬 {camp.mutation_count} Mutations</span>
                    <span className="font-mono font-bold text-[#FF5A5F]">{camp.max_threat_level}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {camp.languages.map((lang, lidx) => (
                    <span key={lidx} className="px-2 py-0.5 bg-[#FFD23F] text-[#241A3D] font-mono text-[11px] font-bold border border-[#241A3D] rounded-full">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Multilingual Distribution (5 Cols) */}
        <div className="lg:col-span-5 bg-[#FFFDF9] border-[3px] border-[#241A3D] rounded-3xl p-6 shadow-sticker relative">
          <h2 className="font-fredoka text-2xl text-[#241A3D] mb-1">Multilingual Distribution</h2>
          <p className="font-caveat text-lg text-[#FF5DA2] mb-4">"Zero translation dependency — pure semantic understanding!"</p>

          <div className="space-y-4 font-mono text-xs">
            {[
              { name: 'English', count: 3, pct: 33, color: 'bg-[#FF5DA2]' },
              { name: 'Tamil (தமிழ்)', count: 2, pct: 22, color: 'bg-[#FFD23F]' },
              { name: 'Tanglish (Tamil-Latin)', count: 1, pct: 15, color: 'bg-[#2EC4B6]' },
              { name: 'Hindi (हिंदी)', count: 2, pct: 22, color: 'bg-[#FFA630]' },
              { name: 'Hinglish (Hindi-Latin)', count: 1, pct: 15, color: 'bg-[#06D6A0]' },
            ].map((l, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between font-bold text-[#241A3D]">
                  <span>{l.name}</span>
                  <span>{l.pct}% ({l.count} emails)</span>
                </div>
                <div className="w-full h-3 bg-[#FFF3E4] border-2 border-[#241A3D] rounded-full overflow-hidden">
                  <div className={`h-full ${l.color}`} style={{ width: `${l.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Threats Table */}
      <div className="bg-[#FFFDF9] border-[3px] border-[#241A3D] rounded-3xl p-6 shadow-sticker relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-fredoka text-2xl text-[#241A3D]">Recent Threat Intelligence Log</h2>
          <Link to="/history" className="font-mono text-xs font-bold text-[#241A3D] underline">
            View All History
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-nunito border-collapse">
            <thead>
              <tr className="border-b-3 border-[#241A3D] bg-[#FFF8EF] font-mono text-xs font-bold text-[#241A3D]">
                <th className="p-3">EMAIL ID</th>
                <th className="p-3">LANGUAGE</th>
                <th className="p-3">ATTACK TYPE</th>
                <th className="p-3">THREAT SCORE</th>
                <th className="p-3">MUTATION?</th>
                <th className="p-3">CAMPAIGN</th>
              </tr>
            </thead>
            <tbody>
              {emails.map((e) => (
                <tr key={e.email_id} className="border-b border-[#241A3D]/20 hover:bg-[#FFF3E4] transition-colors text-sm">
                  <td className="p-3 font-mono font-bold text-[#FF5DA2]">{e.email_id}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-[#FFD23F] font-mono text-xs font-bold border border-[#241A3D] rounded-full">
                      {e.language}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-[#241A3D]">{e.attack_type}</td>
                  <td className="p-3">
                    {(() => {
                      const score = e.risk_score ?? e.threat_score ?? 0;
                      const cls = e.classification || (score > 45 ? 'RISKY' : 'SAFE');
                      const isRisky = cls === 'RISKY' || score > 45;
                      return (
                        <span className={`px-2.5 py-1 font-mono text-xs font-bold rounded-full border border-[#241A3D] ${
                          isRisky ? 'bg-[#FF5A5F] text-white' : 'bg-[#06D6A0] text-white'
                        }`}>
                          {score}/100 ({cls})
                        </span>
                      );
                    })()}
                  </td>
                  <td className="p-3">
                    {e.mutation_detected ? (
                      <span className="font-mono text-xs font-bold text-[#FF5DA2] bg-[#FFEBEB] px-2 py-0.5 border border-[#241A3D] rounded-md">
                        🧬 MUTATED
                      </span>
                    ) : (
                      <span className="font-mono text-xs text-[#241A3D]/50">Original</span>
                    )}
                  </td>
                  <td className="p-3 font-mono text-xs font-bold text-[#241A3D]">{e.campaign_id || 'None'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
