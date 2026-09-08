import './../../styles/landing.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="landing-footer">
            <div className="landing-container">
                <div className="footer-content">
                    {/* Brand */}
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <span className="footer-symbol">✦</span>
                            <span className="footer-brand-title">CogniFin</span>
                        </div>
                        <p className="footer-tagline">
                            Autonomous financial document intelligence & evidence grounding engine for Indian market participants.
                        </p>
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="footer-stack-section">
                        <div className="footer-stack-heading">
                            Core Architecture
                        </div>
                        <div className="footer-stack-list">
                            <span className="footer-stack-pill">FastAPI (Python 3.11)</span>
                            <span className="footer-stack-pill">FAISS Vector Index</span>
                            <span className="footer-stack-pill">BM25 Sparse Search</span>
                            <span className="footer-stack-pill">React 19 + Vite</span>
                            <span className="footer-stack-pill">MongoDB Atlas</span>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div>© {currentYear} CogniFin AI. Document Grounding Engine.</div>
                    <div className="footer-telemetry">
                        <span className="telemetry-dot" />
                        <span>System Telemetry: Operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
