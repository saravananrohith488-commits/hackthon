import React, { useEffect, useState } from 'react';
import { Link2, ArrowRight, Search, ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw, Globe, ExternalLink } from 'lucide-react';
import { UrlAnalysisResponse } from '../types';
import { apiService } from '../services/api';

export const UrlIntelligencePage: React.FC = () => {
  const [targetUrl, setTargetUrl] = useState<string>("http://sbi-verify.xyz/login?token=8f9a2b");
  const [loading, setLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<UrlAnalysisResponse | null>(null);

  const samplePresets = [
    { name: "SBI Phishing Scam", url: "http://sbi-verify.xyz/login?token=8f9a2b" },
    { name: "Shortened Link Redirect", url: "https://bit.ly/3xK9qLm" },
    { name: "HDFC Bank Impersonation", url: "http://hdfc-secure.site/kyc/verify" },
    { name: "Paytm Reward Fraud", url: "https://paytm-cashback-claim.top/reward" },
    { name: "Legitimate SBI Portal", url: "https://sbi.co.in/netbanking/login" }
  ];

  const handleAnalyze = async (urlToAnalyze?: string) => {
    const url = urlToAnalyze || targetUrl;
    if (!url.trim()) return;
    setLoading(true);
    try {
      const data = await apiService.analyzeUrl(url);
      setAnalysis(data);
    } catch (err) {
      console.error("URL Analysis failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleAnalyze("http://sbi-verify.xyz/login?token=8f9a2b");
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* PAGE HEADER */}
      <div className="pb-4 border-b border-[#23261F] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-grotesk font-bold text-[#EEF0EA] tracking-tight flex items-center gap-2">
            <Link2 className="w-5 h-5 text-[#34D399]" />
            URL Pattern & Redirect Intelligence
          </h1>
          <p className="text-xs text-[#9BA096] font-sans mt-0.5">
            Static URL heuristic analysis for typosquatting, suspicious parameters, and unsafe link patterns. No network lookup is performed.
          </p>
        </div>
      </div>

      {/* URL INPUT BAR & PRESETS */}
      <div className="bg-[#131513] border border-[#23261F] rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-[#EEF0EA] uppercase">Target URL Analyzer Input</span>
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[10px] font-mono text-[#62675C] self-center mr-1">PRESETS:</span>
            {samplePresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTargetUrl(preset.url);
                  handleAnalyze(preset.url);
                }}
                className="text-[10px] font-mono px-2 py-0.5 bg-[#191B18] hover:bg-[#1E211D] text-[#9BA096] hover:text-[#EEF0EA] rounded border border-[#23261F] transition"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAnalyze(); }}
            className="flex-1 px-3 py-2 border border-[#23261F] rounded-lg font-mono text-xs text-[#EEF0EA] bg-[#191B18] focus:outline-none focus:border-[#0F3D2E]"
            placeholder="Paste URL for forensic analysis (e.g. http://sbi-verify.xyz/login)..."
          />
          <button
            onClick={() => handleAnalyze()}
            disabled={loading}
            className="px-4 py-2 bg-[#34D399] hover:bg-[#2EB883] text-[#0A0B0A] rounded-lg font-grotesk font-bold text-xs flex items-center gap-2 transition disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Search className="w-3.5 h-3.5" />
            )}
            <span>Analyze URL</span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="py-12 text-center text-xs text-[#62675C] flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-[#34D399]" />
          <span>Tracing redirect chain and analyzing URL threat risk...</span>
        </div>
      )}

      {analysis && !loading && (
        <div className="space-y-6">
          {/* HERO RISK SCORE & TARGET DESTINATION BANNER */}
          <div className="p-5 bg-[#131513] border border-[#23261F] rounded-xl shadow-panel flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full font-mono font-bold text-[10px] uppercase border ${
                  (analysis.classification || analysis.risk_level) === 'RISKY' || analysis.risk_score > 45
                    ? 'bg-[#211110] text-[#F0554A] border-[#3D1815]'
                    : 'bg-[#0E2019] text-[#34D399] border-[#0F3D2E]'
                }`}>
                  {analysis.classification || (analysis.risk_score > 45 ? 'RISKY' : 'SAFE')}
                </span>
                <span className="text-[10px] font-mono text-[#62675C]">STATIC ANALYSIS — DESTINATION NOT RESOLVED</span>
              </div>
              <h2 className="text-base font-grotesk font-bold text-[#EEF0EA] pt-1">
                Final Target Destination: <span className="text-[#34D399] font-mono text-sm font-normal">{analysis.final_destination_page_type}</span>
              </h2>
              <div className="text-xs font-mono text-[#9BA096] bg-[#191B18] p-2 rounded border border-[#23261F] truncate flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-[#62675C] shrink-0" />
                <span className="text-[#EEF0EA] font-semibold">{analysis.final_destination_url}</span>
              </div>
            </div>

            <div className="flex items-center gap-6 border-l md:border-[#23261F] pl-0 md:pl-6 shrink-0">
              <div className="text-center">
                <div className="text-3xl font-mono font-bold text-[#EEF0EA]">
                  {analysis.risk_score} <span className="text-xs text-[#62675C]">/ 100</span>
                </div>
                <span className="text-[10px] font-mono uppercase text-[#62675C] block">Threat Risk Score</span>
                <div className="w-28 bg-[#191B18] h-1.5 rounded-full overflow-hidden mt-1.5 mx-auto">
                  <div
                    className={`h-full ${
                      (analysis.classification || analysis.risk_level) === 'RISKY' || analysis.risk_score > 45 ? 'bg-[#F0554A]' : 'bg-[#34D399]'
                    }`}
                    style={{ width: `${analysis.risk_score}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-center border-l border-[#23261F] pl-6">
                <span className="text-3xl font-mono font-bold text-[#34D399]">
                  {analysis.redirect_chain.length}
                </span>
                <span className="text-[10px] font-mono uppercase text-[#62675C] block">Redirect Hops</span>
              </div>
            </div>
          </div>

          {/* DYNAMIC REDIRECT CHAIN VISUALIZATION */}
          <div className="bg-[#131513] border border-[#23261F] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#23261F] pb-2">
              <h2 className="text-xs font-mono font-bold text-[#EEF0EA] uppercase tracking-wider">
                Observed URL Input
              </h2>
              <span className="text-[10px] font-mono text-[#62675C]">NO NETWORK REQUESTS</span>
            </div>

            <div className="flex flex-col md:flex-row items-stretch justify-between gap-3 py-2">
              {analysis.redirect_chain.map((hop, idx) => (
                <React.Fragment key={idx}>
                  <div className={`flex-1 p-3.5 bg-[#191B18] border rounded-lg space-y-1.5 ${
                    idx === analysis.redirect_chain.length - 1
                      ? ((analysis.classification || analysis.risk_level) === 'RISKY' || analysis.risk_score > 45)
                        ? 'border-[#3D1815] bg-[#211110]/30'
                        : 'border-[#0F3D2E] bg-[#0E2019]/30'
                      : 'border-[#23261F]'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#62675C] uppercase">
                        Step 0{hop.step}. {idx === 0 ? 'Original Link' : idx === analysis.redirect_chain.length - 1 ? 'Final Target Page' : `Hop #${idx}`}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                        hop.status_code === 200 ? 'bg-[#0E2019] text-[#34D399]' : 'bg-[#261F12] text-[#F0AA3D]'
                      }`}>
                        HTTP {hop.status_code}
                      </span>
                    </div>

                    <div className="text-xs font-mono font-bold text-[#EEF0EA] truncate">{hop.url}</div>
                    <span className={`text-[10px] font-mono block ${
                      idx === analysis.redirect_chain.length - 1 && ((analysis.classification || analysis.risk_level) === 'RISKY' || analysis.risk_score > 45) ? 'text-[#F0554A]' : 'text-[#9BA096]'
                    }`}>
                      {hop.note}
                    </span>
                  </div>

                  {idx < analysis.redirect_chain.length - 1 && (
                    <div className="flex items-center justify-center text-[#62675C]">
                      <ArrowRight className="w-4 h-4 hidden md:block" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* DETAILED FORENSIC ATTRIBUTES MATRIX */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* CARD 1: TYPOSQUATTING */}
            <div className="p-4 bg-[#131513] border border-[#23261F] rounded-xl space-y-2">
              <span className="text-[10px] font-mono text-[#62675C] uppercase block border-b border-[#23261F] pb-1">
                Typosquatting & Brand Spoof
              </span>
              <div className={`text-sm font-bold ${analysis.typosquatting_detected ? 'text-[#F0554A]' : 'text-[#34D399]'}`}>
                {analysis.typosquatting_detected ? 'Typosquatting Detected' : 'Clean Brand Match'}
              </div>
              <p className="text-xs text-[#9BA096] leading-relaxed font-sans">
                {analysis.typosquatting_details}
              </p>
            </div>

            {/* CARD 2: SHORTENER */}
            <div className="p-4 bg-[#131513] border border-[#23261F] rounded-xl space-y-2">
              <span className="text-[10px] font-mono text-[#62675C] uppercase block border-b border-[#23261F] pb-1">
                URL Shortener Service
              </span>
              <div className={`text-sm font-bold ${analysis.url_shortener_detected ? 'text-[#F0AA3D]' : 'text-[#EEF0EA]'}`}>
                {analysis.url_shortener_detected ? 'Shortener Service Masking Target' : 'Direct Link'}
              </div>
              <p className="text-xs text-[#9BA096] leading-relaxed font-sans">
                {analysis.url_shortener_details}
              </p>
            </div>

            {/* CARD 3: PARAMETERS */}
            <div className="p-4 bg-[#131513] border border-[#23261F] rounded-xl space-y-2">
              <span className="text-[10px] font-mono text-[#62675C] uppercase block border-b border-[#23261F] pb-1">
                Suspicious Query Parameters
              </span>
              <div className={`text-sm font-bold ${analysis.has_suspicious_params ? 'text-[#F0554A]' : 'text-[#34D399]'}`}>
                {analysis.has_suspicious_params ? 'Token Harvester Parameters' : 'Clean Query Parameters'}
              </div>
              <p className="text-xs text-[#9BA096] leading-relaxed font-sans">
                {analysis.suspicious_params_details}
              </p>
            </div>

            {/* CARD 4: DOMAIN AGE */}
            <div className="p-4 bg-[#131513] border border-[#23261F] rounded-xl space-y-2">
              <span className="text-[10px] font-mono text-[#62675C] uppercase block border-b border-[#23261F] pb-1">
                Domain Age & Reputation
              </span>
              <div className="text-sm font-bold font-mono text-[#EEF0EA]">{analysis.domain_age}</div>
              <p className="text-xs text-[#9BA096] leading-relaxed font-sans">
                Live WHOIS lookup is disabled in this prototype.
              </p>
            </div>

            {/* CARD 5: HOMOGLYPH */}
            <div className="p-4 bg-[#131513] border border-[#23261F] rounded-xl space-y-2">
              <span className="text-[10px] font-mono text-[#62675C] uppercase block border-b border-[#23261F] pb-1">
                Homoglyph / Punycode Check
              </span>
              <div className={`text-sm font-bold ${analysis.unicode_homoglyph_detected ? 'text-[#F0554A]' : 'text-[#34D399]'}`}>
                {analysis.unicode_homoglyph_detected ? 'Punycode Homoglyph Detected' : 'Clean ASCII URL'}
              </div>
              <p className="text-xs text-[#9BA096] leading-relaxed font-sans">
                Evaluates internationalized domain names (IDN) for Cyrillic lookalikes.
              </p>
            </div>

            {/* CARD 6: HOSTING IP */}
            <div className="p-4 bg-[#131513] border border-[#23261F] rounded-xl space-y-2">
              <span className="text-[10px] font-mono text-[#62675C] uppercase block border-b border-[#23261F] pb-1">
                Infrastructure IP
              </span>
              <div className="text-sm font-bold font-mono text-[#EEF0EA]">{analysis.ip_address}</div>
              <p className="text-xs text-[#9BA096] leading-relaxed font-sans">
                Live DNS resolution is disabled in this prototype.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
