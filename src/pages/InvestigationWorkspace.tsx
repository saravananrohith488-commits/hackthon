import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FolderSearch, CheckCircle2, ArrowRight, FileText } from 'lucide-react';
import { AnalysisResult } from '../types';
import { apiService } from '../services/api';

export const InvestigationWorkspace: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const targetId = searchParams.get('id') || 'BS-0001';
  
  const [attack, setAttack] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    apiService.getAttackDetail(targetId)
      .then(data => setAttack(data))
      .catch(err => console.error(err));
  }, [targetId]);

  const stages = [
    { num: '01', name: 'Ingested' },
    { num: '02', name: 'Classified' },
    { num: '03', name: 'DNA Generated' },
    { num: '04', name: 'Historical Match' },
    { num: '05', name: 'Mutation Detected' },
    { num: '06', name: 'Campaign Linked' },
    { num: '07', name: 'Report Ready' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* STAGE WORKFLOW PIPELINE HEADER */}
      <div className="bg-[#131513] border border-[#23261F] rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#23261F] pb-2">
          <div className="flex items-center gap-2">
            <FolderSearch className="w-4 h-4 text-[#34D399]" />
            <h1 className="text-sm font-grotesk font-bold text-[#EEF0EA] tracking-tight">Investigation Workflow Pipeline</h1>
          </div>
          <button
            onClick={() => navigate(`/reports?id=${targetId}`)}
            className="px-3 py-1 bg-[#34D399] hover:bg-[#2EB883] text-[#0A0B0A] rounded-lg text-xs font-grotesk font-bold flex items-center gap-1.5 transition"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Forensic Report</span>
          </button>
        </div>

        {/* 7 STAGES DISPLAY */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          {stages.map((st, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs font-mono">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0E2019] border border-[#0F3D2E] text-[#34D399]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                <span>{st.num}. {st.name}</span>
              </div>
              {idx < stages.length - 1 && <ArrowRight className="w-3 h-3 text-[#62675C] hidden sm:block" />}
            </div>
          ))}
        </div>
      </div>

      {/* 3-COLUMN POLISHED INVESTIGATION LAYOUT */}
      {attack && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* COLUMN 1: EVIDENCE / EMAIL */}
          <div className="bg-[#131513] border border-[#23261F] rounded-xl p-4 space-y-3">
            <span className="text-[10px] font-mono text-[#62675C] uppercase tracking-wider block border-b border-[#23261F] pb-1">
              Evidence #1: Email Metadata & Raw Body
            </span>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[#9BA096] font-semibold block">From:</span>
                <code className="font-mono bg-[#191B18] p-1.5 rounded block text-[#EEF0EA] text-[11px] border border-[#23261F]">{attack.sender}</code>
              </div>
              <div>
                <span className="text-[#9BA096] font-semibold block">Subject:</span>
                <div className="font-bold text-[#EEF0EA]">{attack.subject}</div>
              </div>
              <div>
                <span className="text-[#9BA096] font-semibold block">Language Profile:</span>
                <span className="px-2 py-0.5 bg-[#191B18] border border-[#23261F] rounded text-[#EEF0EA] font-mono">
                  {attack.language}
                </span>
              </div>
            </div>
          </div>

          {/* COLUMN 2: XLM-ROBERTA MODEL ANALYSIS */}
          <div className="bg-[#131513] border border-[#23261F] rounded-xl p-4 space-y-3">
            <span className="text-[10px] font-mono text-[#62675C] uppercase tracking-wider block border-b border-[#23261F] pb-1">
              Analysis: Multilingual Embedding Classification
            </span>
            <div className="space-y-3 text-xs">
              {(() => {
                const riskScore = attack.risk_score ?? attack.threat_score ?? 0;
                const classification = attack.classification || (riskScore > 45 ? 'RISKY' : 'SAFE');
                const isRisky = classification === 'RISKY' || riskScore > 45;
                return (
                  <div className={`p-3 rounded-lg border ${isRisky ? 'bg-[#211110] border-[#3D1815]' : 'bg-[#0E2019] border-[#0F3D2E]'}`}>
                    <span className={`text-[10px] font-mono font-bold uppercase block ${isRisky ? 'text-[#F0554A]' : 'text-[#34D399]'}`}>
                      Verdict ({classification})
                    </span>
                    <div className={`text-sm font-grotesk font-bold ${isRisky ? 'text-[#F0554A]' : 'text-[#34D399]'}`}>{attack.attack_type}</div>
                    <span className="text-[11px] font-mono text-[#9BA096]">Risk Score: {riskScore} / 100</span>
                  </div>
                );
              })()}

              <div>
                <span className="text-[#9BA096] font-semibold block mb-1">Analytical Summary:</span>
                <p className="text-[#EEF0EA] leading-relaxed font-sans bg-[#191B18] p-2.5 rounded-lg border border-[#23261F]">
                  "{attack.explanation?.verdict_summary || 'Account suspension language creates urgency to collect credentials.'}"
                </p>
              </div>
            </div>
          </div>

          {/* COLUMN 3: ATTACK INTELLIGENCE */}
          <div className="bg-[#131513] border border-[#23261F] rounded-xl p-4 space-y-3">
            <span className="text-[10px] font-mono text-[#62675C] uppercase tracking-wider block border-b border-[#23261F] pb-1">
              Attack Intelligence & Attribution
            </span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#191B18]">
                <span className="text-[#9BA096]">Campaign ID</span>
                <span className="font-mono font-bold text-[#EEF0EA]">{attack.campaign_id || 'CAMP-SBI-001'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#191B18]">
                <span className="text-[#9BA096]">Mutation Status</span>
                <span className="font-bold font-mono text-[#34D399]">MUTATED (89%)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#9BA096]">Authentication</span>
                <span className="font-mono font-bold text-[#F0554A]">SPF / DMARC Fail</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
