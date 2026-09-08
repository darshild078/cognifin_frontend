import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import './../../styles/landing.css';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className={`landing-nav ${isScrolled ? 'scrolled' : ''}`}>
            <div className="nav-inner">
                {/* Brand Logo */}
                <Link to="/" className="nav-brand">
                    <div className="brand-icon-box">
                        <span className="brand-symbol">✦</span>
                    </div>
                    <span className="brand-title">CogniFin</span>
                    <span className="brand-badge">RAG v2.4</span>
                </Link>

                {/* Desktop Nav Links */}
                <div className="nav-links">
                    <a href="#capabilities" className="nav-item">Capabilities</a>
                    <a href="#pipeline" className="nav-item">Architecture</a>
                    <a href="#coverage" className="nav-item">Coverage</a>
                </div>

                {/* Nav Actions */}
                <div className="nav-actions">
                    <Link to="/login" className="nav-login-btn">
                        Sign In
                    </Link>
                    <Link to="/login" className="nav-cta-btn">
                        <span>Launch Terminal</span>
                        <ArrowRight size={14} />
                    </Link>
                    <button
                        className="mobile-toggle"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>
        </nav>
    );
}
