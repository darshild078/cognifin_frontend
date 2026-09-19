/**
 * CogniFin AI - API Client
 * ========================
 * Handles communication with the FastAPI backend.
 * Unpacks standard backend envelopes `{ success, message, data }`.
 * Shows user-friendly toast notifications directly from API responses.
 * All protected requests include the JWT Authorization header.
 * On 401 responses, the session is cleared and the user is redirected to /login.
 */

import { toast } from 'react-hot-toast';
import { getToken, clearSession } from './utils/auth';

// Base URL from Vite env variable, fallback to localhost
export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

// ── Helpers ──────────────────────────────────────────────────

function authHeaders() {
    const token = getToken();
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
}

/**
 * Global 401 interceptor.
 */
function handle401(response) {
    if (response.status === 401) {
        clearSession();
        window.location.href = "/login";
    }
    return response;
}

/**
 * Normalizes backend responses:
 */
async function handleResponse(response, { successToast = false, errorToast = true } = {}) {
    handle401(response);
    let json = null;
    try {
        json = await response.json();
    } catch {
        json = null;
    }

    if (!response.ok) {
        const errorMsg =
            json?.error?.message ||
            json?.message ||
            json?.detail ||
            `Request failed with status ${response.status}`;
        if (errorToast) {
            toast.error(errorMsg, { duration: 4000 });
        }
        throw new Error(errorMsg);
    }

    if (json?.message && successToast) {
        toast.success(json.message, { duration: 3000 });
    }

    // Unpack data from standard envelope, preserving message if needed
    return json?.data !== undefined ? json.data : json;
}

// ── Auth Endpoints (public) ─────────────────────────────────

export async function registerUser(name, email, password) {
    const response = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    });
    return handleResponse(response, { successToast: false, errorToast: false });
}

export async function loginUser(email, password) {
    const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    return handleResponse(response, { successToast: false, errorToast: false });
}

// ── Health ───────────────────────────────────────────────────

export async function checkHealth() {
    const response = await fetch(`${API_BASE}/health`);
    return handleResponse(response, { errorToast: false });
}

// ── Chat (protected) ────────────────────────────────────────

export async function askQuestion(question, sessionId = null, conversationId = null) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);
    try {
        const body = { question };
        if (sessionId) body.session_id = sessionId;
        if (conversationId) body.conversation_id = conversationId;

        const response = await fetch(`${API_BASE}/chat`, {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify(body),
            signal: controller.signal,
        });
        return handleResponse(response, { errorToast: false });
    } finally {
        clearTimeout(timeoutId);
    }
}

/**
 * Real-time SSE token streaming for chat answers.
 */
export async function streamQuestion({
    question,
    sessionId = null,
    conversationId = null,
    onToken,
    onMetadata,
    onDone,
    onError,
    signal,
}) {
    const body = { question };
    if (sessionId) body.session_id = sessionId;
    if (conversationId) body.conversation_id = conversationId;

    try {
        const response = await fetch(`${API_BASE}/chat/stream`, {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify(body),
            signal,
        });

        handle401(response);

        if (!response.ok) {
            let errorMsg = `Stream request failed with status ${response.status}`;
            try {
                const json = await response.json();
                errorMsg = json?.error?.message || json?.message || errorMsg;
            } catch {}
            throw new Error(errorMsg);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || !trimmed.startsWith("data: ")) continue;

                const payload = trimmed.slice(6);
                try {
                    const parsed = JSON.parse(payload);
                    if (parsed.event === "token" && onToken) {
                        onToken(parsed.token);
                    } else if (parsed.event === "metadata" && onMetadata) {
                        onMetadata(parsed);
                    } else if (parsed.event === "done" && onDone) {
                        onDone(parsed);
                    } else if (parsed.event === "error" && onError) {
                        onError(new Error(parsed.error));
                    }
                } catch (e) {
                    console.warn("Failed to parse SSE payload:", payload);
                }
            }
        }
    } catch (err) {
        if (onError) onError(err);
        else throw err;
    }
}


// ── Retrieval (evidence only) ───────────────────────────────

export async function retrievePassages(query, topK = 5) {
    const response = await fetch(`${API_BASE}/retrieve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, top_k: topK }),
    });
    return handleResponse(response, { successToast: false });
}

// ── Upload (protected) ──────────────────────────────────────

export async function uploadPdf(file, companyName, year) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('company_name', companyName);
    if (year) formData.append('year', year);

    const token = getToken();
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000);
    try {
        const response = await fetch(`${API_BASE}/upload`, {
            method: 'POST',
            headers,
            body: formData,
            signal: controller.signal,
        });
        return handleResponse(response, { successToast: true });
    } finally {
        clearTimeout(timeoutId);
    }
}

// ── Conversations (protected) ───────────────────────────────

export async function getConversations(page = 1, limit = 50) {
    const response = await fetch(
        `${API_BASE}/conversations?page=${page}&limit=${limit}`,
        { headers: authHeaders() },
    );
    return handleResponse(response, { errorToast: false });
}

export async function getConversation(id) {
    const response = await fetch(`${API_BASE}/conversations/${id}`, {
        headers: authHeaders(),
    });
    return handleResponse(response, { errorToast: false });
}

export async function deleteConversationApi(id) {
    const response = await fetch(`${API_BASE}/conversations/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    return handleResponse(response, { successToast: true });
}

export async function renameConversationApi(id, title) {
    const response = await fetch(`${API_BASE}/conversations/${id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ title }),
    });
    return handleResponse(response, { successToast: true });
}
