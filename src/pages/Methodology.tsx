import React from 'react';
import { BookOpen, ShieldAlert, Award, CheckCircle, HelpCircle } from 'lucide-react';

export const Methodology: React.FC = () => {
  return (
    <div className="space-[#241A3D] space-y-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFD23F] border-2 border-[#241A3D] rounded-full text-xs font-bold font-mono text-[#241A3D] mb-2 shadow-[2px_2px_0px_#241A3D]">
          <span>📐 SCIENTIFIC METHODOLOGY & DEFENSIBLE WEIGHTING</span>
        </div>
        <h1 className="font-fredoka text-4xl text-[#241A3D] squiggly-line inline-block">
          BhashaShield Architecture & Science
        </h1>
        <p className="font-caveat text-2xl text-[#FF5DA2] mt-1">
          "Defensible mutation-cost weighting, multilingual embeddings, and scientific transparency! 🧬"
        </p>
      </div>

      {/* Scientific Honesty & Disclaimer Banner */}
      <div className="p-6 bg-[#FFEBEB] border-[3px] border-[#FF5A5F] rounded-3xl shadow-sticker-pink relative">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#FF5A5F] text-white rounded-2xl border-2 border-[#241A3D] shadow-[2px_2px_0px_#241A3D]">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="font-fredoka text-2xl text-[#241A3D]">Scientific Honesty & Prototype Calibration Notice</h3>
            <p className="font-nunito text-sm text-[#241A3D]">
              <strong>Threshold Disclaimer:</strong> Thresholds shown in this prototype (<strong>Likely Related ≥ 45%</strong>, <strong>Possible Relationship 30–45%</strong>) are <em>experimentally chosen prototype calibration values</em> and require validation using large-scale real labeled phishing campaign datasets before production deployment.
            </p>
            <div className="font-mono text-xs text-[#FF5A5F] font-bold">
              ⚠️ NOT LABELED PRODUCTION VALIDATED THRESHOLDS • PROTOTYPE DEMONSTRATION CALIBRATION
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: The BhashaShield Approach */}
      <div className="p-6 bg-[#FFFDF9] border-[3px] border-[#241A3D] rounded-3xl shadow-sticker space-y-4">
        <h2 className="font-fredoka text-3xl text-[#241A3D]">1. Multilingual Semantic Understanding</h2>
        <p className="font-nunito text-base text-[#241A3D]">
          Traditional email security systems fail on mixed-language attacks (e.g. Tanglish or Hinglish) because they rely on word-for-word machine translation or keyword matchers.
          BhashaShield maps emails directly into a <strong>multilingual semantic vector space</strong> where English, Tamil, Tanglish, Hindi, and Hinglish emails expressing identical scam intent map to adjacent points in the latent space.
        </p>
      </div>

      {/* Section 2: Defensible Weighting System */}
      <div className="p-6 bg-[#FFFDF9] border-[3px] border-[#241A3D] rounded-3xl shadow-sticker space-y-4">
        <h2 className="font-fredoka text-3xl text-[#241A3D]">2. Mutation-Cost-Based Defensible Weighting</h2>
        <p className="font-nunito text-base text-[#241A3D]">
          Why do we weight features differently? We assign weights based on the <strong>approximate effort required for an attacker to mutate a feature</strong>:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-nunito text-sm">
          <div className="p-4 bg-[#FFEBEB] border-2 border-[#241A3D] rounded-2xl space-y-2">
            <div className="font-fredoka text-lg text-[#FF5A5F]">HIGH WEIGHT (Weight = 3)</div>
            <div className="font-bold text-[#241A3D]">Core Attack Identity</div>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Attack Intent (Credential theft, fraud)</li>
              <li>Social Engineering Tactics (Urgency, Fear)</li>
              <li>Multilingual Semantic Meaning</li>
            </ul>
            <p className="text-[11px] text-[#241A3D]/80"><em>Reason:</em> Changing core intent requires redesigning the entire scam.</p>
          </div>

          <div className="p-4 bg-[#FFF3E4] border-2 border-[#241A3D] rounded-2xl space-y-2">
            <div className="font-fredoka text-lg text-[#FFA630]">MEDIUM WEIGHT (Weight = 2)</div>
            <div className="font-bold text-[#241A3D]">Campaign Pattern</div>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>URL / Domain naming structure</li>
              <li>Typosquatting patterns</li>
            </ul>
            <p className="text-[11px] text-[#241A3D]/80"><em>Reason:</em> Registering new domains requires moderate effort & cost.</p>
          </div>

          <div className="p-4 bg-[#F0FDF4] border-2 border-[#241A3D] rounded-2xl space-y-2">
            <div className="font-fredoka text-lg text-[#06D6A0]">LOW WEIGHT (Weight = 1)</div>
            <div className="font-bold text-[#241A3D]">Easily Mutated Signals</div>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Infrastructure / Hosting IP</li>
              <li>Header & Authentication flags</li>
            </ul>
            <p className="text-[11px] text-[#241A3D]/80"><em>Reason:</em> Attackers rotate IPs and senders easily.</p>
          </div>
        </div>

        {/* Formula Display */}
        <div className="mt-4 p-4 bg-[#FFF8EF] border-2 border-[#241A3D] rounded-2xl font-mono text-xs font-bold text-[#241A3D]">
          <div className="text-[#FF5DA2] font-fredoka text-base mb-1">Mathematical Formula:</div>
          <div className="p-3 bg-white border border-[#241A3D] rounded-xl text-center text-[#FF5DA2]">
            Final Similarity = (3 × Intent + 3 × Tactics + 3 × Semantic + 2 × URL + 1 × Infra + 1 × Header) / 13 × 100
          </div>
        </div>
      </div>

      {/* Section 3: Limitations & Future Work */}
      <div className="p-6 bg-[#FFFDF9] border-[3px] border-[#241A3D] rounded-3xl shadow-sticker space-y-4">
        <h2 className="font-fredoka text-3xl text-[#241A3D]">3. Technical Limitations & Production Roadmap</h2>
        <ul className="space-y-2 text-sm font-nunito list-disc list-inside text-[#241A3D]">
          <li><strong>Prototype Dataset:</strong> Prototype uses synthetic demonstration dataset for hackathon presentation.</li>
          <li><strong>Graph Scalability:</strong> NetworkX is used for prototype-scale graph visualization. Production deployment would transition to Neo4j or Amazon Neptune.</li>
          <li><strong>Embedding Providers:</strong> Supports local MiniLM transformer model with fast semantic fallback engine in demo mode.</li>
        </ul>
      </div>
    </div>
  );
};
