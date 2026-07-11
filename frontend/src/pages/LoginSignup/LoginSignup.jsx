import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Modal from "../../components/Modal/Modal";
import "./LoginSignup.css";

export default function LoginSignup({ initialIsLogin = true, onViewChange }) {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form States
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "", // Selected via Role Cards
    state: "",
    city: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  // Validation States
  const [errors, setErrors] = useState({});
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    setIsLogin(initialIsLogin);
    setErrors({});
  }, [initialIsLogin]);

  // Handle inputs
  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSignupChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Select Role Card handler
  const handleRoleSelect = (roleName) => {
    setSignupData((prev) => ({ ...prev, role: roleName }));
    if (errors.role) {
      setErrors((prev) => ({ ...prev, role: "" }));
    }
  };

  // Tab switching
  const handleTabSwitch = (toLogin) => {
    setIsLogin(toLogin);
    setErrors({});
    setIsLoading(false);
  };

  // Brand and Logo click handler
  const handleBrandClick = () => {
    if (typeof onViewChange === "function") {
      onViewChange("landing");
    } else {
      navigate("/");
    }
  };

  // Validators
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePhone = (phone) => /^\d{10}$/.test(phone);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!loginData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(loginData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!loginData.password) {
      newErrors.password = "Password is required";
    } else if (loginData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await login({
        email: loginData.email,
        password: loginData.password,
      });
      alert("Welcome back! Login Successful.");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      const backendMessage = error.response?.data?.message || "Invalid credentials or network error.";
      setErrors({ api: backendMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!signupData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!signupData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(signupData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!signupData.phone.trim()) {
      newErrors.phone = "Mobile number is required";
    } else if (!validatePhone(signupData.phone)) {
      newErrors.phone = "Enter a valid 10-digit mobile number";
    }

    if (!signupData.role) {
      newErrors.role = "Please select a profile role";
    }

    if (!signupData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!signupData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!signupData.password) {
      newErrors.password = "Password is required";
    } else if (signupData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!signupData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!signupData.terms) {
      newErrors.terms = "You must agree to the terms";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const capitalizedRole = signupData.role ? (signupData.role.charAt(0).toUpperCase() + signupData.role.slice(1)) : "Customer";
      
      const payload = {
        fullName: signupData.name,
        email: signupData.email,
        phone: signupData.phone,
        password: signupData.password,
        role: capitalizedRole,
        state: signupData.state,
        city: signupData.city
      };

      await register(payload);
      alert("Registration Successful! Welcome onboard.");
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup failed:", error);
      const backendMessage = error.response?.data?.message || "";
      
      if (error.response?.status === 409) {
        const newErrors = {};
        if (backendMessage.toLowerCase().includes("email")) {
          newErrors.email = "This email is already registered.";
        }
        if (backendMessage.toLowerCase().includes("phone")) {
          newErrors.phone = "This phone number is already registered.";
        }
        if (Object.keys(newErrors).length === 0) {
          newErrors.email = "This email is already registered.";
          newErrors.phone = "This phone number is already registered.";
        }
        setErrors(newErrors);
        setIsModalOpen(true);
      } else {
        setErrors({ api: backendMessage || "Registration failed. Account might already exist." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="saas-auth-page">
      
      {/* Floating Theme Toggle */}
      <button 
        onClick={toggleTheme} 
        className="saas-floating-theme-btn"
        title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        aria-label="Toggle theme mode"
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      {/* Background Animated Assets */}
      <div className="bg-blur-circle bg-blur-circle--1" />
      <div className="bg-blur-circle bg-blur-circle--2" />
      <div className="floating-leaf leaf-1">🍃</div>
      <div className="floating-leaf leaf-2">🍂</div>
      <div className="floating-leaf leaf-3">🌿</div>

      <div className={`saas-auth-container ${!isLogin ? "saas-auth-container--signup" : ""}`}>
        
        {/* ─── LEFT SECTION (60% HERO) ─── */}
        <div className="saas-auth-left">
          
          <div className="saas-brand" onClick={handleBrandClick}>
            <span className="brand-logo">🌱</span>
            <span className="brand-title">Smart Krishi Mitra</span>
          </div>

          <div className="left-hero-content">
            <h1 className="hero-heading">
              Empowering Farmers with <span className="highlight-green">AI &amp; Smart Tech</span>
            </h1>


            {/* Feature Pills */}
            <div className="feature-pills">
              <span className="pill">🌾 Crop Knowledge</span>
              <span className="pill">🤖 AI Assistant</span>
              <span className="pill">🛒 Marketplace</span>
              <span className="pill">🌦 Weather Insights</span>
              <span className="pill">📢 Gov Schemes</span>
              <span className="pill">💰 Cost Calculator</span>
            </div>
          </div>

          {/* Detailed 3D-styled SVG Illustration */}
          <div className="illus-container-3d">
            <svg viewBox="0 0 500 360" fill="none" className="saas-illus" xmlns="http://www.w3.org/2000/svg">
              {/* Ground & Shadow */}
              <ellipse cx="250" cy="300" rx="210" ry="28" fill="#E8F5E9" />
              <ellipse cx="250" cy="300" rx="170" ry="16" fill="#C8E6C9" opacity="0.6" />

              {/* Central Tablet/Device (AI interface) */}
              <g className="illus-tablet">
                <rect x="170" y="80" width="160" height="210" rx="20" fill="#263238" stroke="#ECEFF1" strokeWidth="4" />
                <rect x="178" y="90" width="144" height="170" rx="10" fill="#F1F8E9" />
                <circle cx="250" cy="275" r="8" fill="#CFD8DC" />
                
                {/* Graph inside Tablet */}
                <path d="M190,220 C220,180 230,230 260,160 C290,130 280,180 310,130" stroke="#2E7D32" strokeWidth="4" strokeLinecap="round" />
                <circle cx="260" cy="160" r="5" fill="#FFD54F" />
                <circle cx="310" cy="130" r="5" fill="#FFD54F" />
              </g>

              {/* Farmer Mascot Left */}
              <g className="illus-farmer">
                <circle cx="100" cy="190" r="22" fill="#FFCCBC" />
                <path d="M70,170 C90,170 110,170 130,170" stroke="#795548" strokeWidth="8" strokeLinecap="round" /> {/* Straw Hat Brim */}
                <path d="M85,170 L85,155 C85,150 115,150 115,155 L115,170 Z" fill="#A1887F" /> {/* Hat Crown */}
                <path d="M70,230 C70,212 130,212 130,230 L130,300 L70,300 Z" fill="#2E7D32" /> {/* Dress */}
              </g>

              {/* Crop Pots / Plant shoots */}
              <g className="illus-crop">
                <rect x="370" y="220" width="40" height="48" rx="6" fill="#8D6E63" />
                <path d="M390,220 C390,180 405,190 415,170" stroke="#4CAF50" strokeWidth="4" strokeLinecap="round" />
                <path d="M390,220 C370,195 385,185 380,175" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" />
                {/* Golden star crop glow */}
                <circle cx="415" cy="170" r="4" fill="#FFD54F" />
              </g>

              {/* Weather Graphic (Floating Sun-Cloud) */}
              <g className="floating-weather-illus">
                <circle cx="370" cy="90" r="16" fill="#FFD54F" />
                <path d="M345,110 C345,100 360,95 375,100 C385,95 400,105 395,115 C402,115 402,125 395,130 L345,130 Z" fill="#ECEFF1" />
              </g>

              {/* Tiny Floating Sparkles */}
              <circle cx="120" cy="100" r="3" fill="#81C784" />
              <circle cx="280" cy="60" r="4" fill="#FFD54F" />
              <circle cx="430" cy="270" r="3" fill="#81C784" />
            </svg>

            {/* Floating Glass Cards */}
            <div className="illus-glass-card glass-card--weather">
              <span className="card-emoji">☀️</span>
              <div className="card-info">
                <strong>Local Weather</strong>
                <small>Optimal sowing window open</small>
              </div>
            </div>

            <div className="illus-glass-card glass-card--market">
              <span className="card-emoji">📈</span>
              <div className="card-info">
                <strong>Market Prices</strong>
                <small>Wheat prices up by 12%</small>
              </div>
            </div>
          </div>



        </div>

        {/* ─── RIGHT SECTION (40% AUTH CARD) ─── */}
        <div className="saas-auth-right">
          
          <div className={`auth-card-wrapper glass-card ${!isLogin ? "auth-card-wrapper--signup" : ""}`}>
            
            {/* Logo on top of Card */}
            <div className="auth-card-logo" onClick={handleBrandClick}>
              <span className="logo-emoji">🌱</span>
              <span className="logo-subtext">Smart Krishi Mitra</span>
            </div>

            <div className="auth-card-header">
              <h2>Welcome Back</h2>
              <p>Sign in to continue your farming journey.</p>
            </div>

            {/* Pill-Shaped Switch Tabs */}
            <div className="pill-tabs-container">
              <button
                type="button"
                className={`pill-tab ${isLogin ? "pill-tab--active" : ""}`}
                onClick={() => handleTabSwitch(true)}
              >
                Login
              </button>
              <button
                type="button"
                className={`pill-tab ${!isLogin ? "pill-tab--active" : ""}`}
                onClick={() => handleTabSwitch(false)}
              >
                Sign Up
              </button>
              {/* Sliding Capsule Background */}
              <div className={`pill-sliding-capsule ${!isLogin ? "pill-sliding-capsule--signup" : ""}`} />
            </div>

            {/* ────────── LOGIN FORM ────────── */}
            {isLogin ? (
              <form onSubmit={handleLoginSubmit} className="saas-form fade-in">
                {errors.api && (
                  <div className="saas-error-text" style={{ 
                    backgroundColor: '#FEE2E2', 
                    color: '#991B1B', 
                    padding: '10px 14px', 
                    borderRadius: '8px', 
                    fontSize: '0.85rem', 
                    marginBottom: '16px',
                    border: '1px solid #FCA5A5',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}>
                    ⚠️ {errors.api}
                  </div>
                )}
                
                {/* Email Field */}
                <div className="saas-form-group">
                  <label htmlFor="login-email">Email Address</label>
                  <div className="saas-input-wrapper">
                    <span className="input-leading-icon">📧</span>
                    <input
                      id="login-email"
                      type="text"
                      name="email"
                      placeholder="name@example.com"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      className={errors.email ? "input-has-error" : ""}
                    />
                  </div>
                  {errors.email && <span className="saas-error-text">{errors.email}</span>}
                </div>

                {/* Password Field */}
                <div className="saas-form-group">
                  <label htmlFor="login-password">Password</label>
                  <div className="saas-input-wrapper">
                    <span className="input-leading-icon">🔒</span>
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      className={errors.password ? "input-has-error" : ""}
                    />
                    <button
                      type="button"
                      className="password-reveal-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? "👁️" : "🙈"}
                    </button>
                  </div>
                  {errors.password && <span className="saas-error-text">{errors.password}</span>}
                </div>

                <div className="saas-form-options">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={loginData.rememberMe}
                      onChange={handleLoginChange}
                    />
                    <span>Remember Me</span>
                  </label>
                  <a href="#!" className="forgot-password-link">Forgot Password?</a>
                </div>

                <button type="submit" className="btn-primary-gradient" disabled={isLoading}>
                  {isLoading ? <span className="auth-spinner">⌛</span> : "Sign In"}
                </button>

                <div className="saas-divider">
                  <span>or continue with</span>
                </div>

                <button type="button" className="btn-google-outline">
                  <svg className="google-svg-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18px" height="18px">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.5 24c0-1.61-.15-3.16-.42-4.69H24v9.09h12.64c-.55 2.89-2.18 5.33-4.64 6.98l7.23 5.61C43.46 36.52 46.5 30.82 46.5 24z"/>
                    <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.23-5.61c-2.01 1.35-4.58 2.17-8.66 2.17-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  Sign in with Google
                </button>

                <p className="card-footer-prompt">
                  Don't have an account?{" "}
                  <button type="button" onClick={() => handleTabSwitch(false)}>Sign Up</button>
                </p>

              </form>
            ) : (
              /* ────────── SIGNUP FORM ────────── */
              <form onSubmit={handleSignupSubmit} className="saas-form saas-form--signup fade-in">
                {errors.api && (
                  <div className="saas-error-text" style={{ 
                    backgroundColor: '#FEE2E2', 
                    color: '#991B1B', 
                    padding: '10px 14px', 
                    borderRadius: '8px', 
                    fontSize: '0.85rem', 
                    marginBottom: '16px',
                    border: '1px solid #FCA5A5',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}>
                    ⚠️ {errors.api}
                  </div>
                )}
                
                <div className="saas-signup-grid">
                  {/* Left Column: Personal Info & Role */}
                  <div className="saas-signup-column">
                    {/* Name */}
                    <div className="saas-form-group">
                      <label htmlFor="signup-name">Full Name</label>
                      <div className="saas-input-wrapper">
                        <span className="input-leading-icon">👤</span>
                        <input
                          id="signup-name"
                          type="text"
                          name="name"
                          placeholder="Your full name"
                          value={signupData.name}
                          onChange={handleSignupChange}
                          className={errors.name ? "input-has-error" : ""}
                        />
                      </div>
                      {errors.name && <span className="saas-error-text">{errors.name}</span>}
                    </div>

                    {/* Email */}
                    <div className="saas-form-group">
                      <label htmlFor="signup-email">Email Address</label>
                      <div className="saas-input-wrapper">
                        <span className="input-leading-icon">📧</span>
                        <input
                          id="signup-email"
                          type="text"
                          name="email"
                          placeholder="name@example.com"
                          value={signupData.email}
                          onChange={handleSignupChange}
                          className={errors.email ? "input-has-error" : ""}
                        />
                      </div>
                      {errors.email && <span className="saas-error-text">{errors.email}</span>}
                    </div>

                    {/* Mobile */}
                    <div className="saas-form-group">
                      <label htmlFor="signup-phone">Mobile Number</label>
                      <div className="saas-input-wrapper">
                        <span className="input-leading-icon">📞</span>
                        <input
                          id="signup-phone"
                          type="text"
                          name="phone"
                          placeholder="10-digit mobile number"
                          value={signupData.phone}
                          onChange={handleSignupChange}
                          className={errors.phone ? "input-has-error" : ""}
                        />
                      </div>
                      {errors.phone && <span className="saas-error-text">{errors.phone}</span>}
                    </div>

                    {/* ROLE CARDS SELECTOR */}
                    <div className="saas-form-group">
                      <label>Select Profile Role</label>
                      <div className="role-cards-grid">
                        {[
                          { value: "farmer", icon: "🌾", label: "Farmer" },
                          { value: "vendor", icon: "🛒", label: "Vendor" },
                          { value: "customer", icon: "👤", label: "Customer" },
                        ].map((r) => (
                          <div
                            key={r.value}
                            className={`role-select-card ${signupData.role === r.value ? "role-select-card--active" : ""}`}
                            onClick={() => handleRoleSelect(r.value)}
                          >
                            <span className="role-card-icon">{r.icon}</span>
                            <span className="role-card-label">{r.label}</span>
                            {signupData.role === r.value && <span className="role-card-check">✓</span>}
                          </div>
                        ))}
                      </div>
                      {errors.role && <span className="saas-error-text">{errors.role}</span>}
                    </div>
                  </div>

                  {/* Right Column: Location, Password & Submit */}
                  <div className="saas-signup-column">
                    {/* State and City Grid */}
                    <div className="saas-form-row">
                      <div className="saas-form-group">
                        <label htmlFor="signup-state">State</label>
                        <div className="saas-input-wrapper">
                          <span className="input-leading-icon">📍</span>
                          <input
                            id="signup-state"
                            type="text"
                            name="state"
                            placeholder="State"
                            value={signupData.state}
                            onChange={handleSignupChange}
                            className={errors.state ? "input-has-error" : ""}
                          />
                        </div>
                        {errors.state && <span className="saas-error-text">{errors.state}</span>}
                      </div>

                      <div className="saas-form-group">
                        <label htmlFor="signup-city">City</label>
                        <div className="saas-input-wrapper">
                          <span className="input-leading-icon">🏙️</span>
                          <input
                            id="signup-city"
                            type="text"
                            name="city"
                            placeholder="City"
                            value={signupData.city}
                            onChange={handleSignupChange}
                            className={errors.city ? "input-has-error" : ""}
                          />
                        </div>
                        {errors.city && <span className="saas-error-text">{errors.city}</span>}
                      </div>
                    </div>

                    {/* Password */}
                    <div className="saas-form-group">
                      <label htmlFor="signup-password">Password</label>
                      <div className="saas-input-wrapper">
                        <span className="input-leading-icon">🔒</span>
                        <input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="••••••••"
                          value={signupData.password}
                          onChange={handleSignupChange}
                          className={errors.password ? "input-has-error" : ""}
                        />
                        <button
                          type="button"
                          className="password-reveal-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label="Toggle password visibility"
                        >
                          {showPassword ? "👁️" : "🙈"}
                        </button>
                      </div>
                      {errors.password && <span className="saas-error-text">{errors.password}</span>}
                    </div>

                    {/* Confirm Password */}
                    <div className="saas-form-group">
                      <label htmlFor="signup-confirmPassword">Confirm Password</label>
                      <div className="saas-input-wrapper">
                        <span className="input-leading-icon">🔒</span>
                        <input
                          id="signup-confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          placeholder="••••••••"
                          value={signupData.confirmPassword}
                          onChange={handleSignupChange}
                          className={errors.confirmPassword ? "input-has-error" : ""}
                        />
                        <button
                          type="button"
                          className="password-reveal-toggle"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label="Toggle password confirmation visibility"
                        >
                          {showConfirmPassword ? "👁️" : "🙈"}
                        </button>
                      </div>
                      {errors.confirmPassword && <span className="saas-error-text">{errors.confirmPassword}</span>}
                    </div>

                    {/* Terms and Conditions Checkbox */}
                    <div className="saas-form-group checkbox-wrapper">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="terms"
                          checked={signupData.terms}
                          onChange={handleSignupChange}
                        />
                        <span>I agree to the Terms &amp; Conditions</span>
                      </label>
                      {errors.terms && <span className="saas-error-text">{errors.terms}</span>}
                    </div>

                    <button type="submit" className="btn-primary-gradient" disabled={isLoading} style={{ marginTop: '4px' }}>
                      {isLoading ? <span className="auth-spinner">⌛</span> : "Create Account"}
                    </button>
                  </div>
                </div>

                <p className="card-footer-prompt" style={{ width: '100%', marginTop: '12px' }}>
                  Already have an account?{" "}
                  <button type="button" onClick={() => handleTabSwitch(true)}>Login</button>
                </p>

              </form>
            )}

          </div>
        </div>

      </div>

      {/* ── Account Already Exists Modal ── */}
      <Modal
        isOpen={isModalOpen}
        title="Account Already Exists"
        onClose={() => setIsModalOpen(false)}
        variant="default"
        size="md"
        actions={
          <>
            <button 
              type="button" 
              className="btn-google-outline" 
              onClick={() => setIsModalOpen(false)}
              style={{ padding: '10px 20px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', margin: '0' }}
            >
              Stay on Sign Up
            </button>
            <button 
              type="button" 
              className="btn-primary-gradient" 
              onClick={() => {
                setIsModalOpen(false);
                handleTabSwitch(true); // Switch to Login tab
              }}
              style={{ padding: '10px 20px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', margin: '0', background: 'linear-gradient(135deg, var(--primary-green), var(--secondary-green))', color: '#fff', border: 'none' }}
            >
              Go to Login
            </button>
          </>
        }
      >
        <div style={{ fontFamily: '"Poppins", sans-serif', color: '#334155' }}>
          <p style={{ marginBottom: '12px', fontSize: '0.95rem', lineHeight: '1.6' }}>
            An account with this email address or phone number already exists.
          </p>
          <p style={{ marginBottom: '12px', fontSize: '0.95rem', lineHeight: '1.6' }}>
            Please use a different email address and phone number to create a new account.
          </p>
          <p style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
            If this is your account, please sign in using your existing credentials.
          </p>
        </div>
      </Modal>
    </div>
  );
}
