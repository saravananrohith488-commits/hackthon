import React, { useState } from 'react';
import { NetworkGraph, GraphNode } from '../types';
import { Network, Filter, ZoomIn, ZoomOut, Info, ShieldAlert, Sparkles, X } from 'lucide-react';

interface CampaignGraphVisualizerProps {
  graph: NetworkGraph;
}

export const CampaignGraphVisualizer: React.FC<CampaignGraphVisualizerProps> = ({ graph }) => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Calculate layout coordinates for nodes (Circular / Force-directed layout simulation)
  const nodePositions: Record<string, { x: number; y: number }> = {};
  const width = 800;
  const height = 500;
  const centerX = width / 2;
  const centerY = height / 2;

  const campaigns = graph.nodes.filter(n => n.type === 'campaign');
  const emails = graph.nodes.filter(n => n.type === 'email');
  const domains = graph.nodes.filter(n => n.type === 'domain');
  const ips = graph.nodes.filter(n => n.type === 'ip');
  const brands = graph.nodes.filter(n => n.type === 'brand');

  // Place campaign nodes in center ring
  campaigns.forEach((c, idx) => {
    const angle = (idx / Math.max(1, campaigns.length)) * 2 * Math.PI;
    nodePositions[c.id] = {
      x: centerX + Math.cos(angle) * 100,
      y: centerY + Math.sin(angle) * 80
    };
  });

  // Place email nodes in middle ring
  emails.forEach((e, idx) => {
    const angle = (idx / Math.max(1, emails.length)) * 2 * Math.PI;
    nodePositions[e.id] = {
      x: centerX + Math.cos(angle) * 220,
      y: centerY + Math.sin(angle) * 170
    };
  });

  // Place external domain/IP/brand nodes in outer ring
  const externalNodes = [...domains, ...ips, ...brands];
  externalNodes.forEach((n, idx) => {
    const angle = (idx / Math.max(1, externalNodes.length)) * 2 * Math.PI + 0.3;
    nodePositions[n.id] = {
      x: centerX + Math.cos(angle) * 330,
      y: centerY + Math.sin(angle) * 230
    };
  });

  const getNodeColor = (node: GraphNode) => {
    if (node.type === 'campaign') return '#FF5DA2'; // Hot Pink
    if (node.type === 'brand') return '#06D6A0';    // Mint Green
    
    switch (node.threat_level) {
      case 'Critical': return '#FF5A5F';
      case 'High Risk': return '#FFA630';
      case 'Suspicious': return '#FFD23F';
      default: return '#06D6A0';
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'campaign': return '🎯';
      case 'email': return '📩';
      case 'domain': return '🌐';
      case 'ip': return '🖥️';
      case 'brand': return '🏷️';
      default: return '📍';
    }
  };

  const filteredNodes = graph.nodes.filter(n => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  return (
    <div className="relative bg-[#FFFDF9] border-[3px] border-[#241A3D] rounded-3xl p-6 shadow-sticker overflow-hidden">
      {/* Top Washi Tape */}
      <div className="absolute -top-3 right-12 w-32 h-6 washi-tape-teal transform rotate-2 z-10"></div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2EC4B6] text-white border-2 border-[#241A3D] rounded-full text-xs font-bold font-mono shadow-[2px_2px_0px_#241A3D] mb-1">
            <Network className="w-3.5 h-3.5" />
            ATTACK GRAPH INTELLIGENCE
          </div>
          <h3 className="font-fredoka text-2xl text-[#241A3D]">Multilingual Campaign Correlation Graph</h3>
          <p className="font-caveat text-xl text-[#FF5DA2]">
            "Visualizing how mutated emails across domains & languages link back to the same campaign core!"
          </p>
        </div>

        {/* Filter & Zoom Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-[#FFF3E4] border-2 border-[#241A3D] rounded-2xl p-1 shadow-[2px_2px_0px_#241A3D]">
            <span className="text-xs font-bold px-2 font-mono">Filter:</span>
            {['all', 'campaign', 'email', 'domain', 'ip'].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2.5 py-1 text-xs font-bold font-mono rounded-xl capitalize transition-all ${
                  filterType === t ? 'bg-[#FF5DA2] text-white border border-[#241A3D]' : 'hover:bg-white text-[#241A3D]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-[#FFF3E4] border-2 border-[#241A3D] rounded-2xl p-1 shadow-[2px_2px_0px_#241A3D]">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.8))}
              className="p-1.5 hover:bg-white rounded-xl border border-[#241A3D] text-[#241A3D]"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold px-1">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.6))}
              className="p-1.5 hover:bg-white rounded-xl border border-[#241A3D] text-[#241A3D]"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Network Graph Canvas */}
      <div className="relative w-full h-[520px] bg-[#FFF8EF] border-2 border-dashed border-[#241A3D] rounded-2xl overflow-hidden flex items-center justify-center">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <defs>
            <filter id="nodeShadow">
              <feDropShadow dx="3" dy="3" stdDeviation="0" floodColor="#241A3D" />
            </filter>
          </defs>

          {/* Render Graph Edges */}
          {graph.edges.map((edge, idx) => {
            const p1 = nodePositions[edge.source];
            const p2 = nodePositions[edge.target];
            if (!p1 || !p2) return null;

            const isHighlighted = selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target);

            return (
              <g key={idx}>
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={isHighlighted ? '#FF5DA2' : (edge.relation === 'belongs_to' ? '#241A3D' : '#FFA630')}
                  strokeWidth={isHighlighted ? 4 : (edge.relation === 'belongs_to' ? 2.5 : 1.5)}
                  strokeDasharray={edge.relation === 'semantically_similar_to' ? '5,5' : 'none'}
                  opacity={isHighlighted ? 1 : 0.65}
                />
              </g>
            );
          })}

          {/* Render Graph Nodes */}
          {filteredNodes.map((node) => {
            const pos = nodePositions[node.id] || { x: centerX, y: centerY };
            const isSelected = selectedNode?.id === node.id;
            const nodeColor = getNodeColor(node);
            const radius = node.type === 'campaign' ? 24 : 18;

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => setSelectedNode(node)}
                className="cursor-pointer group"
              >
                {/* Node Outer Circle */}
                <circle
                  r={radius}
                  fill={nodeColor}
                  stroke="#241A3D"
                  strokeWidth={isSelected ? 4 : 2.5}
                  filter="url(#nodeShadow)"
                  className="transition-all duration-200 group-hover:scale-125"
                />
                
                {/* Node Emoji Icon */}
                <text
                  textAnchor="middle"
                  dy="5"
                  fontSize={node.type === 'campaign' ? '16' : '12'}
                  className="select-none pointer-events-none"
                >
                  {getNodeIcon(node.type)}
                </text>

                {/* Node Label Tooltip on Hover */}
                <g className="opacity-90 group-hover:opacity-100 transition-opacity">
                  <rect
                    x="-60"
                    y={radius + 6}
                    width="120"
                    height="20"
                    rx="6"
                    fill="#FFFDF9"
                    stroke="#241A3D"
                    strokeWidth="1.5"
                  />
                  <text
                    x="0"
                    y={radius + 20}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="Fredoka"
                    fill="#241A3D"
                  >
                    {node.label.length > 18 ? node.label.substring(0, 16) + '...' : node.label}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Legend Box */}
        <div className="absolute bottom-4 left-4 p-3 bg-[#FFFDF9] border-2 border-[#241A3D] rounded-2xl shadow-[3px_3px_0px_#241A3D] text-xs font-mono font-bold flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#FF5DA2] border border-[#241A3D]"></span> Central Campaign</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#FF5A5F] border border-[#241A3D]"></span> Critical Risk</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#FFA630] border border-[#241A3D]"></span> High Risk</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#FFD23F] border border-[#241A3D]"></span> Suspicious</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#06D6A0] border border-[#241A3D]"></span> Safe / Brand</div>
        </div>

        {/* Node Inspector Side Drawer */}
        {selectedNode && (
          <div className="absolute top-4 right-4 w-80 p-5 bg-[#FFFDF9] border-[3px] border-[#241A3D] rounded-2xl shadow-sticker-lg animate-in slide-in-from-right z-20">
            <div className="flex items-center justify-between mb-3 border-b-2 border-[#241A3D] pb-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#FFD23F] border border-[#241A3D] rounded-full capitalize">
                {getNodeIcon(selectedNode.type)} {selectedNode.type} NODE
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 hover:bg-[#FFF3E4] rounded-lg border border-[#241A3D]"
              >
                <X className="w-4 h-4 text-[#241A3D]" />
              </button>
            </div>

            <h4 className="font-fredoka text-lg text-[#241A3D] leading-tight mb-2">
              {selectedNode.label}
            </h4>

            <div className="space-y-2 text-xs font-nunito">
              <div><span className="font-bold">Node ID:</span> <span className="font-mono bg-[#FFF3E4] px-1.5 py-0.5 border rounded">{selectedNode.id}</span></div>
              {selectedNode.threat_level && (
                <div>
                  <span className="font-bold">Threat Level:</span>{' '}
                  <span className="font-mono font-bold px-2 py-0.5 rounded text-white" style={{ backgroundColor: getNodeColor(selectedNode) }}>
                    {selectedNode.threat_level}
                  </span>
                </div>
              )}

              <div className="mt-3 p-3 bg-[#FFF8EF] border border-[#241A3D] rounded-xl space-y-1 font-mono">
                <div className="font-bold text-[#FF5DA2] font-fredoka text-sm">Node Metadata:</div>
                {Object.entries(selectedNode.details).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-[11px] truncate">
                    <span className="capitalize">{k.replace('_', ' ')}:</span>
                    <span className="font-bold text-[#241A3D]">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
