import React, { useState } from 'react';
import { Server, GitFork, ShieldAlert, Globe, Radio, AlertTriangle, Search, RefreshCw, Terminal } from 'lucide-react';
import { apiService } from '../services/api';

export const InfrastructurePage: React.FC = () => {
  const [emailInput, setEmailInput] = useState<string>('alert@sbi-verify.xyz');
  const [headerInput, setHeaderInput] = useState<string>(
    'Received: from mail.attacker.xyz (185.220.101.42) by mx.google.com with ESMTPS id x123\nReceived: from internal-node.local (10.0.0.5) by mail.attacker.xyz'
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [identityEmail, setIdentityEmail] = useState<string>('analyst@demo.local');
  const [identityLoading, setIdentityLoading] = useState<boolean>(false);
  const [identityOutput, setIdentityOutput] = useState<string>(
    'SENTINALS IDENTITY INTELLIGENCE v1.0\nLocal-only mode enabled. External OSINT lookups are disabled.\nEnter an authorized organization email to search local campaign evidence.'
  );

  // Resolved Infrastructure State
  const [geoResult, setGeoResult] = useState<any>({
    originating_ip: '185.220.101.42',
    country: 'Germany (DE)',
    region_city: 'Hessen, Frankfurt am Main',
    isp: 'M247 Europe S.R.L.',
    asn: 'ASN 45102',
    hosting_provider: 'Bulletproof VPS Host',
    relay_path: [
      '185.220.101.42 (Originating Relay Hop)',
      '198.51.100.24 (Border Mail Relay)',
      'MX Gateway Relay'
    ],
    disclaimer: 'IP geolocation identifies the probable location of the server/infrastructure, not necessarily the attacker\'s exact physical location.'
  });

  const handleExecuteLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!emailInput.trim() && !headerInput.trim()) return;

    setLoading(true);
    try {
      const data = await apiService.lookupInfrastructure(emailInput, headerInput);
      setGeoResult(data);
    } catch (err) {
      console.error('Infrastructure lookup failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleIdentityLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!identityEmail.trim()) return;
    setIdentityLoading(true);
    setIdentityOutput(`$ sentinals identity --email ${identityEmail.trim()}\nSearching authorized local evidence...`);
    try {
      const result = await apiService.lookupAuthorizedIdentity(identityEmail.trim());
      const records = result.records || [];
      const recordLines = records.length
        ? records.map((record: any) => `  - ${record.email_id} | ${record.threat_level} | ${record.subject}`).join('\n')
        : '  No local campaign records found.';
      setIdentityOutput([
        `$ sentinals identity --email ${result.email}`,
        `[status] ${result.status}`,
        `[domain] ${result.domain}`,
        `[notice] ${result.message}`,
        `[local records] ${records.length}`,
        recordLines
      ].join('\n'));
    } catch (err: any) {
      setIdentityOutput(`$ sentinals identity --email ${identityEmail.trim()}\n[error] ${err.message || 'Local lookup failed.'}`);
    } finally {
      setIdentityLoading(false);
    }
  };

  const sampleEmailInputs = [
    { label: 'SBI Phishing Email ID', email: 'alert@sbi-verify.xyz' },
    { label: 'HDFC Scam Email ID', email: 'notice@hdfc-secure.site' },
    { label: 'Paytm Reward Email ID', email: 'reward@paytm-cashback-claim.top' },
    { label: 'Corporate Meeting Mail', email: 'lead@enterprise.net' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* PAGE HEADER */}
      <div className="pb-4 border-b border-[#23261F] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-grotesk font-bold text-[#EEF0EA] tracking-tight flex items-center gap-2">
            <Server className="w-5 h-5 text-[#34D399]" />
            Infrastructure Intelligence & GeoIP Resolution
          </h1>
          <p className="text-xs text-[#9BA096] font-sans mt-0.5">
            Type email ID or paste headers ➔ Extract earliest reliable originating IP ➔ GeoIP lookup (Country, Region/City, ISP, ASN).
          </p>
        </div>
        <span className="px-3 py-1 bg-[#0E2019] border border-[#0F3D2E] text-[#34D399] font-mono text-xs font-bold rounded-full">
          Workflow Pipeline Active
        </span>
      </div>

      {/* MANDATORY SOC ANALYST DISCLAIMER BADGE */}
      <div className="p-4 bg-[#261F12] border border-[#453316] rounded-xl flex items-start gap-3 text-xs text-[#EEF0EA]">
        <AlertTriangle className="w-5 h-5 text-[#F0AA3D] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-grotesk font-bold text-[#F0AA3D] uppercase tracking-wider block">
            MANDATORY SOC LOCATION DISCLAIMER NOTICE
          </span>
          <p className="text-xs text-[#EEF0EA] leading-relaxed font-sans">
            IP geolocation identifies the <strong className="text-[#F0AA3D]">probable location of the server / hosting infrastructure</strong>, not necessarily the attacker's exact physical location.
          </p>
        </div>
      </div>

      {/* INPUT FORM: MANUAL EMAIL ID & HEADER PARSER WORKFLOW */}
      <div className="bg-[#131513] border border-[#23261F] rounded-xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-[#23261F] pb-3">
          <span className="text-xs font-mono font-bold text-[#EEF0EA] uppercase flex items-center gap-2">
            <Search className="w-4 h-4 text-[#34D399]" />
            Manual Email / Email ID Infrastructure Lookup Workflow
          </span>
          <div className="flex flex-wrap gap-1.5">
            {sampleEmailInputs.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  setEmailInput(s.email);
                  handleExecuteLookup();
                }}
                className="text-[10px] font-mono px-2 py-0.5 bg-[#191B18] hover:bg-[#1E211D] text-[#34D399] rounded border border-[#23261F] transition"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleExecuteLookup} className="space-y-4 text-xs font-sans">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* EMAIL / SENDER INPUT (7 cols) */}
            <div className="lg:col-span-7 space-y-1">
              <label className="text-[11px] font-mono font-semibold text-[#62675C] uppercase block">
                Sender Email Address / Email ID / Domain
              </label>
              <input
                type="text"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="e.g. alert@sbi-verify.xyz or notice@hdfc-secure.site"
                className="w-full px-3.5 py-2 border border-[#23261F] rounded-lg font-mono text-xs bg-[#191B18] text-[#EEF0EA] focus:outline-none focus:border-[#0F3D2E]"
              />
              <span className="text-[10px] font-mono text-[#62675C] block">
                Workflow: Email ID ➔ Domain DNS / Header ➔ Earliest Public IP ➔ GeoIP Lookup
              </span>
            </div>

            {/* RAW HEADERS / RECEIVED PATH (5 cols) */}
            <div className="lg:col-span-5 space-y-1">
              <label className="text-[11px] font-mono font-semibold text-[#62675C] uppercase block">
                Received Headers (Optional)
              </label>
              <input
                type="text"
                value={headerInput}
                onChange={(e) => setHeaderInput(e.target.value)}
                placeholder="Received: from mail.attacker.xyz (185.220.101.42)..."
                className="w-full px-3.5 py-2 border border-[#23261F] rounded-lg font-mono text-xs bg-[#191B18] text-[#EEF0EA] focus:outline-none focus:border-[#0F3D2E]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#34D399] hover:bg-[#2EB883] text-[#0A0B0A] rounded-lg font-grotesk font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#0A0B0A]" />
                <span>Running Header IP Extraction & GeoIP Resolution...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4 stroke-[2.5]" />
                <span>Execute Infrastructure GeoIP Resolution Workflow</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* 4-COLUMN INFRASTRUCTURE GEOIP METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#131513] border border-[#23261F] rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-[#62675C] uppercase block">Earliest Originating IP</span>
          <div className="text-base font-bold font-mono text-[#EEF0EA]">{geoResult.originating_ip || '185.220.101.42'}</div>
          <span className="text-[11px] font-mono text-[#34D399] block">Resolved from Received Relay</span>
        </div>

        <div className="p-4 bg-[#131513] border border-[#23261F] rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-[#62675C] uppercase block">Country & Region</span>
          <div className="text-base font-bold font-sans text-[#EEF0EA]">{geoResult.country || 'Germany (DE)'}</div>
          <span className="text-[11px] font-mono text-[#9BA096] block">{geoResult.region_city || 'Hessen, Frankfurt'}</span>
        </div>

        <div className="p-4 bg-[#131513] border border-[#23261F] rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-[#62675C] uppercase block">ISP & Hosting Provider</span>
          <div className="text-base font-bold font-sans text-[#EEF0EA] truncate">{geoResult.isp || 'M247 Europe S.R.L.'}</div>
          <span className="text-[11px] font-mono text-[#F0554A] block">{geoResult.hosting_provider || 'Bulletproof VPS Host'}</span>
        </div>

        <div className="p-4 bg-[#131513] border border-[#23261F] rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-[#62675C] uppercase block">Autonomous System (ASN)</span>
          <div className="text-base font-bold font-mono text-[#EEF0EA]">{geoResult.asn || 'ASN 45102'}</div>
          <span className="text-[11px] font-mono text-[#F0554A] block">High Abuse Reputation</span>
        </div>
      </div>

      {/* SPLIT PANE: RELAY PATH TRACE & RESOLVED GEOIP LOCATION TABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT 6 COLS: HEADER RECEIVED RELAY PATH TRACER */}
        <div className="lg:col-span-6 bg-[#131513] border border-[#23261F] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#23261F] pb-3">
            <h2 className="text-xs font-mono font-bold text-[#EEF0EA] uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#34D399]" />
              Received Header Relay Trace Workflow
            </h2>
            <span className="text-[10px] font-mono text-[#62675C]">BOTTOM-TO-TOP RELAY PARSER</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <span className="text-[10px] text-[#62675C] uppercase font-bold block">Extracted Relay Hops:</span>
            <div className="space-y-1.5 text-[11px]">
              {(geoResult.relay_path || []).map((hop: string, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-[#1E211D] border border-[#23261F] rounded">
                  <span className="text-[#EEF0EA] font-bold">Hop #{idx + 1}: {hop}</span>
                  <span className="text-[10px] text-[#34D399] bg-[#0E2019] px-2 py-0.5 rounded border border-[#0F3D2E]">PUBLIC RELAY</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT 6 COLS: PROBABLE GEOIP LOCATION TABLE */}
        <div className="lg:col-span-6 bg-[#131513] border border-[#23261F] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#23261F] pb-3">
            <h2 className="text-xs font-mono font-bold text-[#EEF0EA] uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#34D399]" />
              Resolved GeoIP Infrastructure Attributes
            </h2>
            <span className="text-[10px] font-mono text-[#34D399]">GEOIP RESOLVED</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-[#191B18] border border-[#23261F] rounded-lg grid grid-cols-2 gap-3">
              <div><span className="text-[#62675C] text-[10px] uppercase block">Originating IP</span><strong className="text-[#EEF0EA]">{geoResult.originating_ip}</strong></div>
              <div><span className="text-[#62675C] text-[10px] uppercase block">Country</span><strong className="text-[#34D399]">{geoResult.country}</strong></div>
              <div><span className="text-[#62675C] text-[10px] uppercase block">Region / City</span><strong className="text-[#EEF0EA]">{geoResult.region_city}</strong></div>
              <div><span className="text-[#62675C] text-[10px] uppercase block">ISP</span><strong className="text-[#EEF0EA]">{geoResult.isp}</strong></div>
              <div><span className="text-[#62675C] text-[10px] uppercase block">ASN</span><strong className="text-[#EEF0EA]">{geoResult.asn}</strong></div>
              <div><span className="text-[#62675C] text-[10px] uppercase block">Hosting Provider</span><strong className="text-[#EEF0EA]">{geoResult.hosting_provider}</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* SENTINALS IDENTITY INTELLIGENCE — AUTHORIZED LOCAL LOOKUP ONLY */}
      <div className="bg-[#0A0B0A] border border-[#0F3D2E] rounded-xl overflow-hidden shadow-panel">
        <div className="px-5 py-3 bg-[#101510] border-b border-[#0F3D2E] flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#34D399]" />
          <span className="text-xs font-mono font-bold text-[#34D399] uppercase tracking-wider">Sentinals Identity Intelligence Terminal</span>
          <span className="ml-auto text-[10px] font-mono text-[#9BA096]">AUTHORIZED LOCAL DATA ONLY</span>
        </div>
        <form onSubmit={handleIdentityLookup} className="p-4 border-b border-[#23261F] flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-black border border-[#23261F] rounded-lg font-mono text-xs text-[#34D399]">
            <span>$</span>
            <input
              type="email"
              value={identityEmail}
              onChange={(e) => setIdentityEmail(e.target.value)}
              placeholder="authorized.user@demo.local"
              className="flex-1 bg-transparent outline-none text-[#EEF0EA] placeholder:text-[#62675C]"
              aria-label="Authorized organization email"
            />
          </div>
          <button
            type="submit"
            disabled={identityLoading}
            className="px-4 py-2 bg-[#34D399] hover:bg-[#2EB883] disabled:opacity-50 text-[#0A0B0A] rounded-lg font-mono font-bold text-xs"
          >
            {identityLoading ? 'QUERYING...' : 'RUN LOCAL LOOKUP'}
          </button>
        </form>
        <pre className="min-h-40 p-5 overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-6 text-[#B7E4C7]">{identityOutput}</pre>
      </div>

      {/* INFRASTRUCTURE RELATIONSHIP CORRELATION TREE */}
      <div className="bg-[#131513] border border-[#23261F] rounded-xl p-5 space-y-4">
        <h2 className="text-xs font-grotesk font-bold text-[#EEF0EA] uppercase tracking-wider border-b border-[#23261F] pb-2 flex items-center gap-2">
          <GitFork className="w-4 h-4 text-[#34D399]" />
          Infrastructure Relationship Correlation Tree
        </h2>

        <div className="p-4 bg-[#191B18] border border-[#23261F] rounded-lg font-mono text-xs space-y-4 text-[#EEF0EA]">
          <div className="flex items-center gap-2 font-bold text-[#EEF0EA]">
            <span className="px-2 py-0.5 bg-[#0E2019] text-[#34D399] border border-[#0F3D2E] rounded text-[10px]">TARGET DOMAIN</span>
            <span>{emailInput} ({geoResult.originating_ip})</span>
          </div>

          <div className="pl-6 border-l-2 border-[#23261F] space-y-3">
            <div className="space-y-1">
              <span className="text-[#62675C] text-[11px] font-bold">├── Shared ASN Cluster ({geoResult.asn} - {geoResult.isp})</span>
              <div className="pl-6 text-[11px] text-[#9BA096] space-y-1">
                <div>• Co-hosted infrastructure in {geoResult.region_city || geoResult.country}</div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[#62675C] text-[11px] font-bold">└── SSL Certificate & Name Server Fingerprint</span>
              <div className="pl-6 text-[11px] text-[#9BA096]">
                • SHA256: <code className="bg-[#1E211D] px-1.5 py-0.5 rounded text-[#34D399]">e3b0c44298fc1c149afbf4c8996fb924...</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
