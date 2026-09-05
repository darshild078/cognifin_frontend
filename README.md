# CogniFin AI — Frontend

A modern, high-performance financial intelligence web application built with **React 19**, **Vite**, and **Framer Motion**. Designed for in-depth analysis of Indian financial documents (SEBI filings, DRHPs, and annual reports) powered by a Retrieval-Augmented Generation (RAG) backend.

---

## 🚀 Features

- **Conversational Financial Analyst**: Interactive chat interface with streaming word-by-word responses, markdown formatting, and suggested follow-up prompts.
- **Source Citations & Evidence Drawer**: Every insight is backed by exact document chunk references, page numbers, and confidence metrics.
- **In-App PDF Viewer**: Built-in canvas PDF reader (`pdfjs-dist`) with auto-jump to cited pages and synchronized passage keyword highlighting.
- **Session Document Upload**: Upload custom annual reports or DRHP PDFs directly into the active chat session with multi-stage progress tracking.
- **Pipeline Breakdown & Metrics**: Real-time observability displaying retrieval, reranking, and generation latency breakdowns.
- **JWT & OAuth Authentication**: Full authentication system supporting email/password registration, secure JWT storage, and Google OAuth callback flow.
- **API Toast Messaging**: Context-aware toast notifications (`react-hot-toast`) populated from standard backend `{ success, message, data }` responses.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: Modern CSS with CSS Custom Properties, Glassmorphism, and responsive design
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **PDF Rendering**: [pdfjs-dist](https://github.com/mozilla/pdf.js)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Markdown**: [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm)
- **Notifications**: [react-hot-toast](https://react-hot-toast.com/)

---

## 📁 Directory Structure

```
frontend/
├── index.html                     # HTML entry point, SEO & fonts
├── package.json                   # Dependencies and scripts
├── vite.config.js                 # Vite bundler configuration
├── eslint.config.js               # ESLint configuration
├── README.md                      # Frontend documentation
├── .env.example                   # Template environment variables
└── src/
    ├── api.js                     # Centralized API client & toast handling
    ├── main.jsx                   # React DOM root mounting
    ├── App.jsx                    # Route definitions & page transition wrapper
    ├── index.css                  # Global resets, typography & scrollbar styles
    ├── App.css                    # Root layout styling
    ├── components/
    │   ├── chat/                  # Analyst chat UI components
    │   │   ├── ChatHeader.jsx     # Status bar and model indicators
    │   │   ├── ChatInput.jsx      # Message input & PDF upload triggers
    │   │   ├── LoadingIndicator.jsx # Dynamic query-aware loading messages
    │   │   ├── MessageList.jsx    # Assistant/user bubbles, pipeline & citations
    │   │   ├── PDFViewerModal.jsx # Canvas-based PDF viewer with highlighting
    │   │   └── Sidebar.jsx        # Conversation history with context menus
    │   ├── landing/               # Marketing & feature showcase components
    │   │   ├── Features.jsx       # Feature grid
    │   │   ├── Footer.jsx         # Footer and tech stack summary
    │   │   ├── Hero.jsx           # Glassmorphism hero section & CTAs
    │   │   ├── HowItWorks.jsx     # 3-step workflow diagram
    │   │   └── Navbar.jsx         # Navigation bar with responsive drawer
    │   └── shared/
    │       └── ProtectedRoute.jsx # Route authentication guard
    ├── context/
    │   └── AuthContext.jsx        # Global auth state & token management
    ├── hooks/
    │   └── useConversations.js    # Persistent conversation hook via backend API
    ├── pages/
    │   ├── AuthCallbackPage.jsx   # OAuth redirect handler
    │   ├── ChatPage.jsx           # Main chat workspace & analysis environment
    │   ├── LandingPage.jsx        # Landing page
    │   ├── LoginPage.jsx          # Login view
    │   └── RegisterPage.jsx       # Registration view
    ├── styles/
    │   ├── api.css                # Health and network error banners
    │   ├── auth.css               # Authentication cards & form styling
    │   ├── chat.css               # Navy + Gold financial analyst interface
    │   └── landing.css            # Landing page theme & responsive layout
    └── utils/
        └── auth.js                # JWT token & session localStorage helpers
```

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm** or **pnpm** / **yarn**
- **CogniFin Backend**: Running at `http://localhost:8000`

### 1. Installation

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install
```

### 2. Configure Environment

Create a `.env` file in the `frontend` root:

```bash
cp .env.example .env
```

Set your backend API URL in `.env`:

```env
VITE_API_BASE=http://localhost:8000
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server with Hot Module Replacement |
| `npm run build` | Compiles and optimizes assets for production into `dist/` |
| `npm run preview` | Locally previews the production build |
| `npm run lint` | Runs ESLint to verify code quality and React best practices |

---

## 🔒 Authentication Flow

1. **Email / Password**: Requests `POST /login` or `POST /register`, receiving `{ token, user }`.
2. **Session Storage**: Saved to `localStorage` under `cognifin_token` and `cognifin_user`.
3. **Bearer Headers**: Automatically injected by `src/api.js` into all protected requests (`/chat`, `/upload`, `/conversations`).
4. **401 Interception**: Automatically clears expired sessions and redirects to `/login`.

