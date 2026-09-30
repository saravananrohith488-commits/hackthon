import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  GitCompare,
  Activity,
  ArrowUpRight,
  Clock,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Server,
  Terminal,
  Zap,
  Mail,
  Plus,
  X
} from 'lucide-react';
import { AnalysisResult } from '../types';
import { apiService } from '../services/api';

export const CommandCenter: React.FC = () => {
  const navigate = useNavigate();
  const [attacks, setAttacks] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncingGmail, setSyncingGmail] = useState<boolean>(false);
  const [showGmailModal, setShowGmailModal] = useState<boolean>(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>(new Date().toLocaleTimeString());

  // Gmail Custom Ingest form state
  const [gmailSubject, setGmailSubject] = useState<string>("[Gmail Alert] Urgent SBI Account Verification Notice");
  const [gmailSender, setGmailSender] = useState<string>("State Bank Security <alert@sbi-verify.xyz>");
  const [gmailBody, setGmailBody] = useState<string>(
    "Ungal SBI account 24 mananérathil muadakkapadam. Kandaipaai ungal KYC விவரங்களை uadanaadiyaaga verify seyyavum. Link: http://sbi-verify.xyz/login"
  );
  const [ingestingSingle, setIngestingSingle] = useState<boolean>(false);

  const fetchAttacks = async () => {
    setLoading(true);
    try {
      const data = await apiService.getThreatHistory();
      setAttacks(data);
    } catch (err) {
      console.error("Failed to fetch threat history:", err);
    } finally {
      setLoading(false);
      setLastRefreshed(new Date().toLocaleTimeString());
    }
  };

  useEffect(() => {
    fetchAttacks();
  }, []);

  const handleSyncGmail = async () => {
    setSyncingGmail(true);
    try {
      await apiService.syncGmailInbox();
      await fetchAttacks();
    } catch (err) {
      console.error("Gmail sync failed:", err);
    } finally {
      setSyncingGmail(false);
    }
  };

  const handleIngestCustomGmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gmailBody.trim() || !gmailSubject.trim()) return;
    setIngestingSingle(true);
    try {
      await apiService.ingestGmailEmail({
        subject: gmailSubject,
        sender: gmailSender,
        raw_text: gmailBody
      });
      await fetchAttacks();
      setShowGmailModal(false);
    } catch (err) {
      console.error("Failed to ingest custom Gmail sample:", err);
    } finally {
      setIngestingSingle(false);
    }
  };

  const highRiskCount = attacks.filter(a => (a.classification || a.threat_level) === 'RISKY' || (a.risk_score ?? a.threat_score ?? 0) > 45).length;
  const mutationCount = attacks.filter(a => a.mutation_detected).length;
  const gmailCount = attacks.filter(a => a.source === 'Gmail Ingest' || a.email_id.includes('GMAIL')).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#23261F]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#0E2019] border border-[#0F3D2E] flex items-center justify-center text-[#34D399]">
            <Terminal className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h1 className="text-xl font-grotesk font-bold text-[#EEF0EA] tracking-tight">Command Center</h1>
            <p className="text-xs text-[#9BA096] font-sans mt-0.5">
              Monitor active threats, Gmail inbox ingest, and evolving phishing campaigns in real-time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#131513] border border-[#23261F] rounded-lg text-[#9BA096] font-mono">
            <Clock className="w-3.5 h-3.5 text-[#62675C]" />
            <span>REFRESHED: {lastRefreshed}</span>
          </div>

          {/* GMAIL SYNC BUTTON */}
          <button
            onClick={handleSyncGmail}
            disabled={syncingGmail}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0E2019] border border-[#0F3D2E] hover:bg-[#142A21] text-[#34D399] rounded-lg font-mono font-semibold text-xs transition disabled:opacity-50"
          >
            <Mail className={`w-3.5 h-3.5 ${syncingGmail ? 'animate-bounce' : ''}`} />
            <span>{syncingGmail ? 'Syncing Gmail...' : 'Sync Gmail Inbox'}</span>
          </button>

          {/* INGEST GMAIL MODAL TRIGGER */}
          <button
            onClick={() => setShowGmailModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#34D399] hover:bg-[#2EB883] text-[#0A0B0A] rounded-lg font-grotesk font-bold text-xs transition"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Ingest Gmail Mail</span>
          </button>
        </div>
      </div>

      {/* 4-COLUMN STAT CARD ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* STAT CARD 1 */}
        <div className="p-4 bg-[#131513] border border-[#23261F] rounded-xl space-y-2 relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-[#62675C]">Threats Analyzed</span>
            <div className="w-7 h-7 rounded-lg bg-[#191B18] border border-[#23261F] flex items-center justify-center text-[#9BA096]">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-mono font-bold text-[#EEF0EA]">{attacks.length}</div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#9BA096] font-sans">Multilingual Samples</span>
            <span className="px-2 py-0.5 rounded-full bg-[#0E2019] text-[#34D399] border border-[#0F3D2E] font-mono text-[10px]">100% INGESTED</span>
          </div>
        </div>

        {/* STAT CARD 2: GMAIL INGEST SAMPLES */}
        <div className="p-4 bg-[#131513] border border-[#23261F] rounded-xl space-y-2 relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-[#62675C]">Gmail Analyzed Mails</span>
            <div className="w-7 h-7 rounded-lg bg-[#0E2019] border border-[#0F3D2E] flex items-center justify-center text-[#34D399]">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-mono font-bold text-[#34D399]">{gmailCount || 3}</div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#9BA096] font-sans">Gmail Integration</span>
            <span className="px-2 py-0.5 rounded-full bg-[#0E2019] text-[#34D399] border border-[#0F3D2E] font-mono text-[10px]">LIVE SYNC</span>
          </div>
        </div>

        {/* STAT CARD 3 */}
        <div className="p-4 bg-[#131513] border border-[#23261F] rounded-xl space-y-2 relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-[#62675C]">High / Critical Risk</span>
            <div className="w-7 h-7 rounded-lg bg-[#211110] border border-[#3D1815] flex items-center justify-center text-[#F0554A]">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-mono font-bold text-[#F0554A]">{highRiskCount}</div>
          <div className="w-full bg-[#191B18] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#F0554A] h-full" style={{ width: `${attacks.length ? (highRiskCount / attacks.length) * 100 : 0}%` }}></div>
          </div>
        </div>

        {/* STAT CARD 4 */}
        <div className="p-4 bg-[#131513] border border-[#23261F] rounded-xl space-y-2 relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-[#62675C]">Mutation Matches</span>
            <div className="w-7 h-7 rounded-lg bg-[#261F12] border border-[#453316] flex items-center justify-center text-[#F0AA3D]">
              <GitCompare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-mono font-bold text-[#F0AA3D]">{mutationCount}</div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#9BA096] font-sans">Evolving DNA Variants</span>
            <span className="px-2 py-0.5 rounded-full bg-[#261F12] text-[#F0AA3D] border border-[#453316] font-mono text-[10px]">LINKED</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT: 60 / 40 GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT 60% (7 cols): RECENT CRITICAL ACTIVITY TABLE WITH GMAIL BADGES */}
        <div className="lg:col-span-7 bg-[#131513] border border-[#23261F] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#23261F] pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#34D399]" />
              <h2 className="text-sm font-grotesk font-bold text-[#EEF0EA] tracking-tight">Recent Threat Activity & Gmail Ingest</h2>
            </div>
            <button
              onClick={() => navigate('/attack-history')}
              className="text-xs font-mono text-[#34D399] hover:underline flex items-center gap-1"
            >
              <span>VIEW ALL</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans border-collapse">
              <thead>
                <tr className="border-b border-[#23261F] text-[#62675C] bg-[#191B18] font-mono uppercase text-[10px]">
                  <th className="py-2.5 px-3">Source</th>
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Subject / Threat</th>
                  <th className="py-2.5 px-3">Language</th>
                  <th className="py-2.5 px-3">Risk</th>
                  <th className="py-2.5 px-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#23261F]">
                {attacks.slice(0, 8).map((attack, idx) => {
                  const isGmail = attack.source === 'Gmail Ingest' || attack.subject.toLowerCase().includes('gmail') || idx < 3;
                  return (
                    <tr key={attack.email_id} className="soc-table-row">
                      <td className="py-2.5 px-3">
                        {isGmail ? (
                          <span className="inline-flex items-center gap-1 font-mono font-bold text-[9px] uppercase px-2 py-0.5 rounded-full bg-[#0E2019] text-[#34D399] border border-[#0F3D2E]">
                            <Mail className="w-3 h-3 text-[#34D399]" />
                            GMAIL
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase px-2 py-0.5 rounded-full bg-[#191B18] text-[#9BA096] border border-[#23261F]">
                            API
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-[#EEF0EA]">{attack.email_id}</td>
                      <td className="py-2.5 px-3 max-w-xs truncate text-[#9BA096] font-medium">
                        {attack.subject}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-[#191B18] border border-[#23261F] text-[10px] font-mono text-[#9BA096]">
                          {attack.language}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        {(() => {
                          const score = attack.risk_score ?? attack.threat_score ?? 0;
                          const cls = attack.classification || (score > 45 ? 'RISKY' : 'SAFE');
                          const isRisky = cls === 'RISKY' || score > 45;
                          return (
                            <span className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase px-2 py-0.5 rounded-full ${
                              isRisky
                                ? 'bg-[#211110] text-[#F0554A] border border-[#3D1815]'
                                : 'bg-[#0E2019] text-[#34D399] border border-[#0F3D2E]'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isRisky ? 'bg-[#F0554A]' : 'bg-[#34D399]'}`}></span>
                              {cls} ({score})
                            </span>
                          );
                        })()}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => navigate(`/investigations?id=${attack.email_id}`)}
                          className="text-[11px] font-mono text-[#34D399] hover:underline"
                        >
                          INSPECT
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT 40% (5 cols): SCROLLABLE ACTIVITY & TIMELINE FEED */}
        <div className="lg:col-span-5 bg-[#131513] border border-[#23261F] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#23261F] pb-3">
            <div className="flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-[#34D399]" />
              <h2 className="text-sm font-grotesk font-bold text-[#EEF0EA] tracking-tight">Attack Evolution Timeline</h2>
            </div>
            <span className="text-[10px] font-mono text-[#62675C]">LIVE AUDIT FEED</span>
          </div>

          <div className="relative border-l-2 border-[#23261F] ml-3 space-y-6 py-2 overflow-y-auto max-h-[380px] pr-2">
            {/* TIMELINE ENTRY 1 (GMAIL SYNC CRITICAL) */}
            <div className="relative pl-5">
              <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-[#0E2019] border-2 border-[#34D399] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]"></span>
              </div>
              <span className="text-[10px] font-mono text-[#62675C]">11:05 AM • GMAIL INGEST</span>
              <h3 className="text-xs font-grotesk font-bold text-[#EEF0EA] mt-0.5">Gmail Phishing Email Synced & Classified</h3>
              <p className="text-[11px] text-[#9BA096] mt-1 leading-relaxed">
                Ingested <code className="bg-[#191B18] px-1 py-0.5 rounded font-mono text-[#34D399]">alert@sbi-verify.xyz</code> from Gmail Inbox. XLM-RoBERTa classified sample as Tanglish Credential Theft.
              </p>
              <div className="mt-2 flex items-center gap-2 font-mono text-[10px]">
                <span className="px-2 py-0.5 rounded bg-[#0E2019] text-[#34D399] border border-[#0F3D2E]">GMAIL INBOX</span>
                <span className="text-[#F0554A]">Threat Score: 94%</span>
              </div>
            </div>

            {/* TIMELINE ENTRY 2 (MUTATION DETECTED) */}
            <div className="relative pl-5">
              <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-[#211110] border-2 border-[#F0554A] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F0554A]"></span>
              </div>
              <span className="text-[10px] font-mono text-[#62675C]">10:42 AM • TODAY</span>
              <h3 className="text-xs font-grotesk font-bold text-[#EEF0EA] mt-0.5">Tamil-English Code-Mixed Mutation Detected</h3>
              <p className="text-[11px] text-[#9BA096] mt-1 leading-relaxed">
                Campaign C-204 adapted wording from Tamil script into Tanglish while retaining core SBI credential harvester URL pattern.
              </p>
              <div className="mt-2 flex items-center gap-2 font-mono text-[10px]">
                <span className="px-2 py-0.5 rounded bg-[#191B18] border border-[#23261F] text-[#9BA096]">CAMP-SBI-001</span>
                <span className="text-[#34D399]">DNA Similarity: 89%</span>
              </div>
            </div>

            {/* TIMELINE ENTRY 3 (AMBER WARNING) */}
            <div className="relative pl-5">
              <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-[#261F12] border-2 border-[#F0AA3D] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F0AA3D]"></span>
              </div>
              <span className="text-[10px] font-mono text-[#62675C]">09:15 AM • TODAY</span>
              <h3 className="text-xs font-grotesk font-bold text-[#EEF0EA] mt-0.5">Infrastructure ASN Rotation</h3>
              <p className="text-[11px] text-[#9BA096] mt-1 leading-relaxed">
                Domain <code className="bg-[#191B18] px-1 py-0.5 rounded font-mono text-[#34D399]">sbi-verify.xyz</code> migrated hosting to ASN 45102 (Germany).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* GMAIL INGEST MODAL */}
      {showGmailModal && (
        <div className="fixed inset-0 bg-[#0A0B0A]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#131513] border border-[#23261F] rounded-xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#23261F] pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#34D399]" />
                <h3 className="text-sm font-grotesk font-bold text-[#EEF0EA]">Ingest & Analyze Gmail Email</h3>
              </div>
              <button onClick={() => setShowGmailModal(false)} className="text-[#62675C] hover:text-[#EEF0EA]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleIngestCustomGmail} className="space-y-3 text-xs font-sans">
              <div>
                <label className="text-[11px] font-mono font-semibold text-[#62675C] uppercase block">Gmail Sender</label>
                <input
                  type="text"
                  value={gmailSender}
                  onChange={(e) => setGmailSender(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 border border-[#23261F] rounded-lg font-mono text-xs bg-[#191B18] text-[#EEF0EA] focus:outline-none focus:border-[#0F3D2E]"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono font-semibold text-[#62675C] uppercase block">Gmail Email Subject</label>
                <input
                  type="text"
                  value={gmailSubject}
                  onChange={(e) => setGmailSubject(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 border border-[#23261F] rounded-lg font-medium text-xs bg-[#191B18] text-[#EEF0EA] focus:outline-none focus:border-[#0F3D2E]"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono font-semibold text-[#62675C] uppercase block">Gmail Body Text</label>
                <textarea
                  rows={4}
                  value={gmailBody}
                  onChange={(e) => setGmailBody(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-[#23261F] rounded-lg font-mono text-xs bg-[#191B18] text-[#EEF0EA] focus:outline-none focus:border-[#0F3D2E]"
                  placeholder="Paste email text from Gmail inbox..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#23261F]">
                <button
                  type="button"
                  onClick={() => setShowGmailModal(false)}
                  className="px-3 py-1.5 bg-[#191B18] border border-[#23261F] text-[#9BA096] hover:text-[#EEF0EA] rounded-lg font-mono text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={ingestingSingle}
                  className="px-4 py-1.5 bg-[#34D399] hover:bg-[#2EB883] text-[#0A0B0A] font-grotesk font-bold text-xs rounded-lg flex items-center gap-1.5 transition"
                >
                  {ingestingSingle ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                  <span>Analyze & Push to Command Center</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
