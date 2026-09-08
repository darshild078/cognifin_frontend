import { Search, ShieldAlert, Users2, FileCheck, Layers, Gauge } from 'lucide-react';
import './../../styles/landing.css';

const BENTO_FEATURES = [
    {
        icon: Search,
        title: 'Multi-Document Semantic Hybrid RAG',
        description: 'Combines dense neural vector embeddings with BM25 keyword matching to pinpoint financial footnotes, MD&A discussions, and segmental revenue across NIFTY 50 filings.',
        span: 'span-2',
    },
    {
        icon: ShieldAlert,
        title: 'Risk Radar & Red Flags',
        description: 'Instantly identifies contingent liabilities, statutory audit qualifications, pending litigations, and forensic warning indicators.',
        span: '',
    },
    {
        icon: Users2,
        title: 'Promoter & Ownership Structure',
        description: 'Deep dives into promoter pledging trends, institutional holding patterns (FII/DII), and beneficial ownership disclosures.',
        span: '',
    },
    {
        icon: FileCheck,
        title: 'Line-by-Line Document Grounding',
        description: 'Eliminates hallucinations. Every response includes verifiable source anchors linking directly to exact PDF page numbers and context snippets.',
        span: 'span-2',
    },
    {
        icon: Layers,
        title: 'Dynamic Session PDF Upload',
        description: 'Drop custom DRHP draft prospectuses or private quarterly reports into any active session for real-time document indexing in under 15 seconds.',
        span: '',
    },
    {
        icon: Gauge,
        title: 'Sub-Second Pipeline Telemetry',
        description: 'Real-time observability displays exact retrieval, reranking, and generation latency breakdowns alongside quantitative confidence scores.',
        span: '',
    },
];

export default function Features() {
    return (
        <section className="features-section" id="capabilities">
            <div className="landing-container">
                <div className="section-header">
                    <span className="section-tag">Capabilities</span>
                    <h2 className="section-title">Institutional Financial Engineering</h2>
                    <p className="section-desc">
                        Designed for equity research analysts, fund managers, and risk auditors who require verified document grounding.
                    </p>
                </div>

                <div className="bento-grid">
                    {BENTO_FEATURES.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div key={idx} className={`bento-card ${item.span}`}>
                                <div className="bento-icon-wrapper">
                                    <Icon size={22} />
                                </div>
                                <h3 className="bento-title">{item.title}</h3>
                                <p className="bento-text">{item.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}


