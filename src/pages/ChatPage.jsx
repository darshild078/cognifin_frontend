import { useState, useCallback, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { askQuestion, streamQuestion, checkHealth, uploadPdf } from '../api';
import useConversations from '../hooks/useConversations';
import Sidebar from '../components/chat/Sidebar';
import ChatHeader from '../components/chat/ChatHeader';
import MessageList from '../components/chat/MessageList';
import ChatInput from '../components/chat/ChatInput';
import '../styles/chat.css';
import '../styles/api.css';

// ── Dynamic Finance-Centric Greetings ────────────────────────────
const FINANCE_HEADLINES = [
    "What financial intelligence are we uncovering today?",
    "Which company report or filing shall we analyze?",
    "What equity research or market trend is on your radar?",
    "Ready to extract deep insights from your financial documents?",
    "Which balance sheet or earnings transcript shall we evaluate?",
];

// ── Upload progress stages (simulated while HTTP call runs) ──────
const UPLOAD_STAGES = [
    { label: 'Reading PDF pages',          pct: 8  },
    { label: 'Splitting into chunks',      pct: 30 },
    { label: 'Generating embeddings',      pct: 65 },
    { label: 'Building vector index',      pct: 90 },
    { label: 'Finalising session',         pct: 98 },
];

// ── Upload Progress Overlay component ────────────────────────────
function UploadProgressOverlay({ fileName, stageIndex, pct, done, error }) {
    return (
        <div className="upload-overlay">
            <div className="upload-overlay-card">
                <div className="upload-overlay-title">
                    {done ? '✓ Analysis ready' : 'Processing PDF'}
                </div>
                <div className="upload-overlay-file">{fileName}</div>

                {error ? (
                    <div className="upload-overlay-error">{error}</div>
                ) : (
                    <>
                        <div className="upload-progress-bar-wrap">
                            <div
                                className="upload-progress-bar-fill"
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                        <div className="upload-progress-pct">{pct}%</div>

                        <div className="upload-stages">
                            {UPLOAD_STAGES.map((s, i) => (
                                <div
                                    key={s.label}
                                    className={`upload-stage ${
                                        i < stageIndex ? 'done' :
                                        i === stageIndex ? 'active' : ''
                                    }`}
                                >
                                    <span className="upload-stage-dot" />
                                    <span className="upload-stage-label">{s.label}</span>
                                </div>
                            ))}
                        </div>

                        {done && (
                            <div className="upload-overlay-done">
                                Start asking questions about this PDF!
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default function ChatPage() {
    const {
        conversations,
        activeId,
        activeConversation,
        selectConversation,
        createConversation,
        deleteConversation,
        renameConversation,
        appendMessage,
        updateLastMessage,
        clearActiveUpload,
        setConversationId,
        refreshConversations,
    } = useConversations();

    const [isLoading, setIsLoading] = useState(false);
    const [lastQuery, setLastQuery] = useState('');
    const [backendDown, setBackendDown] = useState(false);
    const [bannerDismissed, setBannerDismissed] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [headline, setHeadline] = useState(() => {
        const idx = Math.floor(Math.random() * FINANCE_HEADLINES.length);
        return FINANCE_HEADLINES[idx];
    });

    const msgCount = activeConversation?.messages?.length || 0;

    // Rotate or randomize headline when starting a fresh/empty conversation
    useEffect(() => {
        if (!activeConversation || msgCount === 0) {
            setHeadline((prev) => {
                const remaining = FINANCE_HEADLINES.filter((h) => h !== prev);
                return remaining[Math.floor(Math.random() * remaining.length)] || FINANCE_HEADLINES[0];
            });
        }
    }, [activeId, activeConversation, msgCount]);

    // ── Upload progress state ────────────────────────────────────
    const [uploading, setUploading] = useState(false);
    const [uploadFileName, setUploadFileName] = useState('');
    const [uploadStage, setUploadStage] = useState(0);
    const [uploadPct, setUploadPct] = useState(0);
    const [uploadDone, setUploadDone] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    // Check backend health on mount
    useEffect(() => {
        checkHealth()
            .then(() => setBackendDown(false))
            .catch(() => setBackendDown(true));
    }, []);

    // Active session info
    const activeSession = activeConversation?.session;

    // ── Keyboard shortcuts ───────────────────────────────────────
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                createConversation();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                setSidebarCollapsed((v) => !v);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [createConversation]);

    // ── Send question handler (SSE Token Streaming) ─────────────
    const handleSend = useCallback(
        async (questionText) => {
            if (!questionText.trim() || isLoading) return;

            const text = questionText.trim();
            let convId = activeId;
            if (!convId) {
                const newConv = createConversation();
                convId = newConv.id;
            }

            const currentConv = conversations.find((c) => c.id === convId);
            const sessionId = currentConv?.session?.sessionId || null;

            // 1. Add user message
            appendMessage(convId, {
                id: crypto.randomUUID(),
                role: 'user',
                content: text,
                timestamp: new Date().toISOString(),
            });

            setLastQuery(text);
            setIsLoading(true);

            // 2. Add placeholder assistant message
            const assistantMsgId = crypto.randomUUID();
            appendMessage(convId, {
                id: assistantMsgId,
                role: 'assistant',
                content: '',
                metadata: { evidence: [], citations: [], pipeline: {} },
                timestamp: new Date().toISOString(),
            });

            let accumulatedContent = '';
            let metaData = { evidence: [], citations: [], pipeline: {} };

            try {
                await streamQuestion({
                    question: text,
                    sessionId,
                    conversationId: convId,
                    onMetadata: (data) => {
                        metaData.evidence = data.evidence || [];
                        metaData.pipeline = {
                            ...(metaData.pipeline || {}),
                            latency_breakdown: { retrieval: data.retrieval_ms },
                            sources_used: (data.evidence || []).length,
                        };
                        updateLastMessage((prev) => ({
                            ...prev,
                            metadata: {
                                ...(prev.metadata || {}),
                                evidence: metaData.evidence,
                                pipeline: metaData.pipeline,
                            },
                        }));
                    },
                    onToken: (token) => {
                        accumulatedContent += token;
                        updateLastMessage((prev) => ({
                            ...prev,
                            content: accumulatedContent,
                        }));
                    },
                    onDone: (data) => {
                        metaData.citations = data.citations || [];
                        metaData.pipeline = {
                            ...(metaData.pipeline || {}),
                            confidence: data.confidence,
                            confidence_label: data.confidence_label,
                            latency_ms: data.total_ms,
                            sources_used: metaData.evidence.length,
                        };
                        updateLastMessage((prev) => ({
                            ...prev,
                            content: accumulatedContent,
                            metadata: {
                                ...(prev.metadata || {}),
                                citations: metaData.citations,
                                pipeline: metaData.pipeline,
                                follow_ups: data.follow_ups || [],
                            },
                        }));

                        if (data.conversation_id && data.conversation_id !== activeId) {
                            setConversationId(data.conversation_id);
                        } else {
                            refreshConversations();
                        }
                    },
                    onError: (err) => {
                        console.error('Streaming error:', err);
                        updateLastMessage((prev) => ({
                            ...prev,
                            content: (accumulatedContent ? accumulatedContent + '\n\n' : '') + `⚠️ **Error**: ${err.message || 'Stream connection failed.'}`,
                        }));
                    },
                });
            } catch (err) {
                const isAborted = err.name === 'AbortError';
                const errorMsg = isAborted
                    ? 'Request timed out. The model may be overloaded.'
                    : err.message || 'Failed to connect to backend.';

                updateLastMessage((prev) => ({
                    ...prev,
                    content: `⚠️ **Error**: ${errorMsg}\n\nPlease check your backend connection and try again.`,
                }));
            } finally {
                setIsLoading(false);
            }
        },
        [activeId, conversations, isLoading, createConversation, appendMessage, updateLastMessage, setConversationId, refreshConversations]
    );

    // ── Upload handler ───────────────────────────────────────────
    const handleUpload = useCallback(
        async (file, companyName, year) => {
            setUploadFileName(file.name);
            setUploadStage(0);
            setUploadPct(8);
            setUploadDone(false);
            setUploadError(null);
            setUploading(true);

            let stageTimer = null;
            let currentStage = 0;
            stageTimer = setInterval(() => {
                currentStage = Math.min(currentStage + 1, UPLOAD_STAGES.length - 2);
                setUploadStage(currentStage);
                setUploadPct(UPLOAD_STAGES[currentStage].pct);
            }, 1200);

            try {
                const data = await uploadPdf(file, companyName, year);
                clearInterval(stageTimer);
                setUploadStage(UPLOAD_STAGES.length - 1);
                setUploadPct(100);
                setUploadDone(true);

                let convId = activeId;
                if (!convId) {
                    const newConv = createConversation();
                    convId = newConv.id;
                }

                setTimeout(() => {
                    setUploading(false);
                    appendMessage(convId, {
                        id: crypto.randomUUID(),
                        role: 'assistant',
                        content: `📄 **${file.name}** uploaded successfully!\n\n${data.chunks_indexed || 0} chunks indexed for **${companyName}** (${year || 'N/A'}). You can now ask questions about this document.`,
                        metadata: { evidence: [], citations: [], pipeline: {} },
                        timestamp: new Date().toISOString(),
                    });
                }, 800);
            } catch (err) {
                clearInterval(stageTimer);
                setUploadError(err.message || 'Upload failed.');
                setTimeout(() => setUploading(false), 3000);
            }
        },
        [activeId, createConversation, appendMessage]
    );

    const handleClearUpload = () => {
        if (activeId) clearActiveUpload(activeId);
    };

    return (
        <div className="chat-page">
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#1a1a2e',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        fontSize: '14px',
                    },
                }}
            />

            {backendDown && !bannerDismissed && (
                <div className="health-banner">
                    <span className="health-banner-icon">⚠️</span>
                    <span className="health-banner-text">
                        <strong>Backend unavailable.</strong> Make sure the FastAPI server is running.
                    </span>
                    <button className="health-banner-dismiss" onClick={() => setBannerDismissed(true)}>×</button>
                </div>
            )}

            {uploading && (
                <UploadProgressOverlay
                    fileName={uploadFileName}
                    stageIndex={uploadStage}
                    pct={uploadPct}
                    done={uploadDone}
                    error={uploadError}
                />
            )}

            <div className="chat-body">
                <Sidebar
                    conversations={conversations}
                    activeId={activeId}
                    onSelect={selectConversation}
                    onNewChat={createConversation}
                    onDelete={deleteConversation}
                    onRename={renameConversation}
                    isCollapsed={sidebarCollapsed}
                    onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                />

                <main className={`chat-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                    <ChatHeader />

                    {activeConversation && activeConversation.messages.length > 0 ? (
                        <>
                            <MessageList
                                messages={activeConversation.messages}
                                isLoading={isLoading}
                                lastQuery={lastQuery}
                                onFollowUp={handleSend}
                            />
                            <ChatInput
                                onSend={handleSend}
                                onUpload={handleUpload}
                                isLoading={isLoading}
                                uploadedFile={activeSession?.fileName || null}
                                onClearUpload={handleClearUpload}
                            />
                        </>
                    ) : (
                        <div className="chat-welcome">
                            <div className="chat-welcome-content">
                                <h1 key={headline} className="chat-welcome-headline">
                                    {headline}
                                </h1>

                                <div className="chat-welcome-input-wrap">
                                    <ChatInput
                                        onSend={handleSend}
                                        onUpload={handleUpload}
                                        isLoading={isLoading}
                                        uploadedFile={activeSession?.fileName || null}
                                        onClearUpload={handleClearUpload}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
