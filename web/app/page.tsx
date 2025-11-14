export default function Home() {
  return (
    <>
      {/* Hero Section with Breathing Animation */}
      <section className="hero">
        <div className="breathing-circle"></div>
        <div className="hero-content">
          <div className="hero-badge">🧘 Your Journey to Inner Peace</div>
          <h1>Discover Calm in the Chaos</h1>
          <p className="hero-subtitle">
            Experience meditation reimagined. No accounts, no barriers—just you and tranquility.
          </p>
          <div className="cta-buttons">
            <a href="#download" className="btn btn-primary">
              <span className="btn-icon">📱</span>
              Start Meditating Free
            </a>
            <a href="#features" className="btn btn-secondary">
              <span className="btn-icon">✨</span>
              Explore Features
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat">
              <div className="stat-number">1M+</div>
              <div className="stat-label">Sessions Completed</div>
            </div>
            <div className="stat">
              <div className="stat-number">4.8★</div>
              <div className="stat-label">App Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="app-preview">
        <div className="container">
          <div className="preview-content">
            <div className="preview-text">
              <h2 className="section-title">Meditation Made Simple</h2>
              <p className="section-subtitle">
                Experience a meditation app designed for real life. Track your progress,
                build lasting habits, and find peace—no matter where you are.
              </p>
              <div className="preview-features">
                <div className="preview-feature">
                  <span className="preview-icon">⚡</span>
                  <div>
                    <h4>Start Instantly</h4>
                    <p>No registration. Just open and breathe.</p>
                  </div>
                </div>
                <div className="preview-feature">
                  <span className="preview-icon">🌐</span>
                  <div>
                    <h4>Speak Your Language</h4>
                    <p>Available in 6 languages worldwide.</p>
                  </div>
                </div>
                <div className="preview-feature">
                  <span className="preview-icon">📴</span>
                  <div>
                    <h4>Always Available</h4>
                    <p>Full offline mode for meditation anywhere.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="preview-visual">
              <div className="phone-mockup">
                <div className="phone-screen">
                  <div className="app-demo">
                    <div className="demo-circle"></div>
                    <p className="demo-text">Breathe In...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Everything You Need</h2>
            <p className="section-subtitle">
              Powerful features designed to support your meditation journey
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">🎯</span>
              </div>
              <h3>Progressive Learning</h3>
              <p>
                5 levels from beginner to master. Guided sessions that grow with you.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">🎵</span>
              </div>
              <h3>Immersive Audio</h3>
              <p>
                3-layer soundscapes: voice guidance, ambient sounds, and meditation chimes.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">📈</span>
              </div>
              <h3>Track Your Growth</h3>
              <p>
                Monitor streaks, sessions, and minutes. Watch your practice flourish.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">💭</span>
              </div>
              <h3>Daily Wisdom</h3>
              <p>
                Unique inspirational quotes that never repeat, in your language.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">🎨</span>
              </div>
              <h3>Cultural Traditions</h3>
              <p>
                Explore Zen, Mindfulness, Vipassana, and meditation from around the world.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">🌙</span>
              </div>
              <h3>Day & Night</h3>
              <p>
                Beautiful dark mode that adapts to your meditation time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">Loved by Meditators Worldwide</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">
                "Finally, a meditation app that respects my privacy. No account needed,
                and it works perfectly offline. Life-changing!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">S</div>
                <div>
                  <div className="author-name">Sarah M.</div>
                  <div className="author-location">United States</div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">
                "The progressive learning structure helped me build a real meditation habit.
                I've meditated every day for 3 months now."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">M</div>
                <div>
                  <div className="author-name">Michael K.</div>
                  <div className="author-location">Germany</div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">
                "Beautiful design and the multi-language support is perfect.
                I can meditate in my native Polish. Absolutely wonderful!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">A</div>
                <div>
                  <div className="author-name">Anna W.</div>
                  <div className="author-location">Poland</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download CTA Section */}
      <section id="download" className="download-section">
        <div className="container">
          <div className="download-content">
            <h2 className="section-title">Begin Your Journey Today</h2>
            <p className="section-subtitle">
              Join thousands finding peace through meditation. Available on iOS and Android.
            </p>
            <div className="download-buttons">
              <a href="#" className="store-button">
                <div className="store-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5Z" fill="currentColor"/>
                    <path d="M13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="store-text">
                  <div className="store-label">Download on the</div>
                  <div className="store-name">App Store</div>
                </div>
              </a>
              <a href="#" className="store-button">
                <div className="store-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.6 3 21.09 3 20.5Z" fill="currentColor"/>
                    <path d="M16.81 15.12L6.05 21.34L14.54 12.85L16.81 15.12Z" fill="currentColor"/>
                    <path d="M20.16 10.81C20.5 11.08 20.75 11.5 20.75 12C20.75 12.5 20.53 12.9 20.18 13.18L17.89 14.5L15.39 12L17.89 9.5L20.16 10.81Z" fill="currentColor"/>
                    <path d="M6.05 2.66L16.81 8.88L14.54 11.15L6.05 2.66Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="store-text">
                  <div className="store-label">Get it on</div>
                  <div className="store-name">Google Play</div>
                </div>
              </a>
            </div>
            <p className="download-note">✨ Free to download • No credit card required</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>Slow Spot</h3>
              <p>Find your inner peace, one breath at a time.</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#download">Download</a>
                <a href="#">Pricing</a>
              </div>
              <div className="footer-column">
                <h4>Support</h4>
                <a href="#">Help Center</a>
                <a href="#">Contact Us</a>
                <a href="#">Privacy Policy</a>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <a href="#">About Us</a>
                <a href="#">Blog</a>
                <a href="#">Careers</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 Slow Spot. All rights reserved.</p>
            <p>Built with mindfulness for a better world.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
