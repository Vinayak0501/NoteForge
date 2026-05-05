import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import ThemeToggle from "../components/ThemeToggle";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const Navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", { email, password });
      login(res.data.token, res.data.name);
      Navigate("/dashboard");
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
              <p className="brand-subtitle">Your smarter study workflow</p>
            </div>
          </div>
          <div className="topbar-actions">
            <ThemeToggle />
          </div>
        </div>

        <section className="auth-grid" aria-label="Login page">
          <div className="hero-card">
            <div>
              <p className="eyebrow">Focused learning</p>
              <h2 className="hero-title">Turn scattered notes into a study system.</h2>
              <p className="hero-text">
                Organize subjects, generate summaries, and build review-ready flashcards
                and quizzes from the same notes you already take.
              </p>
            </div>

            <div className="hero-metrics" aria-label="Product highlights">
              <div className="stat-card">
                <p className="stat-value">1</p>
                <p className="stat-label">Workspace for notes, quizzes, and summaries</p>
              </div>
              <div className="stat-card">
                <p className="stat-value">Fast</p>
                <p className="stat-label">Instant study aids without leaving your dashboard</p>
              </div>
              <div className="stat-card">
                <p className="stat-value">Clear</p>
                <p className="stat-label">Clean structure built for repeat review sessions</p>
              </div>
            </div>
          </div>

          <div className="auth-card">
            <div>
              <p className="eyebrow">Welcome back</p>
              <h2 className="section-title">Log in to continue studying</h2>
              <p className="section-copy">
                Access your notes and AI-powered study materials from one place.
              </p>
            </div>

            <form className="stack" onSubmit={handleSubmit}>
              {error && (
                <div className="error-banner" role="alert" aria-live="polite">
                  {error}
                </div>
              )}

              <label className="field-group">
                <span className="field-label">Email</span>
                <input
                  className="text-input"
                  type="email"
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </label>

              <div className="form-footer">
                <span className="muted-text">Secure sign-in for your study workspace</span>
                <button className="primary-button" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="loading-dots" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </span>
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </form>

            <p className="section-copy">
              Don&apos;t have an account?{" "}
              <Link className="auth-link" to="/register">
                Register
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;
