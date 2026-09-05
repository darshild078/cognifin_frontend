/**
 * Auth Callback Page
 * ===================
 * Handles the redirect from Google OAuth via the backend.
 * Extracts JWT token and user info from URL params,
 * stores them in localStorage, and redirects to /chat.
 */

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export default function AuthCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginWithToken } = useAuth();
    const [error, setError] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');
        const userB64 = searchParams.get('user');
        const authError = searchParams.get('error');

        // Handle error redirects from backend
        if (authError) {
            const errorMessages = {
                google_auth_failed: 'Google authentication failed. Please try again.',
                no_user_info: 'Could not retrieve your Google account info.',
                no_email: 'No email address found in your Google account.',
                db_error: 'Server error during login. Please try again.',
            };
            const timer = setTimeout(() => {
                setError(errorMessages[authError] || 'Authentication failed.');
                setTimeout(() => navigate('/login', { replace: true }), 3000);
            }, 0);
            return () => clearTimeout(timer);
        }

        // Validate required params
        if (!token || !userB64) {
            const timer = setTimeout(() => {
                setError('Invalid callback — missing token or user data.');
                setTimeout(() => navigate('/login', { replace: true }), 3000);
            }, 0);
            return () => clearTimeout(timer);
        }

        try {
            // Decode base64url user data
            const userJson = atob(userB64.replace(/-/g, '+').replace(/_/g, '/'));
            const user = JSON.parse(userJson);

            // Store session via AuthContext
            loginWithToken(token, user);

            // Navigate to chat (replace to clear callback from history)
            navigate('/chat', { replace: true });
        } catch (err) {
            console.error('Auth callback error:', err);
            const timer = setTimeout(() => {
                setError('Failed to process authentication. Please try again.');
                setTimeout(() => navigate('/login', { replace: true }), 3000);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [searchParams, navigate, loginWithToken]);

    return (
        <div className="auth-callback-page">
            {error ? (
                <div className="auth-callback-error">
                    <div className="auth-callback-icon">⚠</div>
                    <p>{error}</p>
                    <span className="auth-callback-redirect">Redirecting to login...</span>
                </div>
            ) : (
                <div className="auth-callback-loading">
                    <div className="auth-spinner"></div>
                    <p>Signing you in...</p>
                </div>
            )}
        </div>
    );
}

