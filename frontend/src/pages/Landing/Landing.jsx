import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const features = [
  {
    icon: "🌾",
    title: "Crop Knowledge",
    desc: "Access a rich database of 50+ crops with expert guidance on sowing, irrigation, disease management, and optimal harvest timing.",
  },
  {
    icon: "🤖",
    title: "AI Assistant",
    desc: "Chat with our multilingual AI assistant 24/7 for real-time farming advice, pest detection, and personalised crop recommendations.",
  },
  {
    icon: "🛒",
    title: "Marketplace",
    desc: "Sell your produce directly to verified buyers or purchase seeds, fertilisers, and equipment at fair prices without middlemen.",
  },
  {
    icon: "🌦",
    title: "Weather Forecast",
    desc: "Get hyper-local 7-day weather forecasts and alerts tailored for your farm location to plan field activities accurately.",
  },
  {
    icon: "📢",
    title: "Government Schemes",
    desc: "Stay updated on 100+ central and state government subsidies, insurance schemes, and financial support programmes.",
  },
  {
    icon: "💰",
    title: "Cost Calculator",
    desc: "Estimate your crop production costs, profit margins, and break-even points to make smarter financial decisions.",
  },
];

const steps = [
  { num: "01", title: "Create Account", desc: "Register for free in minutes using your mobile number or email." },
  { num: "02", title: "Explore Tools", desc: "Discover crop guides, weather data, AI chat, and market prices." },
  { num: "03", title: "Buy or Sell", desc: "List your produce or browse verified vendor listings in the marketplace." },
  { num: "04", title: "Grow Smarter", desc: "Use AI-driven insights to increase yield and maximise profit season after season." },
];

const stats = [
  { value: 10000, suffix: "+", label: "Registered Farmers" },
  { value: 500, suffix: "+", label: "Verified Vendors" },
  { value: 50, suffix: "+", label: "Supported Crops" },
  { value: 24, suffix: "/7", label: "AI Assistance" },
  { value: 100, suffix: "+", label: "Government Schemes" },
];

const testimonials = [
  {
    name: "Ramesh Patel",
    location: "Nashik, Maharashtra",
    avatar: "RP",
    color: "#2E7D32",
    review:
      "Smart Krishi Mitra helped me choose better crops for my soil type and connected me directly with buyers in Pune. My income increased by 40% this season!",
  },
  {
    name: "Sunita Devi",
    location: "Varanasi, Uttar Pradesh",
    avatar: "SD",
    color: "#1565C0",
    review:
      "The AI assistant answered all my questions about wheat disease in Hindi. I saved my entire crop. This platform is a blessing for small farmers like me.",
  },
  {
    name: "Arjun Reddy",
    location: "Kurnool, Andhra Pradesh",
    avatar: "AR",
    color: "#6A1B9A",
    review:
      "The government schemes section helped me claim a subsidy I never knew existed. The weather alerts also saved me from irrigating on a rainy day!",
  },
];

/* ─────────────────────────────────────────────
   ANIMATED COUNTER HOOK
───────────────────────────────────────────── */
function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [start, target, duration]);
  return count;
}

/* ─────────────────────────────────────────────
   STAT CARD COMPONENT
───────────────────────────────────────────── */
function StatCard({ value, suffix, label, animate }) {
  const count = useCountUp(value, 2000, animate);
  return (
    <div className="stat-card">
      <span className="stat-value">
        {count}
        {suffix}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN LANDING COMPONENT
───────────────────────────────────────────── */
export default function Landing({ onViewChange }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  const handleViewChange = (view) => {
    if (typeof onViewChange === "function") {
      onViewChange(view);
    } else {
      navigate(`/${view}`);
    }
  };
  const [menuOpen, setMenuOpen] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  /* Navbar scroll effect */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Stats intersection observer */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  /* Scroll-reveal for sections */
  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
    return () => revealObserver.disconnect();
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="landing-root">

      {/* ── 1. NAVBAR ── */}
      <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <div className="nav-container">
          {/* Logo */}
          <div className="nav-logo" onClick={() => scrollTo("hero")}>
            <span className="logo-icon">🌱</span>
            <span className="logo-text">Smart Krishi Mitra</span>
          </div>

          {/* Desktop links */}
          <ul className={`nav-links ${menuOpen ? "nav-links--open" : ""}`}>
            {["hero", "features", "how-it-works", "about", "contact"].map((id, i) => (
              <li key={id}>
                <button className="nav-link" onClick={() => scrollTo(id)}>
                  {["Home", "Features", "Marketplace", "About", "Contact"][i]}
                </button>
              </li>
            ))}
            <li className="nav-actions">
              <button className="btn-outline" onClick={() => handleViewChange("login")}>Login</button>
              <button className="btn-primary" onClick={() => handleViewChange("signup")}>Sign Up</button>
            </li>
          </ul>

          {/* Hamburger */}
          <button
            className={`hamburger ${menuOpen ? "hamburger--open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ── 2. HERO ── */}
      <section id="hero" className="hero-section">
        {/* Background blobs */}
        <div className="hero-blob hero-blob--1" />
        <div className="hero-blob hero-blob--2" />

        <div className="hero-container">
          {/* Left content */}
          <div className="hero-content">
            <span className="hero-badge">🚀 India's #1 AgriTech Platform</span>
            <h1 className="hero-title">
              Smart<span className="gradient-text"> Krishi</span> Mitra
            </h1>
            <p className="hero-subtitle">
              Empowering Farmers with AI, Smart Technology, and Direct Market Access
            </p>
            <p className="hero-desc">
              Smart Krishi Mitra is an AI-powered agricultural platform that helps farmers with
              crop guidance, weather forecasting, AI assistance, government schemes, marketplace
              access, and cost estimation — all in one place.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary btn-lg" onClick={() => handleViewChange("signup")}>
                Get Started →
              </button>
              <button className="btn-outline btn-lg" onClick={() => scrollTo("features")}>
                Learn More
              </button>
            </div>
            {/* Trust badges */}
            <div className="hero-trust">
              <span>✅ Free to use</span>
              <span>✅ Multilingual support</span>
              <span>✅ AI-powered</span>
            </div>
          </div>

          {/* Right illustration */}
          <div className="hero-illustration">
            <div className="illus-card illus-card--main">
              <div className="illus-farmer">
                <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Ground */}
                  <ellipse cx="100" cy="200" rx="90" ry="15" fill="#A5D6A7" opacity="0.5"/>
                  {/* Body */}
                  <rect x="72" y="120" width="56" height="70" rx="8" fill="#1B5E20"/>
                  {/* Head */}
                  <circle cx="100" cy="95" r="28" fill="#FFCCBC"/>
                  {/* Hat */}
                  <ellipse cx="100" cy="70" rx="35" ry="8" fill="#8D6E63"/>
                  <rect x="78" y="55" width="44" height="18" rx="4" fill="#795548"/>
                  {/* Arms */}
                  <rect x="44" y="122" width="28" height="12" rx="6" fill="#1B5E20"/>
                  <rect x="128" y="122" width="28" height="12" rx="6" fill="#1B5E20"/>
                  {/* Phone in hand */}
                  <rect x="136" y="104" width="22" height="36" rx="4" fill="#212121"/>
                  <rect x="139" y="108" width="16" height="24" rx="2" fill="#4FC3F7"/>
                  {/* Crop / wheat */}
                  <line x1="50" y1="190" x2="50" y2="140" stroke="#4CAF50" strokeWidth="3"/>
                  <ellipse cx="50" cy="136" rx="8" ry="14" fill="#66BB6A"/>
                  <line x1="38" y1="185" x2="38" y2="155" stroke="#4CAF50" strokeWidth="2"/>
                  <ellipse cx="38" cy="152" rx="6" ry="10" fill="#81C784"/>
                  <line x1="62" y1="185" x2="62" y2="155" stroke="#4CAF50" strokeWidth="2"/>
                  <ellipse cx="62" cy="152" rx="6" ry="10" fill="#81C784"/>
                  {/* Sun */}
                  <circle cx="165" cy="40" r="18" fill="#FFD54F"/>
                  <line x1="165" y1="15" x2="165" y2="8" stroke="#FFD54F" strokeWidth="3" strokeLinecap="round"/>
                  <line x1="165" y1="72" x2="165" y2="65" stroke="#FFD54F" strokeWidth="3" strokeLinecap="round"/>
                  <line x1="140" y1="40" x2="133" y2="40" stroke="#FFD54F" strokeWidth="3" strokeLinecap="round"/>
                  <line x1="197" y1="40" x2="190" y2="40" stroke="#FFD54F" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>
            </div>

            {/* Floating mini-cards */}
            <div className="float-card float-card--weather">
              <span>🌤</span>
              <div>
                <strong>28°C</strong>
                <small>Partly Cloudy</small>
              </div>
            </div>
            <div className="float-card float-card--ai">
              <span>🤖</span>
              <div>
                <strong>AI Assistant</strong>
                <small>Online 24/7</small>
              </div>
            </div>
            <div className="float-card float-card--market">
              <span>📈</span>
              <div>
                <strong>₹2,450/qtl</strong>
                <small>Wheat today</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. FEATURES / WHY CHOOSE ── */}
      <section id="features" className="features-section reveal">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">✨ Why Choose Us</span>
            <h2 className="section-title">Everything a Farmer Needs in One Platform</h2>
            <p className="section-subtitle">
              From AI-driven crop advice to direct marketplace connections, we've built every tool
              a modern Indian farmer requires.
            </p>
          </div>
          <div className="features-grid">
            {features.map((f) => (
              <div className="feature-card glass-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
                <span className="feature-arrow">→</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS ── */}
      <section id="how-it-works" className="how-section reveal">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">⚡ Simple Steps</span>
            <h2 className="section-title">How Smart Krishi Mitra Works</h2>
            <p className="section-subtitle">Get started in minutes and transform your farming journey.</p>
          </div>
          <div className="steps-wrapper">
            {steps.map((step, i) => (
              <React.Fragment key={step.num}>
                <div className="step-card">
                  <div className="step-num">{step.num}</div>
                  <div className="step-icon">
                    {["👤", "🔍", "💼", "🚀"][i]}
                  </div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="step-arrow">→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. STATISTICS ── */}
      <section className="stats-section reveal" ref={statsRef}>
        <div className="stats-bg-overlay" />
        <div className="section-container">
          <div className="section-header section-header--light">
            <span className="section-tag section-tag--light">📊 Our Impact</span>
            <h2 className="section-title section-title--light">Trusted by Thousands of Farmers</h2>
          </div>
          <div className="stats-grid">
            {stats.map((s) => (
              <StatCard key={s.label} {...s} animate={statsVisible} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. TESTIMONIALS ── */}
      <section id="about" className="testimonials-section reveal">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">💬 Farmer Stories</span>
            <h2 className="section-title">What Farmers Are Saying</h2>
            <p className="section-subtitle">
              Real success stories from farmers across India who transformed their livelihoods.
            </p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t) => (
              <div className="testimonial-card glass-card" key={t.name}>
                <div className="stars">★★★★★</div>
                <p className="testimonial-review">"{t.review}"</p>
                <div className="testimonial-author">
                  <div
                    className="avatar"
                    style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}88)` }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <strong className="author-name">{t.name}</strong>
                    <small className="author-loc">📍 {t.location}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. CALL TO ACTION ── */}
      <section id="cta" className="cta-section reveal">
        <div className="cta-blob cta-blob--1" />
        <div className="cta-blob cta-blob--2" />
        <div className="cta-content">
          <span className="section-tag section-tag--light">🌟 Get Started Today</span>
          <h2 className="cta-title">Ready to Transform Your Farming Journey?</h2>
          <p className="cta-subtitle">
            Join over 10,000 farmers who are already using Smart Krishi Mitra to grow smarter,
            earn better, and farm sustainably.
          </p>
          <div className="cta-buttons">
            <button className="btn-white btn-lg" onClick={() => handleViewChange("signup")}>🚀 Join Now — It's Free</button>
            <button className="btn-outline-white btn-lg" onClick={() => scrollTo("contact")}>
              📞 Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* ── 8. FOOTER ── */}
      <footer id="contact" className="footer">
        <div className="footer-container">
          <div className="footer-grid">

            {/* Column 1 — Brand */}
            <div className="footer-col">
              <div className="footer-logo">
                <span className="logo-icon">🌱</span>
                <span className="logo-text">Smart Krishi Mitra</span>
              </div>
              <p className="footer-desc">
                Empowering Indian farmers with AI, smart technology, and direct market access for a
                sustainable and prosperous agricultural future.
              </p>
              <p className="footer-email">📧 support@krishimitra.in</p>
            </div>

            {/* Column 2 — Quick Links */}
            <div className="footer-col">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                {["Home", "Marketplace", "Crop Knowledge", "AI Assistant"].map((l) => (
                  <li key={l}><button onClick={() => scrollTo("hero")}>{l}</button></li>
                ))}
              </ul>
            </div>

            {/* Column 3 — Support */}
            <div className="footer-col">
              <h4 className="footer-heading">Support</h4>
              <ul className="footer-links">
                {["Help Center", "FAQs", "Contact Us"].map((l) => (
                  <li key={l}><button onClick={() => scrollTo("contact")}>{l}</button></li>
                ))}
              </ul>
            </div>

            {/* Column 4 — Social */}
            <div className="footer-col">
              <h4 className="footer-heading">Follow Us</h4>
              <div className="social-icons">
                {[
                  { icon: "f", label: "Facebook", color: "#1877F2" },
                  { icon: "📸", label: "Instagram", color: "#E1306C" },
                  { icon: "in", label: "LinkedIn", color: "#0A66C2" },
                  { icon: "▶", label: "YouTube", color: "#FF0000" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href="#!"
                    className="social-btn"
                    aria-label={s.label}
                    style={{ "--s-color": s.color }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
             
            </div>
          </div>

          {/* Bottom bar */}
          <div className="footer-bottom">
            <p>© 2026 Smart Krishi Mitra. All Rights Reserved. Made with 💚 for Indian Farmers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
