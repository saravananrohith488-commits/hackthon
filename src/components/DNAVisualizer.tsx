import React, { useState } from 'react';
import { AttackDNA } from '../types';
import { Shield, Globe, Cpu, Lock, AlertTriangle, Fingerprint, Eye, Sparkles } from 'lucide-react';

interface DNAVisualizerProps {
  dna: AttackDNA;
  language?: string;
  threatLevel?: string;
}

export const DNAVisualizer: React.FC<DNAVisualizerProps> = ({ dna, language = "English", threatLevel = "High Risk" }) => {
  const [selectedSegment, setSelectedSegment] = useState<string>('intent');

  const segments = [
    { id: 'intent', title: 'Attack Intent', icon: '🧠', color: 'bg-[#FF5DA2]', border: 'border-[#241A3D]', desc: dna.attack_intent },
    { id: 'tactics', title: 'Social Tactics', icon: '🎭', color: 'bg-[#FFD23F]', border: 'border-[#241A3D]', desc: dna.social_engineering_tactics.join(', ') },
    { id: 'semantic', title: 'Semantic Signature', icon: '💬', color: 'bg-[#2EC4B6]', border: 'border-[#241A3D]', desc: `Multilingual latent vector (${language})` },
    { id: 'url', title: 'URL Pattern', icon: '🌐', color: 'bg-[#FFA630]', border: 'border-[#241A3D]', desc: `${dna.url_pattern.extracted_urls.length} URLs extracted` },
    { id: 'infra', title: 'Infrastructure', icon: '🖥️', color: 'bg-[#FF5A5F]', border: 'border-[#241A3D]', desc: `IP: ${dna.infrastructure_signals.ip_address}` },
    { id: 'auth', title: 'Authentication', icon: '✉️', color: 'bg-[#06D6A0]', border: 'border-[#241A3D]', desc: `SPF: ${dna.authentication_signals.spf}` },
  ];

  return (
    <div className="relative p-6 bg-[#FFFDF9] border-[3px] border-[#241A3D] rounded-3xl shadow-sticker overflow-hidden">
      {/* Top Corner Washi Tape */}
      <div className="absolute -top-3 left-8 w-28 h-6 washi-tape-pink transform -rotate-3 z-10"></div>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFD23F] border-2 border-[#241A3D] rounded-full text-xs font-bold font-mono text-[#241A3D] mb-2 shadow-[2px_2px_0px_#241A3D]">
            <span>🧬 ATTACK DNA FINGERPRINT CARD</span>
          </div>
          <h3 className="font-fredoka text-2xl text-[#241A3D]">Multilingual Attack DNA Helix</h3>
          <p className="font-caveat text-xl text-[#FF5DA2]">
            "We fingerprint the attack intent, not just the surface words! 🕵️"
          </p>
        </div>

        <div className="px-4 py-2 bg-[#FFF3E4] border-2 border-[#241A3D] rounded-2xl shadow-[3px_3px_0px_#241A3D] text-right">
          <div className="text-xs font-mono font-bold text-[#241A3D]">ATTACK TYPE</div>
          <div className="font-fredoka text-lg text-[#FF5DA2]">{dna.attack_type}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* DNA Helix Centerpiece (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-[#FFF8EF] border-2 border-dashed border-[#241A3D] rounded-3xl relative overflow-hidden">
          {/* Confetti particles */}
          <div className="absolute top-4 left-4 w-3 h-3 bg-[#FF5DA2] transform rotate-12"></div>
          <div className="absolute bottom-6 right-6 w-3 h-3 bg-[#FFD23F] transform -rotate-45"></div>
          <div className="absolute top-8 right-8 w-2 h-2 bg-[#2EC4B6] rounded-full"></div>

          {/* Interactive Bouncing Double Helix Graphic */}
          <div className="relative w-48 h-56 flex items-center justify-center animate-float-slow">
            <svg viewBox="0 0 160 220" className="w-full h-full">
              <defs>
                <filter id="shadow">
                  <feDropShadow dx="2" dy="2" stdDeviation="0" floodColor="#241A3D"/>
                </filter>
              </defs>
              
              {/* Strand 1 (Hot Pink) */}
              <path
                d="M 40 20 Q 120 70 40 110 T 40 200"
                fill="none"
                stroke="#FF5DA2"
                strokeWidth="6"
                strokeLinecap="round"
                filter="url(#shadow)"
              />
              {/* Strand 2 (Sunshine Yellow) */}
              <path
                d="M 120 20 Q 40 70 120 110 T 120 200"
                fill="none"
                stroke="#FFD23F"
                strokeWidth="6"
                strokeLinecap="round"
                filter="url(#shadow)"
              />

              {/* Rung Rungs / Connections */}
              {[35, 75, 110, 145, 185].map((y, idx) => (
                <line
                  key={idx}
                  x1={idx % 2 === 0 ? 55 : 75}
                  y1={y}
                  x2={idx % 2 === 0 ? 105 : 85}
                  y2={y}
                  stroke="#241A3D"
                  strokeWidth="4"
                  strokeDasharray="3,3"
                />
              ))}

              {/* Nodes with Googly Eyes */}
              {[
                { x: 40, y: 20, col: '#FF5DA2' },
                { x: 120, y: 20, col: '#FFD23F' },
                { x: 80, y: 65, col: '#2EC4B6' },
                { x: 40, y: 110, col: '#FF5DA2' },
                { x: 120, y: 110, col: '#FFD23F' },
                { x: 80, y: 155, col: '#FFA630' },
                { x: 40, y: 200, col: '#FF5DA2' },
                { x: 120, y: 200, col: '#FFD23F' },
              ].map((node, i) => (
                <g key={i}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="12"
                    fill="#FFFDF9"
                    stroke={node.col}
                    strokeWidth="4"
                    filter="url(#shadow)"
                  />
                  {/* Googly Eye Pupils */}
                  <circle cx={node.x - 3} cy={node.y - 2} r="3" fill="#241A3D" />
                  <circle cx={node.x + 4} cy={node.y - 2} r="2" fill="#241A3D" />
                  <circle cx={node.x - 4} cy={node.y - 3} r="1" fill="#FFFDF9" />
                </g>
              ))}
            </svg>
          </div>

          <div className="mt-2 text-center">
            <span className="font-mono text-xs font-bold text-[#241A3D] bg-[#FFD23F] px-3 py-1 rounded-full border-2 border-[#241A3D] inline-flex items-center gap-1 shadow-[2px_2px_0px_#241A3D]">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5DA2]" />
              SEMANTIC VECTOR: 64-DIM
            </span>
          </div>
        </div>

        {/* 6 Segment Buttons & Evidence Inspector (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {segments.map((seg) => (
              <button
                key={seg.id}
                onClick={() => setSelectedSegment(seg.id)}
                className={`p-3 text-left rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedSegment === seg.id
                    ? `${seg.color} text-[#241A3D] border-[#241A3D] shadow-[4px_4px_0px_#241A3D] -translate-y-1`
                    : 'bg-[#FFF3E4] text-[#241A3D] border-[#241A3D] hover:bg-white hover:shadow-[3px_3px_0px_#241A3D]'
                }`}
              >
                <div className="text-xl mb-1">{seg.icon}</div>
                <div className="font-fredoka text-sm font-bold leading-tight">{seg.title}</div>
                <div className="font-mono text-[10px] truncate opacity-80 mt-1">{seg.desc}</div>
              </button>
            ))}
          </div>

          {/* Detailed Evidence Panel for Selected Segment */}
          <div className="p-5 bg-[#FFF8EF] border-3 border-[#241A3D] rounded-2xl shadow-[4px_4px_0px_#241A3D] relative">
            <div className="font-fredoka text-lg text-[#241A3D] flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-[#FF5DA2]" />
              Evidence Inspector: {segments.find(s => s.id === selectedSegment)?.title}
            </div>

            {selectedSegment === 'intent' && (
              <div className="space-y-2 text-sm font-nunito">
                <div><span className="font-bold">Detected Intent:</span> <span className="font-mono bg-[#FF5DA2] text-white px-2 py-0.5 rounded border border-[#241A3D] font-bold">{dna.attack_intent}</span></div>
                <p className="text-xs text-[#241A3D]/80">The primary objective extracted from social engineering patterns and call-to-action triggers.</p>
              </div>
            )}

            {selectedSegment === 'tactics' && (
              <div className="space-y-2 text-sm font-nunito">
                <div className="font-bold">Social Engineering Tactics Used:</div>
                <div className="flex flex-wrap gap-2">
                  {dna.social_engineering_tactics.map((t, idx) => (
                    <span key={idx} className="bg-[#FFD23F] text-[#241A3D] font-bold px-3 py-1 rounded-full border-2 border-[#241A3D] text-xs font-mono shadow-[2px_2px_0px_#241A3D]">
                      🎭 {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedSegment === 'semantic' && (
              <div className="space-y-2 text-sm font-nunito">
                <div className="font-bold">Multilingual Semantic Signature Sample:</div>
                <div className="font-mono text-xs p-3 bg-white border-2 border-[#241A3D] rounded-xl flex flex-wrap gap-1">
                  {(dna.semantic_signature_summary || [0.12, 0.45, 0.88, 0.34, 0.91]).slice(0, 8).map((val, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 bg-[#2EC4B6]/20 border border-[#2EC4B6] rounded text-[#241A3D]">
                      {val.toFixed(3)}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-[#241A3D]/80 italic font-caveat text-base text-[#FF5DA2]">
                  "Preserves semantic meaning across English, Tamil, Tanglish, Hindi, & Hinglish!"
                </div>
              </div>
            )}

            {selectedSegment === 'url' && (
              <div className="space-y-2 text-sm font-nunito">
                <div><span className="font-bold">Extracted Domains:</span> {dna.url_pattern.domains.join(', ') || 'None'}</div>
                <div><span className="font-bold">Typosquatting Risk:</span> {dna.url_pattern.typosquatting_detected ? '🚨 YES (Suspicious TLD/Brand Spoof)' : '✅ Low'}</div>
                <div><span className="font-bold">Suspicious Keywords:</span> {dna.url_pattern.suspicious_keywords.join(', ') || 'None'}</div>
              </div>
            )}

            {selectedSegment === 'infra' && (
              <div className="space-y-2 text-sm font-nunito">
                <div><span className="font-bold">Hosting IP Address:</span> <span className="font-mono font-bold bg-[#FF5A5F] text-white px-2 py-0.5 rounded border border-[#241A3D]">{dna.infrastructure_signals.ip_address}</span></div>
                <div><span className="font-bold">Hosting Provider:</span> {dna.infrastructure_signals.hosting_provider}</div>
                <div><span className="font-bold">Domain TLD:</span> .{dna.infrastructure_signals.tld}</div>
              </div>
            )}

            {selectedSegment === 'auth' && (
              <div className="space-y-2 text-sm font-nunito">
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold text-xs">
                  <div className={`p-2 rounded-xl border-2 border-[#241A3D] ${dna.authentication_signals.spf === 'PASS' ? 'bg-[#06D6A0]' : 'bg-[#FF5A5F] text-white'}`}>
                    SPF: {dna.authentication_signals.spf}
                  </div>
                  <div className={`p-2 rounded-xl border-2 border-[#241A3D] ${dna.authentication_signals.dkim === 'PASS' ? 'bg-[#06D6A0]' : 'bg-[#FF5A5F] text-white'}`}>
                    DKIM: {dna.authentication_signals.dkim}
                  </div>
                  <div className={`p-2 rounded-xl border-2 border-[#241A3D] ${dna.authentication_signals.dmarc === 'PASS' ? 'bg-[#06D6A0]' : 'bg-[#FF5A5F] text-white'}`}>
                    DMARC: {dna.authentication_signals.dmarc}
                  </div>
                </div>
                <div className="text-xs font-bold text-[#241A3D] mt-2">
                  Header Alignment Mismatches: {dna.authentication_signals.sender_domain_mismatch ? '⚠️ Sender Mismatch' : '✅ Sender Domain OK'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
