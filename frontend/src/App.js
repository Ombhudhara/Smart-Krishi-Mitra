import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { MockAuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import AIChatAssistant from './features/AIChatAssistant/pages/AIChatAssistant';

// =============================================================================
// APP — Smart Krishi Mitra
// =============================================================================
//
// App.js is the application shell. It provides:
//   1. AuthProvider  — Authentication context (mock now, JWT later)
//   2. Router        — React Router DOM v6 browser router
//   3. AppRoutes     — All route definitions (single source of truth)
//   4. AIChatAssistant — Global floating AI chat FAB
//
// ROUTING:
//   All routes are defined exclusively in src/routes/AppRoutes.jsx.
//   Do NOT add route definitions here.
//
// FUTURE (MERN / JWT):
//   Replace MockAuthProvider with a real AuthProvider that:
//   • Reads JWT from localStorage / httpOnly cookies
//   • Decodes user info (name, role, id) from the token
//   • Provides login(), logout(), refreshToken() methods
//   • Checks token expiry and refreshes automatically
//
// =============================================================================

function App() {
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <MockAuthProvider>
      <Router>
        {/* ── All Routes — defined in src/routes/AppRoutes.jsx ── */}
        <AppRoutes />

        {/* ── Global AI Chat Assistant — floating FAB on all pages ── */}
        <AIChatAssistant isFloating={true} />
      </Router>
    </MockAuthProvider>
  );
}

export default App;
