/**
 * Sidebar Component — Modern Minimalist Interface for CogniFin AI
 * ================================================================
 * Features:
 * - Clean minimal header with brand name, search toggle, and sidebar collapse
 * - Primary "New Analysis" action button with compose icon
 * - Core Workspace Navigation: Terminal Chat, PDF Sandbox, NIFTY 50 Corpus
 * - Dynamic Timeline Grouped Chats with hover 3-dots options (Rename / Delete)
 * - User account profile with dynamic initials avatar & Pro Upgrade pill
 * - Smooth collapsed rail mode
 */

import { useState, useEffect, useRef } from 'react';
import {
    SquarePen, Search, PanelLeftClose, PanelLeftOpen,
    MessageSquare, FileText, Database, Pencil, Trash2, LogOut,
    X, Settings, MoreHorizontal
    Pencil, Trash2, LogOut, X, Settings, MoreHorizontal
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({
    conversations,
    activeId,
    onSelect,
    onNewChat,
    onDelete,
    onRename,
    isCollapsed,
    onToggleCollapse,
}) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [activeNav, setActiveNav] = useState('chat');

    const userMenuRef = useRef(null);
    const searchInputRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Close user popover on outside click
    useEffect(() => {
        const handler = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Focus search input when search is opened
    useEffect(() => {
        if (isSearching) {
            setTimeout(() => searchInputRef.current?.focus(), 50);
        }
    }, [isSearching]);

    // Group conversations by date
    const grouped = { today: [], yesterday: [], previous7: [], older: [] };

    const filtered = query.trim()
        ? conversations.filter((c) =>
            c.title.toLowerCase().includes(query.toLowerCase())
        )
        : conversations;

    filtered.forEach((conv) => {
        if (!conv.updatedAt && !conv.createdAt) {
            grouped.older.push(conv);
            return;
        }
        const convDate = new Date(conv.updatedAt || conv.createdAt);
        const d = convDate.toDateString();
        const now = new Date();
        const todayStr = now.toDateString();
        const yestStr = new Date(now.getTime() - 86400000).toDateString();
        const diffDays = Math.floor((now.getTime() - convDate.getTime()) / (1000 * 60 * 60 * 24));

        if (d === todayStr) grouped.today.push(conv);
        else if (d === yestStr) grouped.yesterday.push(conv);
        else if (diffDays <= 7) grouped.previous7.push(conv);
        else grouped.older.push(conv);
    });

    // User initials calculation
    const userName = user?.name || 'Financial Analyst';
    const userInitials = userName
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || 'FA';

    const c = isCollapsed;

    return (
        <aside className={`chatgpt-sidebar ${c ? 'collapsed' : ''}`}>
            {/* ── Top Header ── */}
            <div className="sidebar-top-bar">
                {!c ? (
                    <>
                        <div className="sidebar-brand-title" onClick={() => navigate('/chat')}>
                            <span className="sidebar-brand-icon">✦</span>
                            <span>CogniFin</span>
                        </div>
                        <div className="sidebar-top-actions">
                            <button
                                className={`sidebar-icon-btn ${isSearching ? 'active' : ''}`}
                                onClick={() => setIsSearching(v => !v)}
                                title="Search chats"
                            >
                                <Search size={16} />
                            </button>
                            <button
                                className="sidebar-icon-btn"
                                onClick={onToggleCollapse}
                                title="Collapse sidebar (Ctrl+B)"
                            >
                                <PanelLeftClose size={16} />
                            </button>
                        </div>
                    </>
                ) : (
                    <button
                        className="sidebar-rail-btn sidebar-expand-btn"
                        onClick={onToggleCollapse}
                        title="Open sidebar (Ctrl+B)"
                    >
                        <PanelLeftOpen size={18} />
                    </button>
                )}
            </div>

            {/* ── Search Input (Toggled) ── */}
            {!c && isSearching && (
                <div className="sidebar-search-row">
                    <Search size={13} className="sidebar-search-icon" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        className="sidebar-search-input"
                        placeholder="Search chats..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && (
                        <button className="sidebar-search-clear" onClick={() => setQuery('')}>
                            <X size={12} />
                        </button>
                    )}
                </div>
            )}

            {/* ── New Analysis / Compose Button ── */}
            {!c ? (
                <button className="sidebar-new-chat-btn" onClick={onNewChat}>
                    <div className="new-chat-left">
                        <SquarePen size={15} />
                        <span>New Analysis</span>
                    </div>
                </button>
            ) : (
                <button className="sidebar-rail-btn" onClick={onNewChat} title="New Analysis">
                    <SquarePen size={18} />
                </button>
            )}

            {/* ── Main Scrollable Area ── */}
            <div className="sidebar-scrollable-content">
                {/* ── Core Workspace Modes ── */}
                {!c && (
                    <div className="sidebar-quick-nav">
                        <button
                            className={`sidebar-nav-row ${activeNav === 'chat' ? 'active' : ''}`}
                            onClick={() => { setActiveNav('chat'); onNewChat(); }}
                            title="Open Terminal Chat"
                        >
                            <MessageSquare size={15} className="sidebar-row-icon" />
                            <span>Terminal Chat</span>
                        </button>
                        <button
                            className={`sidebar-nav-row ${activeNav === 'pdf' ? 'active' : ''}`}
                            onClick={() => { setActiveNav('pdf'); onNewChat(); }}
                            title="Custom PDF Sandbox"
                        >
                            <FileText size={15} className="sidebar-row-icon" />
                            <span>PDF Sandbox</span>
                        </button>
                        <button
                            className={`sidebar-nav-row ${activeNav === 'corpus' ? 'active' : ''}`}
                            onClick={() => setActiveNav('corpus')}
                            title="Indexed NIFTY 50 Financial Corpus"
                        >
                            <Database size={15} className="sidebar-row-icon" />
                            <span>NIFTY 50 Corpus</span>
                        </button>
                    </div>
                )}

                {/* ── Dynamic Chats History Section ── */}
                {!c && (
                    <div className="sidebar-section">
                        <div className="sidebar-section-header">
                            <span>Your Analyses</span>
                        </div>

                        {filtered.length === 0 && (
                            <div className="sidebar-empty-state">
                                {query ? (
                                    <span>No analyses match "{query}"</span>
                                ) : (
                                    <span>No previous analyses.<br />Start a new analysis above.</span>
                                )}
                            </div>
                        )}

                        {[
                            { label: 'Today', items: grouped.today },
                            { label: 'Yesterday', items: grouped.yesterday },
                            { label: 'Previous 7 Days', items: grouped.previous7 },
                            { label: 'Older', items: grouped.older },
                        ].map(({ label, items }) =>
                            items.length > 0 && (
                                <div className="sidebar-time-group" key={label}>
                                    <div className="sidebar-time-label">{label}</div>
                                    {items.map((conv) => (
                                        <ChatItem
                                            key={conv.id}
                                            conv={conv}
                                            isActive={conv.id === activeId}
                                            onSelect={() => onSelect(conv.id)}
                                            onDelete={() => onDelete(conv.id)}
                                            onRename={(title) => onRename(conv.id, title)}
                                        />
                                    ))}
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>

            {/* ── Bottom User Profile & Upgrade Section ── */}
            <div className="sidebar-footer">
                {!c ? (
                    <div className="sidebar-footer-container" ref={userMenuRef}>
                        {/* User Account Row */}
                        <div
                            className="sidebar-user-row"
                            onClick={() => setShowUserMenu(v => !v)}
                            title="Account Settings"
                        >
                            <div className="user-avatar-circle">
                                <span>{userInitials}</span>
                            </div>
                            <div className="user-info-text">
                                <span className="user-display-name">{userName}</span>
                                <span className="user-tier-label">Analyst Tier</span>
                            </div>
                        </div>

                        {/* Floating User Context Dropdown */}
                        {showUserMenu && (
                            <div className="sidebar-user-popover">
                                <div className="popover-header">
                                    <span className="popover-email">{user?.email || 'analyst@cognifin.ai'}</span>
                                </div>
                                <div className="popover-divider" />
                                <button className="popover-item" onClick={() => setShowUserMenu(false)}>
                                    <Settings size={14} />
                                    <span>Account Settings</span>
                                </button>
                                <div className="popover-divider" />
                                <button className="popover-item danger" onClick={handleLogout}>
                                    <LogOut size={14} />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="sidebar-rail-footer">
                        <div
                            className="user-avatar-circle rail-avatar"
                            onClick={onToggleCollapse}
                            title={userName}
                        >
                            <span>{userInitials}</span>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}

/**
 * ChatItem Component with Hover 3-Dots Action Menu
 */
function ChatItem({ conv, isActive, onSelect, onDelete, onRename }) {
    const [showOptions, setShowOptions] = useState(false);
    const [renaming, setRenaming] = useState(false);
    const [draft, setDraft] = useState(conv.title);
    const optionsRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (renaming) {
            setTimeout(() => inputRef.current?.select(), 0);
        }
    }, [renaming]);

    // Close options popover on click outside
    useEffect(() => {
        if (!showOptions) return;
        const handler = (e) => {
            if (optionsRef.current && !optionsRef.current.contains(e.target)) {
                setShowOptions(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [showOptions]);

    const handleOptionsClick = (e) => {
        e.stopPropagation();
        setShowOptions(v => !v);
    };

    const startRename = (e) => {
        e.stopPropagation();
        setDraft(conv.title);
        setRenaming(true);
        setShowOptions(false);
    };

    const commitRename = () => {
        const t = draft.trim();
        if (t && t !== conv.title) {
            onRename(t);
        }
        setRenaming(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            commitRename();
        }
        if (e.key === 'Escape') {
            setRenaming(false);
            setDraft(conv.title);
        }
    };

    return (
        <div
            className={`sidebar-chat-row ${isActive ? 'active' : ''}`}
            onClick={!renaming ? onSelect : undefined}
            title={conv.title}
        >
            {renaming ? (
                <input
                    ref={inputRef}
                    className="sidebar-chat-rename-input"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={commitRename}
                    onClick={(e) => e.stopPropagation()}
                />
            ) : (
                <span className="sidebar-chat-title">{conv.title}</span>
            )}

            {/* 3-Dots Options Button */}
            {!renaming && (
                <div className="sidebar-chat-actions" ref={optionsRef}>
                    <button
                        className={`sidebar-chat-dots-btn ${showOptions ? 'visible' : ''}`}
                        onClick={handleOptionsClick}
                        title="Options"
                    >
                        <MoreHorizontal size={14} />
                    </button>

                    {/* Options Popover Menu */}
                    {showOptions && (
                        <div className="sidebar-chat-popover">
                            <button className="chat-popover-item" onClick={startRename}>
                                <Pencil size={13} />
                                <span>Rename</span>
                            </button>
                            <div className="chat-popover-divider" />
                            <button
                                className="chat-popover-item danger"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowOptions(false);
                                    onDelete();
                                }}
                            >
                                <Trash2 size={13} />
                                <span>Delete</span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
