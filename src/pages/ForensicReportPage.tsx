import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Printer,
  Download,
  ShieldCheck,
  ShieldAlert,
  Copy,
  Check,
  Upload,
  FileCheck2,
  AlertTriangle,
  Bot,
  RefreshCw
} from 'lucide-react';
import { ForensicReportData, EvidenceVerificationResult, AnalysisResult } from '../types';
import { apiService } from '../services/api';

const valOrNA = (v: any, fallback: string = 'Not available'): string => {
  if (v === null || v === undefined) return fallback;
  const s = String(v).trim();
  if (!s || ['unavailable', 'none', 'null', 'unknown', 'n/a'].includes(s.toLowerCase())) {
    return fallback;
  }
  return s;
};

export const ForensicReportPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const targetId = searchParams.get('id') || 'BS-0001';

  const [report, setReport] = useState<ForensicReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [availableAttacks, setAvailableAttacks] = useState<AnalysisResult[]>([]);

  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [downloadingPdf, setDownloadingPdf] = useState<boolean>(false);

  // Evidence Integrity Verification state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<EvidenceVerificationResult | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    apiService.getThreatHistory()
      .then(list => setAvailableAttacks(list.slice(0, 30)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setVerificationResult(null);
    setSelectedFile(null);
    setVerifyError(null);

    apiService.getForensicReport(targetId)
      .then(data => {
        setReport(data);
        try {
          sessionStorage.setItem(
            'sentinals_active_forensic_context',
            JSON.stringify({
              attack_id: data.attack_id,
              report_id: data.report_id,
              evidence_id: data.evidence_integrity?.evidence_id,
              evidence_hash: data.evidence_integrity?.evidence_hash
            })
          );
        } catch {
          // ignore storage quota errors
        }
      })
      .catch(err => {
        console.error(err);
        setError(err?.message || 'Failed to load forensic report.');
      })
      .finally(() => setLoading(false));
  }, [targetId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!report) return;
    setDownloadingPdf(true);
    try {
      await apiService.downloadForensicReportPdf(
        report.attack_id,
        report.evidence_integrity?.file_name
      );
    } catch (err) {
      console.error('Download PDF failed:', err);
      window.print();
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleCopyHash = async (hashValue: string) => {
    if (!hashValue) return;
    try {
      await navigator.clipboard.writeText(hashValue);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } catch {
      // Fallback selection copy
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setSelectedFile(f);
    setVerificationResult(null);
    setVerifyError(null);
  };

  const handleVerifyIntegrity = async (fileToVerify?: File) => {
    const file = fileToVerify || selectedFile;
    if (!file) {
      setVerifyError('Please select a forensic report file (.pdf or .json) to verify.');
      return;
    }

    setVerifying(true);
    setVerifyError(null);
    try {
      const res = await apiService.verifyEvidenceIntegrity(file, {
        evidence_id: report?.evidence_integrity?.evidence_id,
        report_id: report?.report_id,
        attack_id: report?.attack_id,
        expected_hash: report?.evidence_integrity?.evidence_hash
      });
      setVerificationResult(res);
      try {
        sessionStorage.setItem(
          'sentinals_active_forensic_context',
          JSON.stringify({
            attack_id: report?.attack_id,
            report_id: report?.report_id,
            evidence_id: report?.evidence_integrity?.evidence_id,
            evidence_hash: report?.evidence_integrity?.evidence_hash,
            verification_result: res
          })
        );
      } catch {
        // ignore
      }
    } catch (err: any) {
      setVerifyError(err?.message || 'Verification failed.');
    } finally {
      setVerifying(false);
    }
  };

  const overview = report?.incident_overview;
  const ef = report?.email_forensics;
  const auth = ef?.authentication_results || report?.attack_dna?.authentication_signals;
  const geo = ef?.geolocation || report?.attack_dna?.infrastructure_signals;
  const iocs = ef?.indicators_of_compromise || {
    urls: report?.attack_dna?.url_pattern?.extracted_urls || [],
    domains: report?.attack_dna?.url_pattern?.domains || [],
    ip_addresses: [report?.attack_dna?.infrastructure_signals?.ip_address || 'Not available'],
    suspicious_keywords: report?.attack_dna?.url_pattern?.suspicious_keywords || [],
    typosquatting_detected: Boolean(report?.attack_dna?.url_pattern?.typosquatting_detected),
    unicode_lookalike: Boolean(report?.attack_dna?.url_pattern?.unicode_lookalike),
    url_structure_risk: report?.attack_dna?.url_pattern?.url_structure_risk || 'Not available'
  };
  const mutation = report?.mutation_analysis;
  const integrity = report?.evidence_integrity;
  const relayHeaders = ef?.received_headers?.length
    ? ef.received_headers
    : report?.attack_dna?.infrastructure_signals?.relay_path?.length
    ? report.attack_dna.infrastructure_signals.relay_path
    : ['Not available'];

  return (
    <div className="space-y-6 max-w-5xl mx-auto select-text">
      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#23261F] print:hidden">
        <div>
          <h1 className="text-xl font-grotesk font-bold text-[#EEF0EA] tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#34D399]" />
            <span>Evolution Forensic Report & Evidence Integrity</span>
          </h1>
          <p className="text-xs text-[#9BA096]">
            Cryptographically sealed email threat forensic report with SHA-256 chain-of-custody verification
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {availableAttacks.length > 0 && (
            <select
              value={report?.attack_id || targetId}
              onChange={(e) => setSearchParams({ id: e.target.value })}
              className="px-2.5 py-1.5 bg-[#191B18] border border-[#23261F] rounded-lg text-xs font-mono text-[#EEF0EA] focus:outline-none focus:border-[#0F3D2E]"
              title="Select analyzed email for forensic report"
            >
              {availableAttacks.map((a) => (
                <option key={a.email_id} value={a.email_id}>
                  {a.email_id} — {a.language} ({a.threat_level})
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => navigate(`/chitti-ai?attack_id=${encodeURIComponent(report?.attack_id || targetId)}`)}
            className="px-3 py-1.5 bg-[#0E2019] hover:bg-[#142A21] border border-[#0F3D2E] text-[#34D399] rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer transition"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Ask CHITTI</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf || !report}
            className="px-3.5 py-1.5 bg-[#34D399] hover:bg-[#2EB883] disabled:opacity-50 text-[#0A0B0A] rounded-lg text-xs font-grotesk font-bold flex items-center gap-1.5 cursor-pointer transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadingPdf ? 'Generating PDF...' : 'Download PDF Artifact'}</span>
          </button>

          <button
            onClick={handlePrint}
            disabled={!report}
            className="px-3 py-1.5 bg-[#191B18] hover:bg-[#1E211D] border border-[#23261F] text-[#EEF0EA] rounded-lg text-xs font-grotesk font-semibold flex items-center gap-1.5 cursor-pointer transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="bg-[#131513] border border-[#23261F] rounded-xl p-8 flex items-center justify-center gap-3 text-xs font-mono text-[#9BA096]">
          <RefreshCw className="w-4 h-4 animate-spin text-[#34D399]" />
          <span>Generating deterministic forensic report & calculating SHA-256 evidence hash...</span>
        </div>
      )}

      {error && !loading && (
        <div className="bg-[#211110] border border-[#3D1815] rounded-xl p-4 text-xs text-[#F0554A] font-mono">
          {error}
        </div>
      )}

      {/* TOP CRYPTOGRAPHIC EVIDENCE INTEGRITY BANNER */}
      {report && integrity && !loading && (
        <div className="bg-[#0E2019]/70 border border-[#0F3D2E] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 print:hidden">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-2 py-0.5 bg-[#0E2019] border border-[#34D399] text-[#34D399] rounded font-bold text-[10px]">
                {integrity.hash_algorithm} SEALED
              </span>
              <span className="text-[#EEF0EA] font-bold">{integrity.evidence_id}</span>
              <span className="text-[#9BA096]">• {integrity.file_name} ({integrity.file_size_human})</span>
              <span className="text-[#9BA096]">• Generated: {integrity.hash_generated_at}</span>
            </div>
            <div className="font-mono text-xs text-[#34D399] break-all select-all">
              <span className="text-[#9BA096] mr-1.5">SHA-256:</span>
              {integrity.evidence_hash}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleCopyHash(integrity.evidence_hash)}
              className="px-3 py-1.5 bg-[#131513] hover:bg-[#191B18] border border-[#0F3D2E] text-[#34D399] rounded-lg text-xs font-mono flex items-center gap-1.5 cursor-pointer transition"
            >
              {copiedHash ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedHash ? 'Copied!' : 'Copy SHA-256'}</span>
            </button>
          </div>
        </div>
      )}

      {/* DOCUMENT CONTAINER */}
      {report && !loading && (
        <div className="bg-[#131513] border border-[#23261F] rounded-xl p-8 space-y-6 text-[#EEF0EA] print:bg-white print:text-black print:border-none">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#23261F] print:border-black pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#34D399] tracking-wider uppercase block">
                SENTINALS SECURITY FORENSICS
              </span>
              <h1 className="text-2xl font-grotesk font-bold tracking-tight mt-0.5">
                Evolution Forensic Report
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs font-mono text-[#9BA096]">
                <span>Report ID: <strong className="text-[#EEF0EA] print:text-black">{report.report_id}</strong></span>
                {integrity?.evidence_id && (
                  <span>Evidence ID: <strong className="text-[#34D399] print:text-black">{integrity.evidence_id}</strong></span>
                )}
                <span>Target ID: <strong className="text-[#EEF0EA] print:text-black">{report.attack_id}</strong></span>
              </div>
            </div>
            <div className="sm:text-right text-xs font-mono space-y-1">
              <div>
                <strong>Report Generated At:</strong>{' '}
                <span>{valOrNA(integrity?.report_generated_at || report.generated_at)}</span>
              </div>
              <div>
                <strong>Hash Generated At:</strong>{' '}
                <span>{valOrNA(integrity?.hash_generated_at)}</span>
              </div>
              <div>
                <strong>Classification:</strong>{' '}
                <span className="px-1.5 py-0.5 bg-[#211110] border border-[#3D1815] text-[#F0554A] rounded text-[10px]">
                  CONFIDENTIAL
                </span>
              </div>
            </div>
          </div>

          {/* 1. EXECUTIVE SUMMARY */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#34D399] border-b border-[#23261F] pb-1">
              1. Executive Summary
            </h2>
            <p className="text-xs text-[#9BA096] print:text-black leading-relaxed font-sans">
              {valOrNA(report.executive_summary)}
            </p>
          </div>

          {/* 2. EMAIL FORENSIC METADATA & AUTHENTICATION */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#34D399] border-b border-[#23261F] pb-1">
              2. Email Forensic Metadata & Authentication
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono bg-[#191B18] print:bg-gray-100 p-4 rounded-lg border border-[#23261F]">
              <div>
                <span className="text-[#62675C] uppercase block text-[10px]">Email / Message ID</span>
                <strong className="text-[#EEF0EA] print:text-black break-all">
                  {valOrNA(ef?.message_id || overview?.message_id || report.attack_id)}
                </strong>
              </div>
              <div>
                <span className="text-[#62675C] uppercase block text-[10px]">Email Date / Timestamp</span>
                <strong className="text-[#EEF0EA] print:text-black">
                  {valOrNA(ef?.email_timestamp || overview?.email_timestamp)}
                </strong>
              </div>
              <div>
                <span className="text-[#62675C] uppercase block text-[10px]">Sender (From)</span>
                <strong className="text-[#EEF0EA] print:text-black break-all">
                  {valOrNA(overview?.sender)}
                </strong>
              </div>
              <div>
                <span className="text-[#62675C] uppercase block text-[10px]">Reply-To</span>
                <strong className="text-[#EEF0EA] print:text-black break-all">
                  {valOrNA(ef?.reply_to || overview?.reply_to)}
                </strong>
              </div>
              <div>
                <span className="text-[#62675C] uppercase block text-[10px]">Recipient (To)</span>
                <strong className="text-[#EEF0EA] print:text-black break-all">
                  {valOrNA(ef?.recipient || overview?.recipient)}
                </strong>
              </div>
              <div>
                <span className="text-[#62675C] uppercase block text-[10px]">Originating Sender IP</span>
                <strong className="text-[#EEF0EA] print:text-black">
                  {valOrNA(ef?.sender_ip || overview?.sender_ip || geo?.originating_ip)}
                </strong>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[#62675C] uppercase block text-[10px]">Subject</span>
                <strong className="text-[#EEF0EA] print:text-black">
                  {valOrNA(overview?.subject)}
                </strong>
              </div>
            </div>

            {/* SPF / DKIM / DMARC Authentication Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs font-mono bg-[#191B18] print:bg-gray-100 p-3 rounded-lg border border-[#23261F]">
              <div>
                <span className="text-[#62675C] uppercase block text-[10px]">SPF</span>
                <strong className={auth?.spf === 'PASS' ? 'text-[#34D399]' : 'text-[#F0554A]'}>
                  {valOrNA(auth?.spf)}
                </strong>
              </div>
              <div>
                <span className="text-[#62675C] uppercase block text-[10px]">DKIM</span>
                <strong className={auth?.dkim === 'PASS' ? 'text-[#34D399]' : 'text-[#F0554A]'}>
                  {valOrNA(auth?.dkim)}
                </strong>
              </div>
              <div>
                <span className="text-[#62675C] uppercase block text-[10px]">DMARC</span>
                <strong className={auth?.dmarc === 'PASS' ? 'text-[#34D399]' : 'text-[#F0554A]'}>
                  {valOrNA(auth?.dmarc)}
                </strong>
              </div>
              <div>
                <span className="text-[#62675C] uppercase block text-[10px]">Reply-To Mismatch</span>
                <strong className={auth?.reply_to_mismatch ? 'text-[#F0554A]' : 'text-[#34D399]'}>
                  {auth ? (auth.reply_to_mismatch ? 'DETECTED' : 'NONE') : 'Not available'}
                </strong>
              </div>
              <div>
                <span className="text-[#62675C] uppercase block text-[10px]">Domain Mismatch</span>
                <strong className={auth?.sender_domain_mismatch ? 'text-[#F0554A]' : 'text-[#34D399]'}>
                  {auth ? (auth.sender_domain_mismatch ? 'DETECTED' : 'NONE') : 'Not available'}
                </strong>
              </div>
            </div>
          </div>

          {/* 3. THREAT CLASSIFICATION & DETECTION RESULTS */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#34D399] border-b border-[#23261F] pb-1">
              3. Threat Classification & Detection Results
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono bg-[#191B18] print:bg-gray-100 p-3.5 rounded-lg border border-[#23261F]">
              <div>
                <span className="text-[#62675C] uppercase block text-[10px]">Classification</span>
                <strong className={(overview?.classification || overview?.threat_level) === 'SAFE' ? 'text-[#34D399]' : 'text-[#F0554A]'}>
                  {valOrNA(overview?.classification || overview?.threat_level)}
                </strong>
              </div>
              <div>
                <span className="text-[#62675C] uppercase block text-[10px]">Risk Score</span>
                <strong className="text-[#EEF0EA] print:text-black">
                  {(overview?.risk_score ?? overview?.phishing_score) !== undefined
                    ? `${overview?.risk_score ?? overview?.phishing_score} / 100`
                    : 'Not available'}
                </strong>
              </div>
              <div>
                <span className="text-[#62675C] uppercase block text-[10px]">Language Profile</span>
                <strong className="text-[#34D399]">{valOrNA(overview?.language)}</strong>
              </div>
              <div>
                <span className="text-[#62675C] uppercase block text-[10px]">Campaign ID</span>
                <strong className="text-[#EEF0EA] print:text-black">{valOrNA(overview?.campaign_id)}</strong>
              </div>
            </div>

            <p className="text-xs text-[#9BA096] print:text-black font-sans leading-relaxed">
              {valOrNA(ef?.verdict_summary || `Multilingual classification identified '${valOrNA(overview?.attack_type || report.attack_dna?.attack_type)}' with ${valOrNA(overview?.classification || overview?.threat_level)} classification.`)}
            </p>

            {ef?.detection_signals && ef.detection_signals.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono uppercase text-[#62675C] block font-bold">
                  Triggered Detection Signals
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ef.detection_signals.map((sig, idx) => (
                    <div key={sig.id || idx} className="p-2.5 bg-[#191B18] border border-[#23261F] rounded-lg text-xs">
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <strong className="text-[#EEF0EA] print:text-black">{sig.title}</strong>
                        <span className="uppercase text-[10px] text-[#F0AA3D]">{sig.severity}</span>
                      </div>
                      <p className="text-[11px] text-[#9BA096] mt-0.5">{sig.description}</p>
                      <code className="text-[10px] font-mono text-[#34D399] block mt-1">
                        Evidence: {valOrNA(sig.evidence)}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 4. ATTACK DNA & MUTATION ANALYSIS */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#34D399] border-b border-[#23261F] pb-1">
              4. Attack DNA & Mutation Analysis
            </h2>
            <div className="text-xs space-y-1.5 text-[#9BA096] print:text-black font-sans bg-[#191B18] print:bg-gray-100 p-3.5 rounded-lg border border-[#23261F]">
              <div>
                • <strong className="text-[#EEF0EA] print:text-black">Attack Intent:</strong>{' '}
                {valOrNA(report.attack_dna?.attack_intent)}
              </div>
              <div>
                • <strong className="text-[#EEF0EA] print:text-black">Social Engineering Tactics:</strong>{' '}
                {report.attack_dna?.social_engineering_tactics?.length
                  ? report.attack_dna.social_engineering_tactics.join(', ')
                  : 'Not available'}
              </div>
              <div>
                • <strong className="text-[#EEF0EA] print:text-black">What Stayed The Same (Invariant DNA):</strong>{' '}
                {valOrNA(mutation?.what_stayed_same || report.attack_dna?.attack_intent)}
              </div>
              <div>
                • <strong className="text-[#EEF0EA] print:text-black">What Changed (Surface Mutation):</strong>{' '}
                {valOrNA(mutation?.what_changed)}
              </div>
            </div>
          </div>

          {/* 5. INDICATORS OF COMPROMISE (IOCs) */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#34D399] border-b border-[#23261F] pb-1">
              5. Indicators of Compromise (IOCs)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono bg-[#191B18] print:bg-gray-100 p-3.5 rounded-lg border border-[#23261F]">
              <div>
                <span className="text-[#62675C] uppercase block text-[10px]">Extracted URLs</span>
                <strong className="text-[#34D399] print:text-black break-all">
                  {iocs.urls?.length ? iocs.urls.join(', ') : 'Not available'}
                </strong>
              </div>
              <div>
                <span className="text-[#62675C] uppercase block text-[10px]">Observed Domains</span>
                <strong className="text-[#EEF0EA] print:text-black break-all">
                  {iocs.domains?.length ? iocs.domains.join(', ') : 'Not available'}
                </strong>
              </div>
              <div>
                <span className="text-[#62675C] uppercase block text-[10px]">Observed IP Addresses</span>
                <strong className="text-[#EEF0EA] print:text-black">
                  {iocs.ip_addresses?.length ? iocs.ip_addresses.map(ip => valOrNA(ip)).join(', ') : 'Not available'}
                </strong>
              </div>
              <div>
                <span className="text-[#62675C] uppercase block text-[10px]">Suspicious URL Keywords</span>
                <strong className="text-[#EEF0EA] print:text-black">
                  {iocs.suspicious_keywords?.length ? iocs.suspicious_keywords.join(', ') : 'Not available'}
                </strong>
              </div>
            </div>
          </div>

          {/* 6. INFRASTRUCTURE GEOLOCATION INTELLIGENCE */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#34D399] border-b border-[#23261F] pb-1">
              6. Infrastructure Geolocation Intelligence
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono bg-[#191B18] print:bg-gray-100 p-3.5 rounded-lg border border-[#23261F]">
              <div>
                <span className="text-[#62675C] uppercase block text-[10px]">Originating IP</span>
                <strong className="text-[#EEF0EA] print:text-black">{valOrNA(geo?.originating_ip || (geo as any)?.ip_address)}</strong>
              </div>
              <div>
                <span className="text-[#62675C] uppercase block text-[10px]">Country</span>
                <strong className="text-[#34D399] print:text-black">{valOrNA(geo?.country)}</strong>
              </div>
              <div>
                <span className="text-[#62675C] uppercase block text-[10px]">Region / City</span>
                <strong className="text-[#EEF0EA] print:text-black">{valOrNA(geo?.region_city || (geo as any)?.region)}</strong>
              </div>
              <div>
                <span className="text-[#62675C] uppercase block text-[10px]">ISP</span>
                <strong className="text-[#EEF0EA] print:text-black">{valOrNA(geo?.isp)}</strong>
              </div>
              <div>
                <span className="text-[#62675C] uppercase block text-[10px]">ASN</span>
                <strong className="text-[#EEF0EA] print:text-black">{valOrNA(geo?.asn)}</strong>
              </div>
              <div>
                <span className="text-[#62675C] uppercase block text-[10px]">Hosting Provider</span>
                <strong className="text-[#EEF0EA] print:text-black">{valOrNA(geo?.hosting_provider)}</strong>
              </div>
            </div>

            {/* RECEIVED HEADER RELAY PATH */}
            <div className="p-3 bg-[#191B18] print:bg-gray-100 border border-[#23261F] rounded-lg text-xs space-y-1">
              <span className="text-[10px] font-mono text-[#62675C] uppercase block font-bold">
                Received Header Relay Trace
              </span>
              <div className="font-mono text-[11px] text-[#34D399] print:text-black break-words">
                {relayHeaders.join(' ➔ ')}
              </div>
            </div>

            {/* MANDATORY SOC DISCLAIMER BADGE */}
            <div className="p-3 bg-[#261F12] border border-[#453316] rounded-lg text-xs text-[#F0AA3D] font-sans flex items-start gap-2">
              <span className="text-base">⚠️</span>
              <div>
                <strong className="font-mono text-[10px] uppercase block tracking-wider text-[#F0AA3D]">
                  Infrastructure Geolocation Notice
                </strong>
                <p className="text-[11px] text-[#EEF0EA] print:text-black mt-0.5 leading-relaxed">
                  {valOrNA(
                    geo?.disclaimer,
                    "IP geolocation identifies the probable location of the server/infrastructure, not necessarily the attacker's exact physical location."
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* 7. RECOMMENDED ACTIONS */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#34D399] border-b border-[#23261F] pb-1">
              7. Recommended Incident Response Actions
            </h2>
            <ul className="list-disc pl-5 text-xs text-[#9BA096] print:text-black font-sans space-y-1">
              {report.recommended_actions.map((act, i) => (
                <li key={i}>{act}</li>
              ))}
            </ul>
          </div>

          {/* 8. EVIDENCE INTEGRITY (PART 5) */}
          {integrity && (
            <div className="space-y-3 pt-2 border-t-2 border-[#23261F] print:border-black">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#34D399] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#34D399]" />
                  <span>EVIDENCE INTEGRITY</span>
                </h2>
                <span className="px-2 py-0.5 bg-[#0E2019] border border-[#0F3D2E] text-[#34D399] rounded text-[10px] font-mono font-bold">
                  IMMUTABLE SHA-256 RECORD
                </span>
              </div>

              <div className="bg-[#191B18] print:bg-gray-100 border border-[#23261F] rounded-xl p-4 space-y-3 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[#62675C] uppercase block text-[10px]">Evidence ID</span>
                    <strong className="text-[#34D399] print:text-black text-xs">{integrity.evidence_id}</strong>
                  </div>
                  <div>
                    <span className="text-[#62675C] uppercase block text-[10px]">Hash Algorithm</span>
                    <strong className="text-[#EEF0EA] print:text-black text-xs">{integrity.hash_algorithm}</strong>
                  </div>
                  <div>
                    <span className="text-[#62675C] uppercase block text-[10px]">Report ID</span>
                    <strong className="text-[#EEF0EA] print:text-black text-xs">{integrity.report_id}</strong>
                  </div>
                </div>

                {/* FULL 64-CHARACTER SHA-256 HASH (NEVER TRUNCATED) */}
                <div className="p-3 bg-[#131513] print:bg-white border border-[#23261F] rounded-lg space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[#62675C] uppercase text-[10px] font-bold">
                      Evidence Hash (SHA-256 — 64-Character Hexadecimal)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyHash(integrity.evidence_hash)}
                      className="px-2 py-0.5 bg-[#191B18] hover:bg-[#1E211D] border border-[#23261F] text-[#34D399] rounded text-[10px] font-mono flex items-center gap-1 cursor-pointer transition print:hidden"
                    >
                      {copiedHash ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Hash</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="font-mono text-xs text-[#34D399] print:text-black break-all select-all tracking-wide pt-0.5">
                    {integrity.evidence_hash}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[#62675C] uppercase block text-[10px]">Hash Generated At</span>
                    <strong className="text-[#EEF0EA] print:text-black">{integrity.hash_generated_at}</strong>
                  </div>
                  <div>
                    <span className="text-[#62675C] uppercase block text-[10px]">Report Generated At</span>
                    <strong className="text-[#EEF0EA] print:text-black">{integrity.report_generated_at}</strong>
                  </div>
                  <div>
                    <span className="text-[#62675C] uppercase block text-[10px]">File Name</span>
                    <strong className="text-[#EEF0EA] print:text-black break-all">{integrity.file_name}</strong>
                  </div>
                  <div>
                    <span className="text-[#62675C] uppercase block text-[10px]">File Size</span>
                    <strong className="text-[#EEF0EA] print:text-black">{integrity.file_size_human}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VERIFY EVIDENCE INTEGRITY SECTION (PART 6) */}
      {report && (
        <div className="bg-[#131513] border border-[#23261F] rounded-xl p-6 space-y-4 print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#23261F] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0E2019] border border-[#0F3D2E] flex items-center justify-center text-[#34D399]">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-grotesk font-bold text-[#EEF0EA] tracking-tight">
                  Verify Evidence Integrity
                </h2>
                <p className="text-xs text-[#9BA096]">
                  Upload an existing forensic report artifact to compute its SHA-256 digest and compare it against the recorded evidence hash
                </p>
              </div>
            </div>
            {integrity && (
              <span className="text-[11px] font-mono text-[#62675C]">
                Target Evidence: <strong className="text-[#34D399]">{integrity.evidence_id}</strong>
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.json,.txt,*/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 px-4 py-2.5 bg-[#191B18] hover:bg-[#1E211D] border border-dashed border-[#31352C] rounded-lg text-xs font-mono text-[#EEF0EA] flex items-center justify-between cursor-pointer transition"
            >
              <span className="truncate">
                {selectedFile
                  ? `Selected: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)} KB)`
                  : 'Click to select forensic report file (e.g., forensic_report_FORENSIC-2026-0001.pdf)'}
              </span>
              <Upload className="w-4 h-4 text-[#34D399] shrink-0 ml-2" />
            </button>

            <button
              type="button"
              onClick={() => handleVerifyIntegrity()}
              disabled={!selectedFile || verifying}
              className="px-5 py-2.5 bg-[#34D399] hover:bg-[#2EB883] disabled:opacity-40 text-[#0A0B0A] rounded-lg text-xs font-grotesk font-bold flex items-center justify-center gap-2 cursor-pointer transition shrink-0"
            >
              {verifying ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Calculating SHA-256...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify SHA-256 Integrity</span>
                </>
              )}
            </button>
          </div>

          {verifyError && (
            <div className="p-3 bg-[#211110] border border-[#3D1815] rounded-lg text-xs font-mono text-[#F0554A] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{verifyError}</span>
            </div>
          )}

          {verificationResult && (
            <div
              className={`p-4 rounded-xl border space-y-3 font-mono text-xs ${
                verificationResult.verified
                  ? 'bg-[#0E2019]/60 border-[#0F3D2E] text-[#EEF0EA]'
                  : 'bg-[#211110]/80 border-[#3D1815] text-[#EEF0EA]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#23261F] pb-2.5">
                <div className="flex items-center gap-2">
                  {verificationResult.verified ? (
                    <ShieldCheck className="w-5 h-5 text-[#34D399]" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-[#F0554A]" />
                  )}
                  <span className="font-grotesk font-bold text-sm">
                    Evidence Integrity Verification
                  </span>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold inline-flex items-center gap-1.5 ${
                    verificationResult.verified
                      ? 'bg-[#0E2019] border border-[#34D399] text-[#34D399]'
                      : 'bg-[#211110] border border-[#F0554A] text-[#F0554A]'
                  }`}
                >
                  <span>Status: {verificationResult.status_label}</span>
                  <span>({verificationResult.status})</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 bg-[#131513] border border-[#23261F] rounded-lg">
                  <span className="text-[10px] uppercase text-[#62675C] block">
                    Expected SHA-256 ({verificationResult.evidence_id || integrity?.evidence_id || 'Recorded'}):
                  </span>
                  <div className="text-[#34D399] break-all select-all mt-0.5">
                    {verificationResult.expected_hash}
                  </div>
                </div>

                <div className="p-2.5 bg-[#131513] border border-[#23261F] rounded-lg">
                  <span className="text-[10px] uppercase text-[#62675C] block">
                    Calculated SHA-256 ({verificationResult.file_name}):
                  </span>
                  <div
                    className={`break-all select-all mt-0.5 ${
                      verificationResult.verified ? 'text-[#34D399]' : 'text-[#F0554A]'
                    }`}
                  >
                    {verificationResult.calculated_hash}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-[#9BA096]">
                <div>
                  <strong>File:</strong> {verificationResult.file_name} ({verificationResult.file_size.toLocaleString()} bytes)
                </div>
                <div>
                  <strong>Algorithm:</strong> {verificationResult.hash_algorithm}
                </div>
                <div>
                  <strong>Verified At:</strong> {verificationResult.verified_at}
                </div>
              </div>

              <p className="text-[11px] font-sans text-[#9BA096] leading-relaxed pt-1 border-t border-[#23261F]">
                {verificationResult.verification_note}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
