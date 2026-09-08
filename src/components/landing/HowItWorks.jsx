import { Database, Cpu, FileCheck } from 'lucide-react';
import './../../styles/landing.css';

const PIPELINE_STEPS = [
    {
        step: 'STAGE 01',
        icon: Database,
        title: 'Multi-Vector Ingestion & Indexing',
        description: 'Annual reports and SEBI disclosures are segmented into semantic chunks with company, fiscal year, and page metadata, indexed across FAISS vector spaces.',
    },
    {
        step: 'STAGE 02',
        icon: Cpu,
        title: 'Hybrid Neural Retrieval & Reranking',
        description: 'Queries trigger parallel dense semantic search and BM25 sparse matching. Results are reranked to surface the most contextually relevant passages.',
    },
    {
        step: 'STAGE 03',
        icon: FileCheck,
        title: 'Grounded Evidence Synthesis',
        description: 'The synthesis engine generates structured financial answers, cross-checked against cited sources with exact page references and confidence scores.',
    },
];

export default function HowItWorks() {
    return (
        <section className="pipeline-section" id="pipeline">
            <div className="landing-container">
                <div className="section-header">
                    <span className="section-tag">Architecture</span>
                    <h2 className="section-title">End-to-End Grounding Pipeline</h2>
                    <p className="section-desc">
                        How CogniFin transforms thousands of pages of unstructured financial disclosures into verifiable intelligence.
                    </p>
                </div>

                <div className="pipeline-cards">
                    {PIPELINE_STEPS.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div key={idx} className="pipeline-step-card">
                                <span className="step-number">{item.step}</span>
                                <div className="step-icon-wrap">
                                    <Icon size={24} />
                                </div>
                                <h3 className="step-title">{item.title}</h3>
                                <p className="step-desc">{item.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
