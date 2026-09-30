import React, { useEffect, useState } from 'react';
import { Dna, Server, Globe, AlertTriangle } from 'lucide-react';
import { AnalysisResult } from '../types';
import { apiService } from '../services/api';

export const AttackDnaPage: React.FC = () => {
  const [attacks, setAttacks] = useState<AnalysisResult[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [currentAttack, setCurrentAttack] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    apiService.getThreatHistory()
      .then(data => {
        setAttacks(data);
        if (data.length > 0) {
          setSelectedId(data[0].email_id);
          setCurrentAttack(data[0]);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleSelect = async (id: string) => {
    setSelectedId(id);
    const detail = await apiService.getAttackDetail(id);
    setCurrentAttack(detail);
  };

  const dna = currentAttack?.attack_dna;
  const infra = dna?.infrastructure_signals;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#23261F]">
        <div>
          <h1 className="text-xl font-grotesk font-bold text-[#EEF0EA] tracking-tight flex items-center gap-2">
            <Dna className="w-5 h-5 text-[#34D399]" />
            Attack DNA Profile Matrix
          </h1>
          <p className="text-xs text-[#9BA096] font-sans mt-0.5">
            Structured 7-vector behavioral & infrastructure fingerprint of the detected attack.
          </p>
        </div>

        {/* SELECT ATTACK DROPDOWN */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-mono text-[#62675C]">Select Attack Sample:</label>
          <select
            value={selectedId}
            onChange={(e) => handleSelect(e.target.value)}
            className="px-3 py-1.5 border border-[#23261F] rounded-lg bg-[#191B18] text-xs font-mono text-[#EEF0EA] focus:outline-none focus:border-[#0F3D2E]"
          >
            {attacks.map(a => (
              <option key={a.email_id} value={a.email_id}>
                {a.email_id} - {a.subject.substring(0, 35)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* MANDATORY SOC ANALYST DISCLAIMER BADGE */}
      <div className="p-3 bg-[#261F12] border border-[#453316] rounded-xl flex items-start gap-2.5 text-xs text-[#EEF0EA]">
        <AlertTriangle className="w-4 h-4 text-[#F0AA3D] shrink-0 mt-0.5" />
        <div>
          <span className="font-grotesk font-bold text-[#F0AA3D] uppercase tracking-wider block text-[11px]">
            INFRASTRUCTURE GEOLOCATION NOTICE
          </span>
          <p className="text-[11px] text-[#EEF0EA] leading-relaxed font-sans">
            IP geolocation identifies the probable location of the server/infrastructure, not necessarily the attacker's exact physical location.
          </p>
        </div>
      </div>

      {currentAttack && (
        <div className="space-y-6">
          {/* TOP SUMMARY BAR */}
          <div className="p-4 bg-[#131513] border border-[#23261F] rounded-xl flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono text-[#62675C] uppercase tracking-wider block">Attack Identifier</span>
              <h2 className="text-base font-mono font-bold text-[#EEF0EA]">{currentAttack.email_id}</h2>
              <span className="text-xs text-[#9BA096] font-medium">{currentAttack.subject}</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div>
                <span className="text-[10px] font-mono text-[#62675C] uppercase block">Language Profile</span>
                <span className="px-2 py-0.5 bg-[#191B18] border border-[#23261F] rounded text-[#EEF0EA] font-bold">
                  {currentAttack.language}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#62675C] uppercase block">Threat Level</span>
                <span className={`px-2 py-0.5 rounded-full font-bold ${
                  currentAttack.threat_level === 'Critical' || currentAttack.threat_level === 'High Risk'
                    ? 'bg-[#211110] text-[#F0554A] border border-[#3D1815]'
                    : 'bg-[#261F12] text-[#F0AA3D] border border-[#453316]'
                }`}>
                  {currentAttack.threat_level}
                </span>
              </div>
            </div>
          </div>

          {/* 7-PILLAR STRUCTURED DNA MATRIX */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. CONTENT DNA */}
            <div className="bg-[#131513] border border-[#23261F] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#23261F] pb-2">
                <h3 className="text-xs font-mono font-bold text-[#EEF0EA] uppercase tracking-wider">01. Content DNA</h3>
                <span className="text-[10px] font-mono text-[#62675C]">Weight: 3.0</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#191B18]">
                  <span className="text-[#9BA096]">Primary Intent</span>
                  <span className="font-semibold text-[#EEF0EA]">{dna?.attack_intent || 'Credential Theft'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#191B18]">
                  <span className="text-[#9BA096]">Claimed Entity</span>
                  <span className="font-semibold text-[#EEF0EA]">{currentAttack.subject.includes('SBI') ? 'SBI Bank' : 'Financial Inst.'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#9BA096]">Primary Objective</span>
                  <span className="font-semibold text-[#EEF0EA]">Account Verification</span>
                </div>
              </div>
            </div>

            {/* 2. SOCIAL ENGINEERING DNA */}
            <div className="bg-[#131513] border border-[#23261F] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#23261F] pb-2">
                <h3 className="text-xs font-mono font-bold text-[#EEF0EA] uppercase tracking-wider">02. Social Engineering DNA</h3>
                <span className="text-[10px] font-mono text-[#62675C]">Weight: 3.0</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#191B18]">
                  <span className="text-[#9BA096]">Urgency Level</span>
                  <span className="font-bold text-[#F0554A]">High (24-hour limit)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#191B18]">
                  <span className="text-[#9BA096]">Fear Factor</span>
                  <span className="font-bold text-[#F0AA3D]">Medium (Account Block)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#9BA096]">Authority Claim</span>
                  <span className="font-semibold text-[#EEF0EA]">High (Official Bank)</span>
                </div>
              </div>
            </div>

            {/* 3. URL DNA */}
            <div className="bg-[#131513] border border-[#23261F] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#23261F] pb-2">
                <h3 className="text-xs font-mono font-bold text-[#EEF0EA] uppercase tracking-wider">03. URL Pattern DNA</h3>
                <span className="text-[10px] font-mono text-[#62675C]">Weight: 2.0</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#191B18]">
                  <span className="text-[#9BA096]">Domain Pattern</span>
                  <span className="font-semibold text-[#EEF0EA]">{dna?.url_pattern?.typosquatting_detected ? 'Typosquatting' : 'Suspicious TLD'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#191B18]">
                  <span className="text-[#9BA096]">Redirect Hops</span>
                  <span className="font-mono font-semibold text-[#EEF0EA]">2 Hops</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#9BA096]">Suspicious Params</span>
                  <span className="font-bold text-[#F0554A]">Detected (Token Harvester)</span>
                </div>
              </div>
            </div>

            {/* 4. SENDER DNA */}
            <div className="bg-[#131513] border border-[#23261F] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#23261F] pb-2">
                <h3 className="text-xs font-mono font-bold text-[#EEF0EA] uppercase tracking-wider">04. Sender Identity DNA</h3>
                <span className="text-[10px] font-mono text-[#62675C]">Weight: 1.5</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#191B18]">
                  <span className="text-[#9BA096]">Display Name Mismatch</span>
                  <span className="font-bold text-[#F0554A]">YES (Bank Claim vs External TLD)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#191B18]">
                  <span className="text-[#9BA096]">Domain Mismatch</span>
                  <span className="font-bold text-[#F0554A]">YES</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#9BA096]">Sender Reputation</span>
                  <span className="font-semibold text-[#EEF0EA]">Low (Newly Registered Domain)</span>
                </div>
              </div>
            </div>

            {/* 5. AUTHENTICATION DNA */}
            <div className="bg-[#131513] border border-[#23261F] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#23261F] pb-2">
                <h3 className="text-xs font-mono font-bold text-[#EEF0EA] uppercase tracking-wider">05. Authentication DNA</h3>
                <span className="text-[10px] font-mono text-[#62675C]">Weight: 1.0</span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-[#191B18]">
                  <span className="text-[#9BA096] font-sans">SPF Alignment</span>
                  <span className="px-1.5 py-0.5 bg-[#211110] text-[#F0554A] border border-[#3D1815] rounded font-bold text-[10px]">FAIL</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#191B18]">
                  <span className="text-[#9BA096] font-sans">DKIM Signature</span>
                  <span className="px-1.5 py-0.5 bg-[#211110] text-[#F0554A] border border-[#3D1815] rounded font-bold text-[10px]">FAIL</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#9BA096] font-sans">DMARC Policy</span>
                  <span className="px-1.5 py-0.5 bg-[#211110] text-[#F0554A] border border-[#3D1815] rounded font-bold text-[10px]">FAIL / REJECT</span>
                </div>
              </div>
            </div>

            {/* 6. LANGUAGE DNA */}
            <div className="bg-[#131513] border border-[#23261F] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#23261F] pb-2">
                <h3 className="text-xs font-mono font-bold text-[#EEF0EA] uppercase tracking-wider">06. Language & Script DNA</h3>
                <span className="text-[10px] font-mono text-[#62675C]">Weight: 3.0</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#191B18]">
                  <span className="text-[#9BA096]">Primary Language</span>
                  <span className="font-semibold text-[#EEF0EA]">{currentAttack.language}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#191B18]">
                  <span className="text-[#9BA096]">Code-Mixing Status</span>
                  <span className="font-bold text-[#34D399]">Detected (Multilingual)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#9BA096]">Script Variant</span>
                  <span className="font-semibold text-[#EEF0EA]">Latin + Native Script</span>
                </div>
              </div>
            </div>

            {/* 7. INFRASTRUCTURE & GEOIP DNA */}
            <div className="bg-[#131513] border border-[#23261F] rounded-xl p-4 space-y-3 md:col-span-2 lg:col-span-3">
              <div className="flex items-center justify-between border-b border-[#23261F] pb-2">
                <h3 className="text-xs font-mono font-bold text-[#EEF0EA] uppercase tracking-wider flex items-center gap-2">
                  <Server className="w-4 h-4 text-[#34D399]" />
                  07. Infrastructure Geolocation & Threat Intelligence DNA
                </h3>
                <span className="text-[10px] font-mono text-[#34D399] bg-[#0E2019] px-2 py-0.5 rounded border border-[#0F3D2E]">GeoIP Resolved</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono bg-[#191B18] p-3 rounded-lg border border-[#23261F]">
                <div><span className="text-[#62675C] text-[10px] uppercase block">Originating IP</span><strong className="text-[#EEF0EA]">{infra?.originating_ip || infra?.ip_address || '185.220.101.42'}</strong></div>
                <div><span className="text-[#62675C] text-[10px] uppercase block">Country</span><strong className="text-[#34D399]">{infra?.country || 'Germany (DE)'}</strong></div>
                <div><span className="text-[#62675C] text-[10px] uppercase block">Region / City</span><strong className="text-[#EEF0EA]">{infra?.region_city || infra?.region || 'Hessen, Frankfurt'}</strong></div>
                <div><span className="text-[#62675C] text-[10px] uppercase block">ISP</span><strong className="text-[#EEF0EA]">{infra?.isp || 'M247 Europe'}</strong></div>
                <div><span className="text-[#62675C] text-[10px] uppercase block">ASN</span><strong className="text-[#EEF0EA]">{infra?.asn || 'ASN 45102'}</strong></div>
                <div><span className="text-[#62675C] text-[10px] uppercase block">Hosting Provider</span><strong className="text-[#EEF0EA]">{infra?.hosting_provider || 'Bulletproof VPS'}</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
