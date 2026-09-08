/**
 * AuthPage Component
 * ==================
 * High-end institutional sliding authentication terminal.
 * Features dynamic financial market charts on the left that adapt
 * between Login (Market Candlesticks & Telemetry) and Register (RAG Neural Cluster).
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { LoginVisual, RegisterVisual } from '../components/auth/AuthVisuals';
import '../styles/auth.css';

export default function AuthPage({ initialMode = 'login' }) {
    const [mode, setMode] = useState(initialMode);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [searchParams] = useSearchParams();

    const { login, register } = useAuth();
    const navigate = useNavigate();

    // Synchronize mode when prop changes (e.g. direct URL navigation)
    useEffect(() => {
        setMode(initialMode);
        setError('');
    }, [initialMode]);

    // Handle OAuth redirect errors
    useEffect(() => {
        const authError = searchParams.get('error');
        if (authError) {
            const errorMessages = {
                google_not_configured: 'Google OAuth is not configured on the backend server. Please sign in with email and password.',
                google_auth_failed: 'Google authentication was cancelled or failed. Please try again.',
                no_email: 'No email address was found associated with your Google account.',
                auth_failed: 'Google sign-in could not be completed. Please try again.',
            };
            const msg = errorMessages[authError] || 'Authentication error occurred.';
            setError(msg);
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, [searchParams]);

    const switchMode = (newMode) => {
        setError('');
        setMode(newMode);
        window.history.replaceState({}, '', newMode === 'login' ? '/login' : '/register');
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            navigate('/chat');
        } catch (err) {
            setError(err.message || 'Invalid email or password.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        try {
            await register(name, email, password);
            toast.success('Account created successfully! Please sign in.', { duration: 3000 });
            switchMode('login');
        } catch (err) {
            setError(err.message || 'Registration failed.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
        window.location.href = `${apiBase}/auth/login`;
    };

    return (
        <div className="auth-page">
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#121318',
                        color: '#ffffff',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '10px',
                        fontSize: '13.5px',
                        fontFamily: 'var(--font-sans)',
                    },
                }}
            />

            {/* Ambient Background Gradient & Crosshairs */}
            <div className="auth-bg-ambient">
                <div className="auth-ambient-glow" />
                <div className="auth-ambient-grid" />
            </div>

            {/* Back to Home Action */}
            <Link to="/" className="auth-back-link">
                <ArrowLeft size={16} />
                <span>Back to Terminal Overview</span>
            </Link>

            {/* Floating Luxury Hardware Tablet Container */}
            <div className="auth-tablet-frame">
                {/* Tablet Top Window Bar */}
                <div className="auth-tablet-header">
                    <div className="auth-window-dots">
                        <span className="dot dot-close" />
                        <span className="dot dot-min" />
                        <span className="dot dot-max" />
                    </div>

                    <div className="auth-header-brand-center">
                        <span className="center-brand-icon">✦</span>
                        <span className="center-brand-name">COGNIFIN TERMINAL</span>
                        <span className="center-brand-tag">SEC / SEBI RAG</span>
                    </div>

                    <button
                        type="button"
                        className="auth-tablet-mode-toggle"
                        onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                    >
                        {mode === 'login' ? (
                            <span>Create an account →</span>
                        ) : (
                            <span>← Sign in</span>
                        )}
                    </button>
                </div>

                {/* Tablet Body Grid */}
                <div className="auth-tablet-body">
                    {/* Left Canvas: Dynamic Financial Charts (Changes based on mode) */}
                    <div className="auth-art-panel">
                        <AnimatePresence mode="wait" initial={false}>
                            {mode === 'login' ? (
                                <Motion.div
                                    key="login-visual"
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.96 }}
                                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                                    style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                >
                                    <LoginVisual />
                                </Motion.div>
                            ) : (
                                <Motion.div
                                    key="register-visual"
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.96 }}
                                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                                    style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                >
                                    <RegisterVisual />
                                </Motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Canvas: Sliding Form Area */}
                    <div className="auth-form-panel">
                        <AnimatePresence mode="wait" initial={false}>
                            {mode === 'login' ? (
                                <Motion.div
                                    key="login-form"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                                    className="auth-form-content"
                                >
                                    <div className="auth-form-heading">
                                        <h2>Sign in</h2>
                                        <p>Access your institutional intelligence workspace</p>
                                    </div>

                                    {/* Google OAuth Button */}
                                    <button
                                        type="button"
                                        className="auth-google-button"
                                        onClick={handleGoogleLogin}
                                    >
                                        <svg viewBox="0 0 24 24" width="18" height="18" className="google-icon">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                        </svg>
                                        <span>Continue with Google</span>
                                    </button>

                                    <div className="auth-form-divider">
                                        <span>or email credentials</span>
                                    </div>

                                    {/* Sign In Form */}
                                    <form onSubmit={handleLoginSubmit} className="auth-form-fields">
                                        <div className="auth-input-group">
                                            <label htmlFor="login-email">Your email</label>
                                            <div className={`auth-input-box ${email ? 'has-value' : ''}`}>
                                                <Mail size={16} className="auth-input-icon" />
                                                <input
                                                    id="login-email"
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="analyst@institution.com"
                                                    required
                                                    autoComplete="email"
                                                />
                                            </div>
                                        </div>

                                        <div className="auth-input-group">
                                            <div className="auth-label-row">
                                                <label htmlFor="login-password">Password</label>
                                                <span className="auth-forgot-link">Forgot password?</span>
                                            </div>
                                            <div className={`auth-input-box ${password ? 'has-value' : ''}`}>
                                                <Lock size={16} className="auth-input-icon" />
                                                <input
                                                    id="login-password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="••••••••••••"
                                                    required
                                                    autoComplete="current-password"
                                                />
                                                <button
                                                    type="button"
                                                    className="auth-password-toggle"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    tabIndex={-1}
                                                >
                                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="auth-options-row">
                                            <label className="auth-checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    checked={rememberMe}
                                                    onChange={(e) => setRememberMe(e.target.checked)}
                                                />
                                                <span>Remember this device</span>
                                            </label>
                                        </div>

                                        {error && (
                                            <div className="auth-error-banner">
                                                <span>⚠</span>
                                                <p>{error}</p>
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            className="auth-primary-btn"
                                            disabled={isLoading || !email || !password}
                                        >
                                            {isLoading ? (
                                                <span className="auth-btn-spinner" />
                                            ) : (
                                                <>
                                                    <span>Sign in</span>
                                                    <ArrowRight size={15} />
                                                </>
                                            )}
                                        </button>
                                    </form>

                                    <div className="auth-footer-prompt">
                                        <span>Don't have an account?</span>
                                        <button
                                            type="button"
                                            className="auth-inline-link"
                                            onClick={() => switchMode('register')}
                                        >
                                            Sign up
                                        </button>
                                    </div>
                                </Motion.div>
                            ) : (
                                <Motion.div
                                    key="register-form"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                                    className="auth-form-content"
                                >
                                    <div className="auth-form-heading">
                                        <h2>Create account</h2>
                                        <p>Start your research with zero hallucinations</p>
                                    </div>

                                    {/* Register Form */}
                                    <form onSubmit={handleRegisterSubmit} className="auth-form-fields">
                                        <div className="auth-input-group">
                                            <label htmlFor="reg-name">Full name</label>
                                            <div className={`auth-input-box ${name ? 'has-value' : ''}`}>
                                                <User size={16} className="auth-input-icon" />
                                                <input
                                                    id="reg-name"
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="Alex Mercer"
                                                    required
                                                    autoComplete="name"
                                                />
                                            </div>
                                        </div>

                                        <div className="auth-input-group">
                                            <label htmlFor="reg-email">Work email</label>
                                            <div className={`auth-input-box ${email ? 'has-value' : ''}`}>
                                                <Mail size={16} className="auth-input-icon" />
                                                <input
                                                    id="reg-email"
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="analyst@institution.com"
                                                    required
                                                    autoComplete="email"
                                                />
                                            </div>
                                        </div>

                                        <div className="auth-input-group">
                                            <label htmlFor="reg-password">Password</label>
                                            <div className={`auth-input-box ${password ? 'has-value' : ''}`}>
                                                <Lock size={16} className="auth-input-icon" />
                                                <input
                                                    id="reg-password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="Minimum 6 characters"
                                                    required
                                                    autoComplete="new-password"
                                                />
                                                <button
                                                    type="button"
                                                    className="auth-password-toggle"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    tabIndex={-1}
                                                >
                                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="auth-input-group">
                                            <label htmlFor="reg-confirm">Confirm password</label>
                                            <div className={`auth-input-box ${confirmPassword ? 'has-value' : ''}`}>
                                                <Lock size={16} className="auth-input-icon" />
                                                <input
                                                    id="reg-confirm"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    placeholder="Re-enter password"
                                                    required
                                                    autoComplete="new-password"
                                                />
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="auth-error-banner">
                                                <span>⚠</span>
                                                <p>{error}</p>
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            className="auth-primary-btn"
                                            disabled={isLoading || !email || !password || !name || !confirmPassword}
                                        >
                                            {isLoading ? (
                                                <span className="auth-btn-spinner" />
                                            ) : (
                                                <>
                                                    <span>Create Account</span>
                                                    <ArrowRight size={15} />
                                                </>
                                            )}
                                        </button>
                                    </form>

                                    <div className="auth-footer-prompt">
                                        <span>Already have an account?</span>
                                        <button
                                            type="button"
                                            className="auth-inline-link"
                                            onClick={() => switchMode('login')}
                                        >
                                            Sign in
                                        </button>
                                    </div>
                                </Motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
