import { Link } from 'react-router-dom';
import { ArrowRight, Terminal, FileText, CheckCircle2 } from 'lucide-react';
import './../../styles/landing.css';

export default function Hero() {
    return (
        <section className="hero-section">
            <div className="landing-container">
                {/* Status Pill Badge */}
                <div className="hero-pill-badge">
                    <span className="hero-pill-dot" />
                    <span>NIFTY 50 Corpus Active · Deterministic RAG Pipeline</span>
                </div>

                {/* Main Headline */}
                <h1 className="hero-title">
                    Institutional Financial Intelligence for{' '}
                    <span className="hero-highlight">Indian Markets</span>
                </h1>

                {/* Subtitle */}
                <p className="hero-description">
                    Instant, evidence-grounded answers synthesized directly from SEBI filings, DRHPs, and annual reports. Every quantitative metric cited with line-item precision.
                </p>

                {/* CTA Group */}
                <div className="hero-cta-group">
                    <Link to="/login" className="hero-btn-primary">
                        <span>Launch Analyst Terminal</span>
                        <ArrowRight size={15} />
                    </Link>
                    <a href="#pipeline" className="hero-btn-secondary">
                        <span>Explore Architecture</span>
                    </a>
                </div>

                {/* Interactive Luxury Terminal Mockup */}
                <div className="terminal-mockup">
                    <div className="terminal-header">
                        <div className="terminal-dots">
                            <span className="terminal-dot" />
                            <span className="terminal-dot" />
                            <span className="terminal-dot" />
                        </div>
                        <div className="terminal-tab">
                            <Terminal size={13} />
                            <span>cognifin-terminal --corpus nifty50 --mode hybrid-rag</span>
                        </div>
                        <div className="terminal-status">
                            <CheckCircle2 size={13} />
                            <span>Grounded (96.4% Conf.)</span>
                        </div>
                    </div>

                    <div className="terminal-body">
                        {/* Query & Synthesis Column */}
                        <div className="terminal-main-col">
                            <div className="mock-query-box">
                                <div className="mock-query-label">QUERY · NATURAL LANGUAGE PROMPT</div>
                                <div className="mock-query-text">
                                    "Compare TCS and Infosys Operating Margin & Cloud Revenue for FY24"
                                </div>
                            </div>

                            <div className="mock-response-card">
                                <p className="mock-response-text">
                                    <strong>TCS</strong> reported an operating margin of <strong>24.6%</strong> (up 50 bps YoY) driven by operational efficiencies. 
                                    <strong> Infosys</strong> delivered an operating margin of <strong>20.7%</strong> while expanding cloud digital business revenues.
                                </p>

                                <div className="mock-metric-row">
                                    <div className="mock-metric-badge">
                                        <div className="mock-metric-title">TCS FY24 Revenue</div>
                                        <div className="mock-metric-value">₹240,893 Cr</div>
                                    </div>
                                    <div className="mock-metric-badge">
                                        <div className="mock-metric-title">INFY FY24 Revenue</div>
                                        <div className="mock-metric-value">₹153,670 Cr</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Evidence & Grounding Panel */}
                        <div className="mock-evidence-panel">
                            <div className="mock-evidence-header">
                                <FileText size={14} />
                                <span>Grounded Citations (2 Sources)</span>
                            </div>

                            <div className="mock-chunk-snippet">
                                <div className="mock-chunk-meta">
                                    TCS_2024.pdf · Page 42
                                </div>
                                <p className="mock-chunk-body">
                                    "...operating margin expanded by 50 bps to 24.6% despite macroeconomic headwinds in North America..."
                                </p>
                            </div>

                            <div className="mock-chunk-snippet">
                                <div className="mock-chunk-meta">
                                    INFOSYS_2024.pdf · Page 88
                                </div>
                                <p className="mock-chunk-body">
                                    "...operating margin stood at 20.7% for the full year FY24 with large deal TCV of $17.7 billion..."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
