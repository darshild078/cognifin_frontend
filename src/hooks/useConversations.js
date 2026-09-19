/**
 * useConversations Hook
 * ======================
 * Manages conversation history via the backend API (MongoDB).
 * Replaces the old localStorage-based persistence.
 */

import { useState, useEffect, useCallback } from 'react';
import { getConversations, getConversation, deleteConversationApi, renameConversationApi } from '../api';
import { getToken } from '../utils/auth';

export default function useConversations() {
    const [conversations, setConversations] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [activeConversation, setActiveConversation] = useState(null);
    const [isLoadingConversations, setIsLoadingConversations] = useState(false);

    // ── Load conversation list from backend on mount ──────────
    const refreshConversations = useCallback(async () => {
        const token = getToken();
        if (!token) return;           // skip if not logged in yet

        setIsLoadingConversations(true);
        try {
            const data = await getConversations(1, 50);
            setConversations(data.conversations || []);
        } catch (err) {
            console.error('Failed to load conversations:', err);
        } finally {
            setIsLoadingConversations(false);
        }
    }, []);

    useEffect(() => {
        refreshConversations();
    }, [refreshConversations]);

    // ── Select a conversation (fetches full messages) ─────────
    const selectConversation = useCallback(async (id) => {
        setActiveId(id);
        if (!id) {
            setActiveConversation(null);
            return;
        }
        try {
            const full = await getConversation(id);
            setActiveConversation({
                id: full.id,
                title: full.title,
                messages: (full.messages || []).map((m, i) => ({
                    id: `msg_${i}`,
                    role: m.role,
                    content: m.content,
                    metadata: m.metadata || {},
                    timestamp: m.timestamp || '',
                })),
                createdAt: full.created_at,
                updatedAt: full.updated_at,
            });
        } catch (err) {
            console.error('Failed to load conversation:', err);
            setActiveConversation(null);
        }
    }, []);

    // ── Start new analysis (deselect active) ─────────────────
    const createConversation = useCallback(() => {
        setActiveId(null);
        setActiveConversation(null);
        return { id: null, title: 'New Analysis', messages: [] };
    }, []);

    // ── Append message to active conversation ─────────────────
    const appendMessage = useCallback((convId, message) => {
        const role = typeof message === 'string' ? 'user' : message.role || 'user';
        const content = typeof message === 'string' ? message : message.content || '';
        const metadata = message.metadata || {};
        const id = message.id || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
        const timestamp = message.timestamp || new Date().toISOString();
        const msgObj = { id, role, content, metadata, timestamp };

        setActiveConversation((prev) => {
            if (!prev) {
                return {
                    id: convId || 'pending',
                    title: role === 'user' ? (content.length > 40 ? content.slice(0, 40) + '...' : content) : 'New Analysis',
                    messages: [msgObj],
                    createdAt: timestamp,
                    updatedAt: timestamp,
                };
            }
            return {
                ...prev,
                id: convId || prev.id,
                messages: [...(prev.messages || []), msgObj],
                updatedAt: timestamp,
            };
        });

        if (convId && convId !== 'pending') {
            setActiveId(convId);
        }
    }, []);

    // Backward compatibility alias for addMessage
    const addMessage = useCallback((convId, role, content, metadata = {}) => {
        appendMessage(convId, { role, content, metadata });
    }, [appendMessage]);

    // ── Clear active upload in current session ────────────────
    const clearActiveUpload = useCallback(() => {
        setActiveConversation((prev) => {
            if (!prev) return prev;
            const updated = { ...prev };
            delete updated.session;
            return updated;
        });
    }, []);

    // ── Update conversation_id on active conversation ────────
    const setConversationId = useCallback((newId) => {
        setActiveId(newId);
        setActiveConversation((prev) =>
            prev ? { ...prev, id: newId } : prev
        );
        refreshConversations();
    }, [refreshConversations]);

    // ── Delete a conversation ────────────────────────────────
    const deleteConversation = useCallback(async (id) => {
        try {
            await deleteConversationApi(id);
            setConversations((prev) => prev.filter((c) => c.id !== id));
            if (activeId === id) {
                setActiveId(null);
                setActiveConversation(null);
            }
        } catch (err) {
            console.error('Failed to delete conversation:', err);
        }
    }, [activeId]);

    // ── Rename a conversation (optimistic + persist) ─────────
    const renameConversation = useCallback(async (id, title) => {
        setConversations((prev) =>
            prev.map((c) => (c.id === id ? { ...c, title } : c))
        );
        setActiveConversation((prev) =>
            prev && prev.id === id ? { ...prev, title } : prev
        );
        try {
            await renameConversationApi(id, title);
        } catch (err) {
            console.error('Failed to persist rename:', err);
        }
    }, []);

    // ── Update last message in active conversation (for streaming) ─────────
    const updateLastMessage = useCallback((updater) => {
        setActiveConversation((prev) => {
            if (!prev || !prev.messages || prev.messages.length === 0) return prev;
            const msgs = [...prev.messages];
            const lastIdx = msgs.length - 1;
            const updatedMsg = typeof updater === 'function' ? updater(msgs[lastIdx]) : { ...msgs[lastIdx], ...updater };
            msgs[lastIdx] = updatedMsg;
            return {
                ...prev,
                messages: msgs,
            };
        });
    }, []);

    return {
        conversations,
        activeConversation,
        activeId,
        isLoadingConversations,
        createConversation,
        appendMessage,
        addMessage,
        updateLastMessage,
        clearActiveUpload,
        setConversationId,
        selectConversation,
        deleteConversation,
        renameConversation,
        refreshConversations,
    };
}
