import React, { useEffect, useState } from 'react';
import { Share2, Search, Filter, X, Info, Layers } from 'lucide-react';
import { NetworkGraph, GraphNode } from '../types';
import { apiService } from '../services/api';

export const CampaignGraphPage: React.FC = () => {
  const [graphData, setGraphData] = useState<NetworkGraph | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterType, setFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    apiService.getAttackGraph()
      .then(data => {
        setGraphData(data);
        if (data.nodes.length > 0) setSelectedNode(data.nodes[0]);
      })
      .catch(err => console.error(err));
  }, []);

  const nodes = graphData?.nodes || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* PAGE HEADER */}
      <div className="pb-4 border-b border-[#23261F] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-grotesk font-bold text-[#EEF0EA] tracking-tight flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#34D399]" />
            Campaign Topology Correlation Graph
          </h1>
          <p className="text-xs text-[#9BA096] font-sans mt-0.5">
            Signature SVG Node Graph visualization of target attacks, cluster nodes, and connected IOC leaves.
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-3 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#62675C]" />
            <input
              type="text"
              placeholder="Search graph nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 rounded-lg border border-[#23261F] bg-[#191B18] text-xs font-mono text-[#EEF0EA] placeholder-[#62675C]"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-[#23261F] bg-[#191B18] text-xs font-mono text-[#EEF0EA]"
          >
            <option value="All">All Node Types</option>
            <option value="campaign">Campaigns</option>
            <option value="email">Attacks</option>
            <option value="domain">Domains</option>
            <option value="ip">IP Addresses</option>
            <option value="brand">Brands</option>
          </select>
        </div>
      </div>

      {/* GRAPH CANVAS & SIDE PANEL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG NODE GRAPH CANVAS (8 cols) */}
        <div className="lg:col-span-8 bg-[#131513] border border-[#23261F] rounded-xl p-5 min-h-[520px] relative flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#23261F] pb-2">
            <span className="text-xs font-mono font-bold text-[#EEF0EA] uppercase">Visual Node Topology</span>
            <span className="text-[11px] font-mono text-[#62675C]">{nodes.length} Connected IOC Nodes</span>
          </div>

          {/* SVG GRAPH RENDERING ENGINE */}
          <div className="relative w-full h-[400px] flex items-center justify-center my-4 overflow-hidden bg-[#0A0B0A] rounded-lg border border-[#23261F]">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* TARGET TO CLUSTER CONNECTING LINES */}
              <line x1="50%" y1="50%" x2="20%" y2="25%" stroke="#31352C" strokeWidth="2" strokeDasharray="4,4" />
              <line x1="50%" y1="50%" x2="80%" y2="25%" stroke="#31352C" strokeWidth="2" />
              <line x1="50%" y1="50%" x2="20%" y2="75%" stroke="#31352C" strokeWidth="2" />
              <line x1="50%" y1="50%" x2="80%" y2="75%" stroke="#31352C" strokeWidth="2" strokeDasharray="4,4" />

              {/* BRANCH LEAF CONNECTING LINES */}
              <line x1="20%" y1="25%" x2="10%" y2="15%" stroke="#23261F" strokeWidth="1.5" />
              <line x1="20%" y1="25%" x2="30%" y2="12%" stroke="#23261F" strokeWidth="1.5" />
              <line x1="80%" y1="25%" x2="70%" y2="12%" stroke="#23261F" strokeWidth="1.5" />
              <line x1="80%" y1="25%" x2="90%" y2="15%" stroke="#23261F" strokeWidth="1.5" />
            </svg>

            {/* HIGHLIGHTED TARGET NODE (CENTER) */}
            <div
              onClick={() => setSelectedNode(nodes[0] || null)}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 p-3 bg-[#0E2019] border-2 border-[#34D399] rounded-xl text-center shadow-lg cursor-pointer hover:scale-105 transition"
            >
              <span className="px-2 py-0.5 rounded-full bg-[#34D399] text-[#0A0B0A] font-mono font-bold text-[9px] block mb-1">TARGET ATTACK</span>
              <div className="text-xs font-grotesk font-bold text-[#EEF0EA]">CAMP-SBI-001</div>
              <span className="text-[10px] font-mono text-[#34D399]">BS-0001 (Tanglish)</span>
            </div>

            {/* CLUSTER NODE 1 (TOP LEFT) */}
            <div
              onClick={() => setSelectedNode(nodes[1] || null)}
              className="absolute left-[20%] top-[25%] -translate-x-1/2 -translate-y-1/2 z-10 p-2.5 bg-[#191B18] border border-[#F0554A] rounded-lg text-center cursor-pointer hover:scale-105 transition"
            >
              <span className="px-1.5 py-0.2 rounded-full bg-[#211110] text-[#F0554A] border border-[#3D1815] font-mono text-[9px] block">MUTATED VARIANT</span>
              <div className="text-xs font-mono font-bold text-[#EEF0EA] mt-1">BS-0003</div>
            </div>

            {/* CLUSTER NODE 2 (TOP RIGHT) */}
            <div
              onClick={() => setSelectedNode(nodes[2] || null)}
              className="absolute left-[80%] top-[25%] -translate-x-1/2 -translate-y-1/2 z-10 p-2.5 bg-[#191B18] border border-[#F0AA3D] rounded-lg text-center cursor-pointer hover:scale-105 transition"
            >
              <span className="px-1.5 py-0.2 rounded-full bg-[#261F12] text-[#F0AA3D] border border-[#453316] font-mono text-[9px] block">TYPOSQUAT DOMAIN</span>
              <div className="text-xs font-mono text-[#EEF0EA] mt-1">sbi-verify.xyz</div>
            </div>

            {/* CLUSTER NODE 3 (BOTTOM LEFT) */}
            <div
              onClick={() => setSelectedNode(nodes[3] || null)}
              className="absolute left-[20%] top-[75%] -translate-x-1/2 -translate-y-1/2 z-10 p-2.5 bg-[#191B18] border border-[#31352C] rounded-lg text-center cursor-pointer hover:scale-105 transition"
            >
              <span className="px-1.5 py-0.2 rounded-full bg-[#1E211D] text-[#9BA096] font-mono text-[9px] block">SHARED INFRA ASN</span>
              <div className="text-xs font-mono text-[#EEF0EA] mt-1">185.220.101.42</div>
            </div>

            {/* CLUSTER NODE 4 (BOTTOM RIGHT) */}
            <div
              onClick={() => setSelectedNode(nodes[4] || null)}
              className="absolute left-[80%] top-[75%] -translate-x-1/2 -translate-y-1/2 z-10 p-2.5 bg-[#191B18] border border-[#34D399] rounded-lg text-center cursor-pointer hover:scale-105 transition"
            >
              <span className="px-1.5 py-0.2 rounded-full bg-[#0E2019] text-[#34D399] border border-[#0F3D2E] font-mono text-[9px] block">IMPERSONATED BRAND</span>
              <div className="text-xs font-grotesk font-bold text-[#EEF0EA] mt-1">State Bank of India</div>
            </div>
          </div>

          {/* NODE COLOR LEGEND */}
          <div className="border-t border-[#23261F] pt-3 flex flex-wrap items-center justify-between text-xs font-mono text-[#9BA096]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#34D399]"></span> Target / Safe</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#F0554A]"></span> High Risk Attack</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#F0AA3D]"></span> Typosquat Domain</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#9BA096]"></span> Infrastructure IP</span>
            </div>
            <span className="text-[10px] text-[#62675C]">Click node to view relationship metadata</span>
          </div>
        </div>

        {/* SIDE INTELLIGENCE PANEL (4 cols) */}
        <div className="lg:col-span-4 bg-[#131513] border border-[#23261F] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#23261F] pb-2">
            <h3 className="text-xs font-grotesk font-bold text-[#EEF0EA] uppercase tracking-wider">Node Intelligence Panel</h3>
            {selectedNode && (
              <button onClick={() => setSelectedNode(null)} className="text-[#62675C] hover:text-[#EEF0EA]">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {selectedNode ? (
            <div className="space-y-4 text-xs font-sans">
              <div className="p-3 bg-[#191B18] border border-[#23261F] rounded-lg space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#62675C]">{selectedNode.type} NODE</span>
                <h4 className="text-sm font-grotesk font-bold text-[#EEF0EA]">{selectedNode.label}</h4>
                <span className="text-[11px] font-mono text-[#34D399]">ID: {selectedNode.id}</span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-[#62675C] block mb-2">Connected Topology Edges</span>
                <div className="space-y-2">
                  <div className="p-2.5 bg-[#191B18] rounded-lg border border-[#23261F] flex justify-between items-center font-mono text-[11px]">
                    <span className="text-[#9BA096]">MUTATED_FROM</span>
                    <span className="font-bold text-[#34D399]">BS-0001</span>
                  </div>
                  <div className="p-2.5 bg-[#191B18] rounded-lg border border-[#23261F] flex justify-between items-center font-mono text-[11px]">
                    <span className="text-[#9BA096]">HOSTED_ON</span>
                    <span className="font-bold text-[#EEF0EA]">185.220.101.42</span>
                  </div>
                  <div className="p-2.5 bg-[#191B18] rounded-lg border border-[#23261F] flex justify-between items-center font-mono text-[11px]">
                    <span className="text-[#9BA096]">IMPERSONATES</span>
                    <span className="font-bold text-[#EEF0EA]">SBI Banking</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-24 text-center text-[#62675C] text-xs">
              <Info className="w-6 h-6 text-[#31352C] mx-auto mb-2" />
              <p>Select any node in the visual topology graph to load correlation metadata.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
