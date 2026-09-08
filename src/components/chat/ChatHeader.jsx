export default function ChatHeader() {
    return (
        <header className="chat-header">
            <div className="chat-header-left" />

            <div className="chat-header-center">
                <div className="chat-header-model-pill" title="Active Model: CogniFin RAG v2.4">
                    <span className="model-pill-icon">✦</span>
                    <span className="model-pill-name">CogniFin RAG v2.4</span>
                </div>
            </div>

            <div className="chat-header-right" />
        </header>
    );
}

