import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import ThemeToggle from "../components/ThemeToggle";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await API.post("/auth/register", { name, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <div className="page-content">
        <div className="topbar glass-panel">
          <div className="brand">
            <div className="brand-mark" aria-hidden="true">
              AI
            </div>
            <div className="brand-copy">
              <h1 className="brand-title">AI Study Buddy</h1>
              <p className="brand-subtitle">Create your personal study workspace</p>
            </div>
          </div>
          <div className="topbar-actions">
            <ThemeToggle />
          </div>
        </div>

        <section className="auth-grid" aria-label="Register page">
          <div className="hero-card">
            <div>
              <p className="eyebrow">Built for momentum</p>
              <h2 className="hero-title">Start a cleaner, faster revision routine.</h2>
              <p className="hero-text">
                Keep notes organized, turn dense material into concise summaries, and
                prepare for exams with quiz-ready study assets generated from your own
                content.
              </p>
            </div>

            <div className="hero-metrics" aria-label="Workspace features">
              <div className="stat-card">
                <p className="stat-value">Notes</p>
                <p className="stat-label">Capture full-topic material in one place</p>
              </div>
              <div className="stat-card">
                <p className="stat-value">Cards</p>
                <p className="stat-label">Flip through key concepts with less friction</p>
              </div>
              <div className="stat-card">
                <p className="stat-value">Quiz</p>
                <p className="stat-label">Check what you actually remember</p>
              </div>
            </div>
          </div>

          <div className="auth-card">
            <div>
              <p className="eyebrow">Create account</p>
              <h2 className="section-title">Set up your study workspace</h2>
              <p className="section-copy">
                Join with a few details and start building structured revision flows.
              </p>
            </div>

            <form className="stack" onSubmit={handleSubmit}>
              {error && (
                <div className="error-banner" role="alert" aria-live="polite">
                  {error}
                </div>
              )}

              <label className="field-group">
                <span className="field-label">Full name</span>
                <input
                  className="text-input"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </label>

              <label className="field-group">
                <span className="field-label">Email</span>
                <input
                  className="text-input"
                  type="text"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </label>

              <label className="field-group">
                <span className="field-label">Password</span>
                <input
                  className="text-input"
                  type="password"
                  placeholder="Choose a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </label>

              <div className="form-footer">
                <span className="muted-text">Your progress starts with a simple setup</span>
                <button className="primary-button" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="loading-dots" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </span>
                      Creating account...
                    </>
                  ) : (
                    "Register"
                  )}
                </button>
              </div>
            </form>

            <p className="section-copy">
              Already have an account?{" "}
              <Link className="auth-link" to="/login">
                Login
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Register;
