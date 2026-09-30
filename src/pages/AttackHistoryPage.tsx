import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { History, Search, ArrowUpRight } from 'lucide-react';
import { AnalysisResult } from '../types';
import { apiService } from '../services/api';

export const AttackHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [attacks, setAttacks] = useState<AnalysisResult[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [langFilter, setLangFilter] = useState<string>('All');
  const [riskFilter, setRiskFilter] = useState<string>('All');

  useEffect(() => {
    apiService.getThreatHistory()
      .then(data => setAttacks(data))
      .catch(err => console.error(err));
  }, []);

  const filteredAttacks = attacks.filter(a => {
    const matchesSearch = !searchQuery || 
      a.email_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.campaign_id && a.campaign_id.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLang = langFilter === 'All' || a.language.toLowerCase() === langFilter.toLowerCase();
    const score = a.risk_score ?? a.threat_score ?? 0;
    const cls = a.classification || (score > 45 ? 'RISKY' : 'SAFE');
    const matchesRisk = riskFilter === 'All' || cls.toLowerCase() === riskFilter.toLowerCase();

    return matchesSearch && matchesLang && matchesRisk;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* PAGE HEADER */}
      <div className="pb-4 border-b border-[#23261F] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-grotesk font-bold text-[#EEF0EA] tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-[#34D399]" />
            Attack History Intelligence Database
          </h1>
          <p className="text-xs text-[#9BA096] font-sans mt-0.5">
            Searchable repository of ingested multilingual phishing samples and historical campaign vectors.
          </p>
        </div>

        {/* FILTERS & SEARCH */}
        <div className="flex items-center gap-3 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-[#62675C]" />
            <input
              type="text"
              placeholder="Search attacks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 border border-[#23261F] rounded-lg bg-[#191B18] text-xs font-mono text-[#EEF0EA] placeholder-[#62675C]"
            />
          </div>

          <select
            value={langFilter}
            onChange={(e) => setLangFilter(e.target.value)}
            className="px-2.5 py-1 border border-[#23261F] rounded-lg bg-[#191B18] text-xs font-mono text-[#EEF0EA]"
          >
            <option value="All">All Languages</option>
            <option value="English">English</option>
            <option value="Tamil">Tamil</option>
            <option value="Tanglish">Tanglish</option>
            <option value="Hindi">Hindi</option>
            <option value="Hinglish">Hinglish</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-2.5 py-1 border border-[#23261F] rounded-lg bg-[#191B18] text-xs font-mono text-[#EEF0EA]"
          >
            <option value="All">All Classifications</option>
            <option value="RISKY">RISKY (&gt; 45)</option>
            <option value="SAFE">SAFE (0–45)</option>
          </select>
        </div>
      </div>

      {/* SEARCHABLE DATA TABLE */}
      <div className="bg-[#131513] border border-[#23261F] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#23261F] pb-2">
          <span className="text-xs font-mono font-bold text-[#EEF0EA] uppercase">Dataset Records ({filteredAttacks.length})</span>
          <span className="text-[11px] font-mono text-[#62675C]">Source: bhashashield_batch1.csv</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead>
              <tr className="bg-[#191B18] border-b border-[#23261F] font-mono uppercase text-[#62675C] text-[10px]">
                <th className="py-2.5 px-3">Attack ID</th>
                <th className="py-2.5 px-3">Subject / Content</th>
                <th className="py-2.5 px-3">Language</th>
                <th className="py-2.5 px-3">Classification</th>
                <th className="py-2.5 px-3">Campaign</th>
                <th className="py-2.5 px-3">Mutation</th>
                <th className="py-2.5 px-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#23261F]">
              {filteredAttacks.map((attack) => {
                const score = attack.risk_score ?? attack.threat_score ?? 0;
                const cls = attack.classification || (score > 45 ? 'RISKY' : 'SAFE');
                const isRisky = cls === 'RISKY' || score > 45;
                return (
                <tr key={attack.email_id} className="soc-table-row">
                  <td className="py-2.5 px-3 font-mono font-bold text-[#EEF0EA]">{attack.email_id}</td>
                  <td className="py-2.5 px-3 max-w-sm truncate text-[#9BA096] font-medium">{attack.subject}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-[#191B18] border border-[#23261F] text-[10px] font-mono text-[#9BA096]">
                      {attack.language}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase ${
                      isRisky
                        ? 'bg-[#211110] text-[#F0554A] border border-[#3D1815]'
                        : 'bg-[#0E2019] text-[#34D399] border border-[#0F3D2E]'
                    }`}>
                      {cls} ({score})
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-[#62675C]">{attack.campaign_id || '—'}</td>
                  <td className="py-2.5 px-3">
                    {attack.mutation_detected ? (
                      <span className="text-[#34D399] font-mono font-bold text-[11px]">MUTATED</span>
                    ) : (
                      <span className="text-[#62675C] font-mono text-[11px]">BASELINE</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => navigate(`/investigations?id=${attack.email_id}`)}
                      className="text-[#34D399] hover:underline font-mono text-[11px] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>INSPECT</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
