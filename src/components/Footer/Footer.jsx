import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt 
} from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="skm-footer">
      <div className="skm-footer-top">
        <div className="skm-footer-grid">
          
          {/* Brand & About */}
          <div className="skm-footer-col skm-footer-brand-col">
            <div className="skm-footer-brand">
              <span className="skm-footer-logo-icon">🌿</span>
              <h2 className="skm-footer-logo-text">Smart Krishi Mitra</h2>
            </div>
            <p className="skm-footer-desc">
              Empowering Indian farmers through AI-driven insights, direct marketplace access, and advanced crop knowledge to foster sustainable agricultural progress.
            </p>
            <div className="skm-footer-social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="skm-social-btn" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="skm-social-btn" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="skm-social-btn" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="skm-social-btn" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="skm-footer-col">
            <h3 className="skm-footer-heading">Quick Links</h3>
            <ul className="skm-footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/marketplace">Marketplace</Link></li>
              <li><Link to="/crop-knowledge">Crop Knowledge</Link></li>
              <li><Link to="/calculator">Cost Calculator</Link></li>
              <li><Link to="/weather">Weather Forecast</Link></li>
            </ul>
          </div>

          {/* Legal & Help */}
          <div className="skm-footer-col">
            <h3 className="skm-footer-heading">Legal &amp; Help</h3>
            <ul className="skm-footer-links">
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/faq">FAQ &amp; Support</Link></li>
              <li><Link to="/news-schemes">Govt Schemes</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="skm-footer-col">
            <h3 className="skm-footer-heading">Contact Us</h3>
            <ul className="skm-footer-contact">
              <li>
                <FaMapMarkerAlt className="skm-contact-icon" />
                <span>Navi Mumbai, Maharashtra, India</span>
              </li>
              <li>
                <FaPhoneAlt className="skm-contact-icon" />
                <span>+91 98765 43210</span>
              </li>
              <li>
                <FaEnvelope className="skm-contact-icon" />
                <span>support@smartkrishimitra.in</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      <div className="skm-footer-bottom">
        <div className="skm-footer-bottom-inner">
          <p className="skm-copyright">
            &copy; {currentYear} Smart Krishi Mitra. All rights reserved.
          </p>
          <div className="skm-footer-badges">
            <span className="skm-footer-badge">Secure User Panel</span>
            <span className="skm-footer-badge">Made with ❤️ for Farmers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
