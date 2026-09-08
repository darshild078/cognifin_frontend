/**
 * AuthVisuals Component
 * =====================
 * High-density dynamic financial charts for the Auth Terminal.
 * 
 * 1. LoginVisual: Live Market Candlestick & EMA Trendline Chart with RAG telemetry.
 * 2. RegisterVisual: Multi-Document RAG Neural Graph & Segment Attribution Matrix.
 */

import { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { TrendingUp, Activity, Layers, ShieldCheck, Database, Zap, ArrowUpRight } from 'lucide-react';

/* ── Login Visual: Real-Time Market Telemetry & Candlestick / EMA Chart ── */
export function LoginVisual() {
    const [activeCandle, setActiveCandle] = useState(7);
    const [price, setPrice] = useState(24850.40);
    const [change, setChange] = useState(1.84);

    // Subtle live price tick effect
    useEffect(() => {
        const interval = setInterval(() => {
            const delta = (Math.random() - 0.48) * 4.5;
            setPrice(prev => +(prev + delta).toFixed(2));
            setChange(prev => +(prev + (delta * 0.01)).toFixed(2));
        }, 2200);
        return () => clearInterval(interval);
    }, []);

    // Candlesticks data (Open, High, Low, Close, Volume)
    const candles = [
        { o: 42, h: 58, l: 38, c: 54, bullish: true, vol: 65 },
        { o: 54, h: 62, l: 50, c: 48, bullish: false, vol: 45 },
        { o: 48, h: 68, l: 45, c: 64, bullish: true, vol: 80 },
        { o: 64, h: 74, l: 60, c: 70, bullish: true, vol: 90 },
        { o: 70, h: 72, l: 58, c: 62, bullish: false, vol: 50 },
        { o: 62, h: 80, l: 60, c: 78, bullish: true, vol: 110 },
        { o: 78, h: 86, l: 74, c: 84, bullish: true, vol: 95 },
        { o: 84, h: 96, l: 80, c: 92, bullish: true, vol: 130 },
    ];

    return (
        <div className="auth-visual-container login-visual">
            {/* Top Market Bar */}
            <div className="visual-top-bar">
                <div className="market-asset-info">
                    <div className="asset-tag">
                        <span className="asset-dot" />
                        <span className="asset-name">NIFTY 50 INDEX</span>
                        <span className="asset-badge">LIVE RAG</span>
                    </div>
                    <div className="asset-price-row">
                        <span className="asset-price">₹{price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        <span className={`asset-change ${change >= 0 ? 'positive' : 'negative'}`}>
                            {change >= 0 ? '▲ +' : '▼ '}{Math.abs(change)}%
                        </span>
                    </div>
                </div>

                <div className="live-telemetry-badge">
                    <Activity size={12} className="pulse-icon" />
                    <span>240ms TELEMETRY</span>
                </div>
            </div>

            {/* Dynamic Financial Candlestick & Curve Area */}
            <div className="visual-chart-box">
                {/* Background Crosshair & Price Levels */}
                <div className="chart-grid-overlay">
                    <div className="grid-level level-1"><span>25,200</span><span className="level-line" /></div>
                    <div className="grid-level level-2"><span>24,800</span><span className="level-line" /></div>
                    <div className="grid-level level-3"><span>24,400</span><span className="level-line" /></div>
                </div>

                {/* SVG Chart Layer */}
                <svg className="financial-chart-svg" viewBox="0 0 380 170" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="emaAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
                            <stop offset="70%" stopColor="#ffffff" stopOpacity="0.02" />
                            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="emaLineGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#71717a" />
                            <stop offset="50%" stopColor="#ffffff" />
                            <stop offset="100%" stopColor="#ffffff" />
                        </linearGradient>
                    </defs>

                    {/* Area under the EMA Curve */}
                    <path
                        d="M 15 130 C 50 120, 80 110, 115 95 C 150 80, 185 105, 220 70 C 255 45, 290 55, 330 30 C 350 20, 365 15, 370 12 L 370 160 L 15 160 Z"
                        fill="url(#emaAreaGrad)"
                    />

                    {/* EMA Exponential Trendline */}
                    <path
                        d="M 15 130 C 50 120, 80 110, 115 95 C 150 80, 185 105, 220 70 C 255 45, 290 55, 330 30 C 350 20, 365 15, 370 12"
                        fill="none"
                        stroke="url(#emaLineGrad)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />

                    {/* Candlesticks */}
                    {candles.map((c, i) => {
                        const x = 30 + i * 44;
                        const wickY1 = 150 - c.h;
                        const wickY2 = 150 - c.l;
                        const bodyTop = 150 - Math.max(c.o, c.c);
                        const bodyHeight = Math.max(Math.abs(c.o - c.c), 4);
                        const isSelected = activeCandle === i;

                        return (
                            <g
                                key={i}
                                className="candle-group"
                                onMouseEnter={() => setActiveCandle(i)}
                                style={{ cursor: 'pointer' }}
                            >
                                {/* High-Low Wick */}
                                <line
                                    x1={x}
                                    y1={wickY1}
                                    x2={x}
                                    y2={wickY2}
                                    stroke={c.bullish ? '#ffffff' : '#71717a'}
                                    strokeWidth="1.2"
                                />
                                {/* Candle Body */}
                                <rect
                                    x={x - 6}
                                    y={bodyTop}
                                    width="12"
                                    height={bodyHeight}
                                    rx="2"
                                    fill={c.bullish ? (isSelected ? '#ffffff' : '#d1d5db') : '#27272a'}
                                    stroke={c.bullish ? '#ffffff' : '#52525b'}
                                    strokeWidth="1"
                                />
                                {/* Volume Bar at Bottom */}
                                <rect
                                    x={x - 4}
                                    y={165 - (c.vol * 0.28)}
                                    width="8"
                                    height={c.vol * 0.28}
                                    rx="1.5"
                                    fill={c.bullish ? 'rgba(255,255,255,0.25)' : 'rgba(113,113,122,0.25)'}
                                />
                            </g>
                        );
                    })}

                    {/* Live Active Price Head Pointer */}
                    <circle cx="370" cy="12" r="4.5" fill="#ffffff" />
                    <circle cx="370" cy="12" r="10" fill="rgba(255,255,255,0.25)" className="pulse-circle" />
                </svg>

                {/* Radar Sweep Effect */}
                <div className="chart-sweep-beam" />
            </div>

            {/* Bottom Real-time RAG Citation Metric Chips */}
            <div className="visual-metrics-grid">
                <div className="metric-chip">
                    <div className="metric-chip-icon">
                        <ShieldCheck size={13} />
                    </div>
                    <div className="metric-chip-data">
                        <span className="metric-chip-label">Grounding Lineage</span>
                        <span className="metric-chip-val">98.6% Deterministic</span>
                    </div>
                </div>

                <div className="metric-chip">
                    <div className="metric-chip-icon">
                        <Zap size={13} />
                    </div>
                    <div className="metric-chip-data">
                        <span className="metric-chip-label">Synthesized Chunks</span>
                        <span className="metric-chip-val">233K+ NIFTY 50</span>
                    </div>
                </div>
            </div>

            {/* Live Context Prompt Footnote */}
            <div className="visual-footnote">
                <div className="footnote-pulse" />
                <span>Active Corpus: TCS, INFY, RELIANCE, HDFCBANK, ICICIBANK</span>
            </div>
        </div>
    );
}

/* ── Register Visual: Multi-Doc RAG Neural Knowledge Graph & Segment Attribution ── */
export function RegisterVisual() {
    const [selectedNode, setSelectedNode] = useState('tcs');

    const nodes = [
        { id: 'tcs', label: 'TCS FY24 AR', type: 'Annual Report', chunks: '4,280', match: '99.2%', x: 80, y: 55 },
        { id: 'infy', label: 'INFY Q4 SEC', type: '6-K Filing', chunks: '3,890', match: '97.8%', x: 300, y: 60 },
        { id: 'rel', label: 'RELIANCE DRHP', type: 'Prospectus', chunks: '8,410', match: '98.5%', x: 70, y: 155 },
        { id: 'hdfc', label: 'HDFC AUDIT', type: 'Statutory Note', chunks: '2,940', match: '96.9%', x: 310, y: 150 },
    ];

    const segmentData = [
        { name: 'Cloud & AI Infrastructure', weight: '34.2%', color: '#ffffff' },
        { name: 'BFSI & Banking Transformation', weight: '28.6%', color: '#d1d5db' },
        { name: 'Energy & Petrochemicals EBITDA', weight: '21.4%', color: '#9ca3af' },
        { name: 'Retail & Consumer Footprint', weight: '15.8%', color: '#52525b' },
    ];

    return (
        <div className="auth-visual-container register-visual">
            {/* Top Ingestion Bar */}
            <div className="visual-top-bar">
                <div className="market-asset-info">
                    <div className="asset-tag">
                        <span className="asset-dot blue" />
                        <span className="asset-name">MULTI-DOC RAG CLUSTER</span>
                        <span className="asset-badge">STAGE 01</span>
                    </div>
                    <div className="asset-price-row">
                        <span className="asset-price">50 Enterprise Corpora</span>
                        <span className="asset-change positive">
                            <ArrowUpRight size={13} />
                            Zero Hallucination
                        </span>
                    </div>
                </div>

                <div className="live-telemetry-badge">
                    <Database size={12} />
                    <span>FAISS INDEXED</span>
                </div>
            </div>

            {/* Neural Document Network Visualization */}
            <div className="visual-neural-box">
                <svg className="neural-graph-svg" viewBox="0 0 380 200">
                    <defs>
                        <linearGradient id="neuralLineGrad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
                        </linearGradient>
                    </defs>

                    {/* Connecting Lines to Central Synthesis Hub */}
                    {nodes.map(n => (
                        <line
                            key={`line-${n.id}`}
                            x1="190"
                            y1="105"
                            x2={n.x}
                            y2={n.y}
                            stroke="url(#neuralLineGrad)"
                            strokeWidth="1.2"
                            strokeDasharray="3 3"
                        />
                    ))}

                    {/* Central Synthesis Engine Hub */}
                    <g className="central-hub-group">
                        <circle cx="190" cy="105" r="28" fill="#121319" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                        <circle cx="190" cy="105" r="38" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 4" className="spin-slow" />
                        <text x="190" y="102" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="700" fontFamily="var(--font-mono)">
                            COGNIFIN
                        </text>
                        <text x="190" y="115" textAnchor="middle" fill="#a1a1aa" fontSize="8.5" fontFamily="var(--font-mono)">
                            RAG CORE
                        </text>
                    </g>

                    {/* Document Nodes */}
                    {nodes.map(n => {
                        const isSelected = selectedNode === n.id;
                        return (
                            <g
                                key={`node-${n.id}`}
                                className="doc-node-group"
                                onClick={() => setSelectedNode(n.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <circle
                                    cx={n.x}
                                    cy={n.y}
                                    r={isSelected ? "18" : "15"}
                                    fill={isSelected ? "#1c1d27" : "#121318"}
                                    stroke={isSelected ? "#ffffff" : "rgba(255,255,255,0.2)"}
                                    strokeWidth={isSelected ? "1.8" : "1"}
                                />
                                <text
                                    x={n.x}
                                    y={n.y + 3}
                                    textAnchor="middle"
                                    fill={isSelected ? "#ffffff" : "#a1a1aa"}
                                    fontSize="8"
                                    fontWeight="600"
                                    fontFamily="var(--font-mono)"
                                >
                                    {n.id.toUpperCase()}
                                </text>
                                <text
                                    x={n.x}
                                    y={n.y + 24}
                                    textAnchor="middle"
                                    fill="#71717a"
                                    fontSize="8"
                                    fontFamily="var(--font-mono)"
                                >
                                    {n.match}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Segment Breakdown Mini Matrix */}
            <div className="segment-matrix-card">
                <div className="segment-matrix-header">
                    <div className="matrix-title-wrap">
                        <Layers size={13} />
                        <span>Segmental EBITDA Ingestion Breakdown</span>
                    </div>
                    <span className="matrix-status">Auto-Ranked</span>
                </div>

                <div className="segment-bar-track">
                    {segmentData.map((s, idx) => (
                        <div
                            key={idx}
                            className="segment-bar-slice"
                            style={{
                                width: s.weight,
                                background: s.color,
                            }}
                            title={`${s.name}: ${s.weight}`}
                        />
                    ))}
                </div>

                <div className="segment-legend-grid">
                    {segmentData.slice(0, 2).map((s, idx) => (
                        <div key={idx} className="legend-item">
                            <span className="legend-color-dot" style={{ background: s.color }} />
                            <span className="legend-label">{s.name}</span>
                            <span className="legend-pct">{s.weight}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Enterprise Footnote */}
            <div className="visual-footnote">
                <div className="footnote-pulse" />
                <span>Enterprise Sandbox: Custom PDF Ingestion under 15s</span>
            </div>
        </div>
    );
}
