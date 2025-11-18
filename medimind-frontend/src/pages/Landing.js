import React from "react";
import "../Landing.css";

export default function Landing() {
  return (
    <div className="landing-container">
      <nav className="navbar">
        <div className="navbar-logo">
          <div className="logo-icon"></div>
          <h2>MediMind</h2>
        </div>
        <ul className="nav-links">
          <li>Home</li>
          <li>About</li>
          <li>Features</li>
          <li>Contact</li>
        </ul>
        <div className="nav-buttons">
          <button
            className="login-btn"
            onClick={() => (window.location.href = "/login")}
          >
            Login
          </button>
          <button
            className="signup-btn"
            onClick={() => (window.location.href = "/signup")}
          >
            Sign Up
          </button>
        </div>
      </nav>
      <section className="hero">
        <div className="hero-left">
          <h1>Transforming Pharmacies with AI Intelligence</h1>
          <p>
            Manage medicines, track sales, and predict demand — all in one
            intelligent dashboard.
          </p>
          <div className="hero-buttons">
            <button
              className="get-started-btn"
              onClick={() => (window.location.href = "/login")}
            >
              Get Started
            </button>
            <button className="learn-btn">Learn More</button>
          </div>
        </div>
        <div className="hero-right">
          <img
            src="https://cdn.dribbble.com/userupload/9428494/file/original-9ccae083e7d2a3ce4bffb55a94e11804.png?resize=1200x900&vertical=center"
            alt="AI Dashboard"
          />
        </div>
      </section>

      <section className="features">
        <h2>Powerful Features to Streamline Your Pharmacy</h2>
        <p>
          Discover how MediMind’s intelligent tools can enhance your operational
          efficiency and patient care.
        </p>

        <div className="feature-grid">
          <div className="feature-card">
            <h4>Smart Inventory</h4>
            <p>
              Automate stock tracking and prevent shortages with AI-powered
              inventory management.
            </p>
          </div>
          <div className="feature-card">
            <h4>Sales Insights</h4>
            <p>
              Gain deep insights into your sales data with comprehensive,
              easy-to-read reports.
            </p>
          </div>
          <div className="feature-card">
            <h4>Critical Alerts</h4>
            <p>
              Receive real-time notifications for low stock, expiring medicines,
              and critical events.
            </p>
          </div>
          <div className="feature-card">
            <h4>AI Predictions</h4>
            <p>
              Forecast future demand and optimize your purchasing with our
              predictive analytics engine.
            </p>
          </div>
        </div>
      </section>

      <section className="mission">
        <div className="mission-left">
          <h3>Our Mission</h3>
          <p>
            At MediMind, our mission is to empower pharmacies of all sizes with
            cutting-edge artificial intelligence, transforming complex data into
            actionable insights. We are dedicated to enhancing operational
            efficiency, improving patient outcomes, and pioneering the future of
            pharmacy management.
          </p>
        </div>
        <div className="mission-right">
          <img
            src="https://cdn.dribbble.com/userupload/12411281/file/original-fdc319509bdbfa26309b39cd37df2c7b.png?resize=1200x900&vertical=center"
            alt="Doctors discussing"
          />
        </div>
      </section>

      <section className="cta-section">
        <h2>Start Managing Your Pharmacy Smarter.</h2>
        <button
          className="cta-btn"
          onClick={() => (window.location.href = "/signup")}
        >
          Get Started Now
        </button>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h2>MediMind</h2>
            <p>The future of pharmacy management.</p>
          </div>
          <div className="footer-columns">
            <div>
              <h4>Company</h4>
              <p>About Us</p>
              <p>Careers</p>
              <p>Blog</p>
              <p>Pricing</p>
            </div>
            <div>
              <h4>Resources</h4>
              <p>Documentation</p>
              <p>API Status</p>
              <p>Case Studies</p>
              <p>Security</p>
            </div>
            <div>
              <h4>Support</h4>
              <p>Help Center</p>
              <p>FAQs</p>
              <p>Contact Us</p>
            </div>
            <div>
              <h4>Legal</h4>
              <p>Privacy Policy</p>
              <p>Terms of Service</p>
            </div>
          </div>
        </div>
        <hr />
        <p className="footer-bottom">© 2025 MediMind | All Rights Reserved.</p>
      </footer>
    </div>
  );
}
