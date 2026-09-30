import React, { useEffect, useState } from 'react';
import { AnalysisResult } from '../types';
import { History, Search, Filter, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ThreatHistory: React.FC = () => {
  const [emails, setEmails] = useState<AnalysisResult[]>([]);
  const [search, setSearch] = useState<string>('');
  const [langFilter, setLangFilter] = useState<string>('All');
  const [levelFilter, setLevelFilter] = useState<string>('All');

  useEffect(() => {
    fetchEmails();
  }, [langFilter, levelFilter]);

  const fetchEmails = async () => {
    try {
      const url = `/api/threat-history?language=${langFilter}&threat_level=${levelFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      setEmails(data);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = emails.filter(e => 
    e.subject.toLowerCase().includes(search.toLowerCase()) ||
    e.sender.toLowerCase().includes(search.toLowerCase()) ||
    e.email_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF5DA2] text-white border-2 border-[#241A3D] rounded-full text-xs font-bold font-mono shadow-[2px_2px_0px_#241A3D] mb-2">
          <span>📜 THREAT INTELLIGENCE LOG</span>
        </div>
        <h1 className="font-fredoka text-4xl text-[#241A3D] squiggly-line inline-block">
          Threat Analysis History
        </h1>
        <p className="font-caveat text-2xl text-[#FF5DA2] mt-1">
          "Search & filter past analyzed email attacks across languages! 🔍"
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-[#FFFDF9] border-[3px] border-[#241A3D] rounded-3xl shadow-sticker flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#241A3D] absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search email ID, subject, sender address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#FFF8EF] border-2 border-[#241A3D] rounded-2xl font-mono text-xs focus:outline-none focus:border-[#FF5DA2]"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <select
            value={langFilter}
            onChange={(e) => setLangFilter(e.target.value)}
            className="p-2.5 bg-[#FFF8EF] border-2 border-[#241A3D] rounded-2xl font-mono text-xs font-bold text-[#241A3D]"
          >
            <option value="All">All Languages</option>
            <option value="English">English</option>
            <option value="Tamil">Tamil</option>
            <option value="Tanglish">Tanglish</option>
            <option value="Hindi">Hindi</option>
            <option value="Hinglish">Hinglish</option>
          </select>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="p-2.5 bg-[#FFF8EF] border-2 border-[#241A3D] rounded-2xl font-mono text-xs font-bold text-[#241A3D]"
          >
            <option value="All">All Classifications</option>
            <option value="RISKY">RISKY (&gt; 45)</option>
            <option value="SAFE">SAFE (0–45)</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-[#FFFDF9] border-[3px] border-[#241A3D] rounded-3xl p-6 shadow-sticker overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-nunito border-collapse">
            <thead>
              <tr className="border-b-3 border-[#241A3D] bg-[#FFF8EF] font-mono text-xs font-bold text-[#241A3D]">
                <th className="p-3">EMAIL ID</th>
                <th className="p-3">LANGUAGE</th>
                <th className="p-3">SENDER</th>
                <th className="p-3">SUBJECT</th>
                <th className="p-3">RISK SCORE</th>
                <th className="p-3">MUTATED?</th>
                <th className="p-3">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.email_id} className="border-b border-[#241A3D]/20 hover:bg-[#FFF3E4] transition-colors text-sm">
                  <td className="p-3 font-mono font-bold text-[#FF5DA2]">{e.email_id}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 bg-[#FFD23F] font-mono text-xs font-bold border border-[#241A3D] rounded-full">
                      {e.language}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-xs font-bold text-[#241A3D] truncate max-w-[180px]">{e.sender}</td>
                  <td className="p-3 font-semibold text-[#241A3D] truncate max-w-[240px]">{e.subject}</td>
                  <td className="p-3">
                    {(() => {
                      const score = e.risk_score ?? e.threat_score ?? 0;
                      const cls = e.classification || (score > 45 ? 'RISKY' : 'SAFE');
                      const isRisky = cls === 'RISKY' || score > 45;
                      return (
                        <span className={`px-2 py-0.5 font-mono text-xs font-bold rounded-full border border-[#241A3D] ${
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
                  <td className="p-3">
                    <Link
                      to="/analyze"
                      state={{ demoEmail: e }}
                      className="px-2.5 py-1 bg-[#2EC4B6] text-white font-mono text-xs font-bold rounded-xl border border-[#241A3D] shadow-[2px_2px_0px_#241A3D] inline-flex items-center gap-1"
                    >
                      Inspect <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
