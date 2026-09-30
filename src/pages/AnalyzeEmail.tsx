import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnalysisResult } from '../types';
import { DNAVisualizer } from '../components/DNAVisualizer';
import { Search, Upload, Sparkles, AlertTriangle, CheckCircle, ArrowRight, Zap, RefreshCw } from 'lucide-react';

export const AnalyzeEmail: React.FC = () => {
  const location = useLocation();
  const [rawText, setRawText] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [sender, setSender] = useState<string>('');
  const [replyTo, setReplyTo] = useState<string>('');
  const [ipAddress, setIpAddress] = useState<string>('');
  const [spf, setSpf] = useState<string>('PASS');

  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [pipelineStep, setPipelineStep] = useState<number>(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const pipelineSteps = [
    'Parsing Email Headers & Structure... 📩',
    'Detecting Language Script & Transliteration... 🌐',
    'Extracting 6-Pillar Attack DNA... 🧬',
    'Analyzing Multi-Signal Threat Indicators... 🚨',
    'Generating Multilingual Sentence Embeddings... 💬',
    'Searching FAISS & Campaign Database... 🔎',
    'Running Mutation Detection Engine... 🦠',
    'Generating Explainable Intelligence Report... 📊'
  ];

  const presets = [
    {
      label: '🇬🇧 English SBI KYC',
      lang: 'English',
      sender: 'State Bank Security <support@sbi-security-update.xyz>',
      reply_to: 'admin@cheapvpshost.top',
      subject: 'URGENT: Your SBI Account will be blocked in 24 hours - Action Required',
      text: 'Dear Valued Customer,\n\nYour State Bank of India account #48291039 has been flagged due to unverified KYC documents.\nYour account will be blocked within 24 hours if action is not taken.\n\nPlease verify your credentials and OTP immediately at our official portal:\nhttp://sbi-security-update.xyz/verify-kyc\n\nFailure to verify will lead to immediate account suspension.\n\nState Bank of India Security Team'
    },
    {
      label: '🇮🇳 Tamil SBI KYC',
      lang: 'Tamil',
      sender: 'SBI Alert Service <notice@sbi-verification-ta.site>',
      reply_to: 'support@sbi-verification-ta.site',
      subject: 'முக்கியமானது: உங்கள் SBI கணக்கு 24 மணிநேரத்தில் முடக்கப்படும்',
      text: 'அன்புள்ள வாடிக்கையாளரே,\n\nஉங்கள் SBI கணக்கு முடக்கப்படும். உடனடியாக உங்கள் KYC ஆவணங்களை சரிபார்க்கவும்.\nஇல்லையெனில் உங்கள் வங்கி சேவை நிறுத்தப்படும்.\n\nஉடனடியாக சரிபார்க்க கிளிக் செய்யவும்:\nhttp://sbi-verification-ta.site/login\n\nநன்றி,\nவங்கி பாதுகாப்பு குழு'
    },
    {
      label: '🇮🇳 Tanglish SBI KYC',
      lang: 'Tanglish',
      sender: 'SBI Verification <alert@sbi-update-online.top>',
      reply_to: 'alert@sbi-update-online.top',
      subject: 'Alert: Ungal SBI account block aagum 24 hours kula! Verify immediate ah',
      text: 'Vanakkam Customer,\n\nUngal SBI account block aagum 24 hours kula. Immediate ah verify pannunga, illana account suspend panuvanga.\n\nVerification link:\nhttp://sbi-update-online.top/kyc-portal\n\nVerify pannunga OTP share pannunga.\n\nSBI Support Team'
    },
    {
      label: '🇮🇳 Hindi SBI KYC',
      lang: 'Hindi',
      sender: 'SBI Helpdesk <helpdesk@sbi-kyc-hindi.xyz>',
      reply_to: 'helpdesk@sbi-kyc-hindi.xyz',
      subject: 'अति आवश्यक: आपका SBI बैंक खाता 24 घंटे में बंद कर दिया जाएगा',
      text: 'प्रिय ग्राहक,\n\nआपका SBI बैंक खाता 24 घंटे में बंद कर दिया जाएगा। तुरंत केवाईसी सत्यापित करें और अपना ओटीपी एवं पासवर्ड दर्ज करें।\n\nसत्यापन लिंक:\nhttp://sbi-kyc-hindi.xyz/verify\n\nभारतीय स्टेट बैंक'
    },
    {
      label: '🇮🇳 Hinglish SBI KYC',
      lang: 'Hinglish',
      sender: 'SBI Online <verify@sbi-secure-kyc.online>',
      reply_to: 'verify@sbi-secure-kyc.online',
      subject: 'Notice: Aapka SBI account block ho jayega turantz! Update KYC',
      text: 'Dear Customer,\n\nAapka SBI bank account 24 ghante me block ho jayega. Turant verify karein link par click karke login credentials enter karein:\n\nhttp://sbi-secure-kyc.online/login\n\nDhanyawad,\nSBI Team'
    }
  ];

  useEffect(() => {
    // If state contains pre-loaded demo email from quick trigger
    if (location.state && (location.state as any).demoEmail) {
      const demo = (location.state as any).demoEmail;
      setRawText(demo.raw_text || '');
      setSubject(demo.subject || '');
      setSender(demo.sender || '');
      runAnalysisWithData({
        raw_text: demo.raw_text,
        subject: demo.subject,
        sender: demo.sender,
        reply_to: demo.reply_to
      });
    }
  }, [location.state]);

  const loadPreset = (preset: typeof presets[0]) => {
    setSubject(preset.subject);
    setSender(preset.sender);
    setReplyTo(preset.reply_to);
    setRawText(preset.text);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setRawText(content);
      };
      reader.readAsText(file);
    }
  };

  const runAnalysisWithData = async (inputData: any) => {
    setAnalyzing(true);
    setPipelineStep(0);
    setResult(null);

    // Simulate animated loading pipeline steps
    for (let i = 0; i < pipelineSteps.length; i++) {
      setPipelineStep(i);
      await new Promise((r) => setTimeout(r, 220));
    }

    try {
      const response = await fetch('/api/analyze-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputData)
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAnalyzeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText && !subject) return;

    runAnalysisWithData({
      raw_text: rawText,
      subject,
      sender,
      reply_to: replyTo,
      ip_address: ipAddress,
      spf
    });
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF5DA2] text-white border-2 border-[#241A3D] rounded-full text-xs font-bold font-mono shadow-[2px_2px_0px_#241A3D] mb-2">
          <span>🔬 DEEP MULTILINGUAL THREAT ANALYZER</span>
        </div>
        <h1 className="font-fredoka text-4xl text-[#241A3D] squiggly-line inline-block">
          Analyze Email Threat & DNA
        </h1>
        <p className="font-caveat text-2xl text-[#FF5DA2] mt-1">
          "Paste raw emails or test multilingual attack mutations across languages! 🕵️"
        </p>
      </div>

      {/* Input Form & Preset Loaders */}
      <div className="bg-[#FFFDF9] border-[3px] border-[#241A3D] rounded-3xl p-6 shadow-sticker relative">
        <div className="absolute -top-3 right-8 w-28 h-6 washi-tape-teal transform rotate-2"></div>

        {/* Multilingual Presets Row */}
        <div className="mb-6">
          <div className="text-xs font-mono font-bold text-[#241A3D] mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#FFD23F] fill-[#FFD23F]" />
            LOAD MULTILINGUAL DEMO SAMPLES:
          </div>
          <div className="flex flex-wrap gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => loadPreset(p)}
                className="px-3 py-1.5 bg-[#FFF3E4] hover:bg-[#FFD23F] text-[#241A3D] font-mono text-xs font-bold rounded-xl border-2 border-[#241A3D] shadow-[2px_2px_0px_#241A3D] transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleAnalyzeSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-[#241A3D] mb-1">SENDER EMAIL (FROM)</label>
              <input
                type="text"
                placeholder="e.g. State Bank Security <support@sbi-security-update.xyz>"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="w-full p-3 bg-[#FFF8EF] border-2 border-[#241A3D] rounded-2xl font-mono text-sm focus:outline-none focus:border-[#FF5DA2]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-[#241A3D] mb-1">SUBJECT LINE</label>
              <input
                type="text"
                placeholder="e.g. URGENT: Your SBI Account will be blocked in 24 hours"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 bg-[#FFF8EF] border-2 border-[#241A3D] rounded-2xl font-fredoka text-sm text-[#241A3D] focus:outline-none focus:border-[#FF5DA2]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-mono font-bold text-[#241A3D]">RAW EMAIL TEXT / BODY</label>
              <label className="cursor-pointer font-mono text-xs text-[#FF5DA2] font-bold underline flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" /> Upload .eml / .txt
                <input type="file" accept=".txt,.eml" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
            <textarea
              rows={6}
              placeholder="Paste raw email content in English, Tamil, Tanglish, Hindi, Hinglish..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="w-full p-4 bg-[#FFF8EF] border-2 border-[#241A3D] rounded-2xl font-nunito text-sm focus:outline-none focus:border-[#FF5DA2]"
            ></textarea>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={analyzing}
              className="px-6 py-3 bg-[#FF5DA2] hover:bg-[#FF5DA2]/90 text-white font-fredoka text-base font-bold rounded-2xl border-3 border-[#241A3D] shadow-sticker hover:shadow-sticker-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Search className="w-5 h-5" />
              {analyzing ? 'Analyzing Threat Pipeline...' : 'ANALYZE EMAIL THREAT'}
            </button>
          </div>
        </form>
      </div>

      {/* Loading Animated Pipeline Visualizer */}
      {analyzing && (
        <div className="bg-[#FFFDF9] border-[3px] border-[#241A3D] rounded-3xl p-6 shadow-sticker text-center animate-pulse">
          <div className="font-fredoka text-2xl text-[#241A3D] mb-4">
            ⚡ Running Multilingual Threat Analysis Pipeline...
          </div>
          <div className="inline-block p-4 bg-[#FFD23F] border-2 border-[#241A3D] rounded-2xl font-mono text-sm font-bold text-[#241A3D] shadow-[4px_4px_0px_#241A3D]">
            {pipelineSteps[pipelineStep]}
          </div>
        </div>
      )}

      {/* Analysis Results Display */}
      {result && !analyzing && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Top Threat Summary Banner */}
          {(() => {
            const riskScore = result.risk_score ?? result.threat_score ?? 0;
            const classification = result.classification || (riskScore > 45 ? 'RISKY' : 'SAFE');
            const isRisky = classification === 'RISKY' || riskScore > 45;
            return (
              <div className={`p-6 border-[3px] border-[#241A3D] rounded-3xl shadow-sticker relative ${
                isRisky ? 'bg-[#FFEBEB]' : 'bg-[#F0FDF4]'
              }`}>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-xs font-bold px-3 py-1 bg-[#241A3D] text-white rounded-full">
                        EMAIL ID: {result.email_id}
                      </span>
                      <span className="font-mono text-xs font-bold px-3 py-1 bg-[#FFD23F] text-[#241A3D] border border-[#241A3D] rounded-full">
                        LANGUAGE: {result.language}
                      </span>
                      {result.mutation_detected && (
                        <span className="font-mono text-xs font-bold px-3 py-1 bg-[#FF5DA2] text-white border border-[#241A3D] rounded-full">
                          🧬 MUTATED CAMPAIGN DETECTED
                        </span>
                      )}
                    </div>
                    <h2 className="font-fredoka text-3xl text-[#241A3D]">
                      Threat Verdict: {classification} ({riskScore}/100)
                    </h2>
                    <p className="font-nunito text-base text-[#241A3D] mt-1 font-semibold">
                      {result.explanation.verdict_summary}
                    </p>
                  </div>

                  <div className="px-6 py-4 bg-white border-3 border-[#241A3D] rounded-2xl shadow-[4px_4px_0px_#241A3D] text-center min-w-[180px]">
                    <div className="font-mono text-xs text-[#241A3D] font-bold">RISK SCORE</div>
                    <div className={`font-fredoka text-5xl ${isRisky ? 'text-[#FF5A5F]' : 'text-[#06D6A0]'}`}>{riskScore}</div>
                    <div className="font-mono text-xs font-bold text-[#06D6A0] mt-1">
                      Confidence: {result.confidence_score}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Campaign Mutation Alert Box */}
          {result.mutation_detected && result.mutation_details && (
            <div className="p-6 bg-[#FF5DA2]/10 border-[3px] border-[#FF5DA2] rounded-3xl shadow-sticker-pink relative">
              <div className="font-fredoka text-2xl text-[#241A3D] flex items-center gap-2 mb-3">
                <span>🦠</span> CAMPAIGN MUTATION DETECTED!
              </div>
              <p className="font-nunito text-sm text-[#241A3D] mb-4">
                The attacker mutated the surface wording ({result.mutation_details.original_language} → {result.mutation_details.current_language}) and rotated domain infrastructure, but BhashaShield matched the underlying <strong>Attack DNA</strong>!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3 bg-white border-2 border-[#241A3D] rounded-2xl">
                  <div className="font-bold text-[#FF5DA2] font-fredoka text-sm mb-1">Surface Changes Detected:</div>
                  {result.mutation_details.changes.map((c, idx) => (
                    <div key={idx} className="flex justify-between border-b py-1">
                      <span>{c.feature}:</span>
                      <span className="font-bold">{c.from} → {c.to}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-white border-2 border-[#241A3D] rounded-2xl">
                  <div className="font-bold text-[#06D6A0] font-fredoka text-sm mb-1">Stable Core Attack Features:</div>
                  {result.mutation_details.stable_features.map((sf, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 py-0.5 text-[#241A3D]">
                      <CheckCircle className="w-3.5 h-3.5 text-[#06D6A0]" />
                      <span>{sf}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Attack DNA 6-Pillar Visualizer */}
          <DNAVisualizer dna={result.attack_dna} language={result.language} threatLevel={result.threat_level} />

          {/* Explainable Signals Section */}
          <div className="bg-[#FFFDF9] border-[3px] border-[#241A3D] rounded-3xl p-6 shadow-sticker space-y-4">
            <h3 className="font-fredoka text-2xl text-[#241A3D]">WHY THIS EMAIL IS SUSPICIOUS</h3>
            <div className="space-y-3">
              {result.suspicious_signals.map((sig) => (
                <div key={sig.id} className="p-4 bg-[#FFF8EF] border-2 border-[#241A3D] rounded-2xl shadow-[3px_3px_0px_#241A3D] flex items-start gap-4">
                  <div className="p-2 bg-[#FF5A5F] text-white rounded-xl font-mono text-xs font-bold border border-[#241A3D]">
                    {sig.severity.toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-fredoka text-lg text-[#241A3D]">{sig.title}</h4>
                    <p className="font-nunito text-sm text-[#241A3D]/80">{sig.description}</p>
                    <div className="font-mono text-xs text-[#FF5DA2] font-bold mt-1">Evidence: {sig.evidence}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
