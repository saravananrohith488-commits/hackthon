import React, { useState, useEffect } from 'react';
import { AnalysisResult, ComparisonResult } from '../types';
import { GitCompare, Sliders, ArrowRight, CheckCircle, RefreshCw } from 'lucide-react';

export const CompareEmails: React.FC = () => {
  const [emails, setEmails] = useState<AnalysisResult[]>([]);
  const [emailAId, setEmailAId] = useState<string>('EML-SBI-EN-001');
  const [emailBId, setEmailBId] = useState<string>('EML-SBI-TA-002');

  const [weights, setWeights] = useState({
    intent: 3,
    tactics: 3,
    semantic: 3,
    url: 2,
    infra: 1,
    header: 1
  });

  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchEmails();
  }, []);

  useEffect(() => {
    if (emailAId && emailBId) {
      runComparison();
    }
  }, [emailAId, emailBId, weights]);

  const fetchEmails = async () => {
    try {
      const res = await fetch('/api/threat-history');
      const data = await res.json();
      setEmails(data);
      if (data.length >= 2) {
        setEmailAId(data[0].email_id);
        setEmailBId(data[1].email_id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const runComparison = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/compare-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email_a_id: emailAId,
          email_b_id: emailBId,
          custom_weights: weights
        })
      });
      const data = await res.json();
      setComparison(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2EC4B6] text-white border-2 border-[#241A3D] rounded-full text-xs font-bold font-mono shadow-[2px_2px_0px_#241A3D] mb-2">
          <span>⚖️ TRANSPARENT CAMPAIGN SIMILARITY MATRIX</span>
        </div>
        <h1 className="font-fredoka text-4xl text-[#241A3D] squiggly-line inline-block">
          Compare Email Attack DNA
        </h1>
        <p className="font-caveat text-2xl text-[#FF5DA2] mt-1">
          "Observe exact mathematical formula expansion across 6 weighted categories! 📐"
        </p>
      </div>

      {/* Selectors Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 bg-[#FFFDF9] border-[3px] border-[#241A3D] rounded-3xl shadow-sticker">
          <label className="block font-mono text-xs font-bold text-[#241A3D] mb-2">SELECT EMAIL A (ORIGINAL)</label>
          <select
            value={emailAId}
            onChange={(e) => setEmailAId(e.target.value)}
            className="w-full p-3 bg-[#FFF8EF] border-2 border-[#241A3D] rounded-2xl font-fredoka text-sm text-[#241A3D]"
          >
            {emails.map((e) => (
              <option key={e.email_id} value={e.email_id}>
                {e.email_id} ({e.language}) - {e.subject.substring(0, 35)}...
              </option>
            ))}
          </select>
        </div>

        <div className="p-5 bg-[#FFFDF9] border-[3px] border-[#241A3D] rounded-3xl shadow-sticker">
          <label className="block font-mono text-xs font-bold text-[#241A3D] mb-2">SELECT EMAIL B (MUTATION CANDIDATE)</label>
          <select
            value={emailBId}
            onChange={(e) => setEmailBId(e.target.value)}
            className="w-full p-3 bg-[#FFF8EF] border-2 border-[#241A3D] rounded-2xl font-fredoka text-sm text-[#241A3D]"
          >
            {emails.map((e) => (
              <option key={e.email_id} value={e.email_id}>
                {e.email_id} ({e.language}) - {e.subject.substring(0, 35)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Results */}
      {comparison && (
        <div className="space-y-8 animate-in fade-in">
          {/* Final Similarity Score Banner */}
          <div className="p-6 bg-[#FFFDF9] border-[3px] border-[#241A3D] rounded-3xl shadow-sticker flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="font-mono text-xs font-bold px-3 py-1 bg-[#FFD23F] border border-[#241A3D] rounded-full">
                CALCULATED SIMILARITY VERDICT
              </span>
              <h2 className="font-fredoka text-3xl text-[#241A3D] mt-2">
                {comparison.similarity_breakdown.classification} ({comparison.similarity_breakdown.final_score}%)
              </h2>
              <p className="font-caveat text-xl text-[#FF5DA2] mt-1">
                "{comparison.similarity_breakdown.threshold_note}"
              </p>
            </div>

            <div className="px-6 py-4 bg-[#FF5DA2] text-white border-3 border-[#241A3D] rounded-2xl shadow-[4px_4px_0px_#241A3D] text-center min-w-[180px]">
              <div className="font-mono text-xs font-bold">FINAL SCORE</div>
              <div className="font-fredoka text-5xl">{comparison.similarity_breakdown.final_score}%</div>
            </div>
          </div>

          {/* Expanded Mathematical Formula Display */}
          <div className="p-6 bg-[#FFF8EF] border-[3px] border-[#241A3D] rounded-3xl shadow-sticker">
            <h3 className="font-fredoka text-2xl text-[#241A3D] mb-2">Transparent Formula Calculation</h3>
            <div className="font-mono text-sm p-4 bg-white border-2 border-[#241A3D] rounded-2xl overflow-x-auto font-bold text-[#FF5DA2]">
              {comparison.similarity_breakdown.formula_expanded}
            </div>
          </div>

          {/* 6 Category Similarity Breakdown Bars */}
          <div className="p-6 bg-[#FFFDF9] border-[3px] border-[#241A3D] rounded-3xl shadow-sticker">
            <h3 className="font-fredoka text-2xl text-[#241A3D] mb-4">Category-by-Category Breakdown</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              {[
                { title: 'Attack Intent', sim: comparison.similarity_breakdown.intent_sim, weight: weights.intent, tier: 'HIGH (Mutation Cost: High)' },
                { title: 'Social Tactics', sim: comparison.similarity_breakdown.tactics_sim, weight: weights.tactics, tier: 'HIGH (Mutation Cost: High)' },
                { title: 'Multilingual Semantic', sim: comparison.similarity_breakdown.semantic_sim, weight: weights.semantic, tier: 'HIGH (Mutation Cost: High)' },
                { title: 'URL / Domain Pattern', sim: comparison.similarity_breakdown.url_sim, weight: weights.url, tier: 'MEDIUM (Mutation Cost: Med)' },
                { title: 'Infrastructure Signals', sim: comparison.similarity_breakdown.infra_sim, weight: weights.infra, tier: 'LOW (Mutates Easily)' },
                { title: 'Header / Auth Signals', sim: comparison.similarity_breakdown.header_sim, weight: weights.header, tier: 'LOW (Mutates Easily)' },
              ].map((cat, idx) => (
                <div key={idx} className="p-4 bg-[#FFF8EF] border-2 border-[#241A3D] rounded-2xl space-y-2">
                  <div className="flex justify-between font-fredoka text-base text-[#241A3D] font-bold">
                    <span>{cat.title}</span>
                    <span className="font-mono text-sm text-[#FF5DA2]">{cat.sim}%</span>
                  </div>
                  <div className="w-full h-3 bg-white border border-[#241A3D] rounded-full overflow-hidden">
                    <div className="h-full bg-[#FF5DA2]" style={{ width: `${cat.sim}%` }}></div>
                  </div>
                  <div className="text-[10px] text-[#241A3D]/70 font-mono">Weight: {cat.weight} | {cat.tier}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Weight Tuning Sliders for Judges */}
          <div className="p-6 bg-[#FFFDF9] border-[3px] border-[#241A3D] rounded-3xl shadow-sticker space-y-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#FF5DA2]" />
              <h3 className="font-fredoka text-2xl text-[#241A3D]">Live Weight Adjustment Controls</h3>
            </div>
            <p className="font-caveat text-lg text-[#FF5DA2]">
              "Adjust the mutation-cost weights live to observe real-time calculation changes!"
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 font-mono text-xs">
              {Object.entries(weights).map(([k, val]) => (
                <div key={k} className="p-3 bg-[#FFF3E4] border border-[#241A3D] rounded-xl space-y-1">
                  <div className="flex justify-between font-bold capitalize">
                    <span>{k}:</span>
                    <span>{val}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={val}
                    onChange={(e) => setWeights({ ...weights, [k]: parseFloat(e.target.value) })}
                    className="w-full accent-[#FF5DA2] cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
