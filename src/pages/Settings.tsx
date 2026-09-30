import React, { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Save, RefreshCw, Sliders } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [weights, setWeights] = useState({
    intent: 3,
    tactics: 3,
    semantic: 3,
    url: 2,
    infra: 1,
    header: 1
  });

  const [saved, setSaved] = useState<boolean>(false);
  const [reseeded, setReseeded] = useState<boolean>(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setDemoMode(data.demo_mode);
      if (data.weights) setWeights(data.weights);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demo_mode: demoMode, weights })
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReseed = async () => {
    try {
      await fetch('/api/demo/load', { method: 'POST' });
      setReseeded(true);
      setTimeout(() => setReseeded(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* PAGE HEADER */}
      <div className="pb-4 border-b border-[#23261F]">
        <h1 className="text-xl font-grotesk font-bold text-[#EEF0EA] tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-[#34D399]" />
          System Settings & Model Thresholds
        </h1>
        <p className="text-xs text-[#9BA096] font-sans mt-0.5">
          Configure feature weights, operational inference modes, and intelligence thresholds.
        </p>
      </div>

      {/* OPERATIONAL MODE */}
      <div className="p-5 bg-[#131513] border border-[#23261F] rounded-xl space-y-4">
        <h2 className="text-xs font-mono font-bold text-[#EEF0EA] uppercase tracking-wider border-b border-[#23261F] pb-2">
          Inference Engine Mode
        </h2>
        
        <div className="flex items-center justify-between p-4 bg-[#191B18] border border-[#23261F] rounded-lg">
          <div>
            <div className="text-xs font-grotesk font-bold text-[#EEF0EA]">Multilingual Embedding Classification Engine</div>
            <p className="text-[11px] text-[#9BA096] mt-0.5">
              Uses multilingual MiniLM embeddings with a Logistic Regression classifier to process English, Tamil, Tanglish, Hindi, and Hinglish.
            </p>
          </div>
          <button
            onClick={() => setDemoMode(!demoMode)}
            className={`px-3 py-1.5 font-mono text-xs font-semibold rounded-lg border transition ${
              demoMode 
                ? 'bg-[#0E2019] text-[#34D399] border-[#0F3D2E]' 
                : 'bg-[#191B18] text-[#EEF0EA] border-[#23261F]'
            }`}
          >
            {demoMode ? 'PRODUCTION MODEL ACTIVE' : 'DEMO MODE'}
          </button>
        </div>
      </div>

      {/* WEIGHT CONFIGURATION */}
      <div className="p-5 bg-[#131513] border border-[#23261F] rounded-xl space-y-4">
        <h2 className="text-xs font-mono font-bold text-[#EEF0EA] uppercase tracking-wider border-b border-[#23261F] pb-2 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#34D399]" />
          Defensible Vector Weight Configuration
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {Object.entries(weights).map(([k, val]) => (
            <div key={k} className="p-3 bg-[#191B18] border border-[#23261F] rounded-lg space-y-1">
              <div className="flex justify-between font-bold capitalize text-[#EEF0EA]">
                <span>{k} Vector Weight:</span>
                <span className="text-[#34D399]">{val}</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={val}
                onChange={(e) => setWeights({ ...weights, [k]: parseFloat(e.target.value) })}
                className="w-full accent-[#34D399] cursor-pointer"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#34D399] hover:bg-[#2EB883] text-[#0A0B0A] text-xs font-grotesk font-bold rounded-lg flex items-center gap-2 transition"
          >
            <Save className="w-3.5 h-3.5" />
            {saved ? 'Settings Saved' : 'Save Vector Weights'}
          </button>

          <button
            onClick={handleReseed}
            className="px-4 py-2 bg-[#191B18] hover:bg-[#1E211D] border border-[#23261F] text-[#EEF0EA] text-xs font-mono rounded-lg flex items-center gap-2 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {reseeded ? 'Database Reseeded' : 'Reload Dataset Ingestion'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
