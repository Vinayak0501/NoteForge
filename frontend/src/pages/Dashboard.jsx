import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AppHeader from "../components/AppHeader";

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [notesLoading, setNotesLoading] = useState(true);
  const [notesError, setNotesError] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    setNotesLoading(true);
    setNotesError("");

    try {
      const res = await axios.get("/notes");
      setNotes(res.data);
    } catch (err) {
      console.log(err);
      setNotesError("We couldn't load your notes right now. Please try again.");
    } finally {
      setNotesLoading(false);
    }
  }

  async function handleCreateNote(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/notes", { title, content });
      setTitle("");
      setContent("");
      fetchNotes();
    } catch (err) {
      console.log(err);
      setNotesError("Your note wasn't saved. Please try again.");
    }
    setLoading(false);
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <main className="page-shell">
      <div className="page-content">
        <AppHeader
          title="AI Study Buddy"
          subtitle={`Welcome back, ${user}`}
          secondaryAction={
            <span className="pill pill-primary" aria-label={`Signed in as ${user}`}>
              {user}
            </span>
          }
          action={
            <button className="ghost-button" type="button" onClick={handleLogout}>
              Logout
            </button>
          }
        />

        <section className="dashboard-grid">
          <aside className="panel-card">
            <div>
              <p className="eyebrow">Create note</p>
              <h2 className="section-title">Add a new study topic</h2>
              <p className="section-copy">
                Save your raw notes first. You can generate summaries, flashcards, and
                quizzes later from the same content.
              </p>
            </div>

            <form className="stack" onSubmit={handleCreateNote}>
              <label className="field-group">
                <span className="field-label">Title</span>
                <input
                  className="text-input"
                  type="text"
                  placeholder="Operating Systems, DBMS, Calculus..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </label>

              <label className="field-group">
                <span className="field-label">Notes</span>
                <textarea
                  className="text-area"
                  placeholder="Paste or write your notes here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={8}
                />
              </label>

              <div className="form-footer">
                <span className="muted-text">Your original content stays editable and central.</span>
                <button className="primary-button" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="loading-dots" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </span>
                      Saving...
                    </>
                  ) : (
                    "Save Note"
                  )}
                </button>
              </div>
            </form>
          </aside>

          <section className="notes-section" aria-labelledby="notes-heading">
            <div className="notes-toolbar">
              <div>
                <p className="eyebrow">Library</p>
                <h2 className="section-title" id="notes-heading">
                  Your notes
                </h2>
                <p className="section-copy">
                  Open any note to generate learning material and review your progress.
                </p>
              </div>

              <div className="meta-row">
                <span className="pill">{notes.length} saved</span>
                <button className="secondary-button" type="button" onClick={fetchNotes}>
                  Refresh
                </button>
              </div>
            </div>

            {notesError && (
              <div className="error-banner" role="alert" aria-live="polite">
                {notesError}
              </div>
            )}

            {notesLoading ? (
              <div className="status-banner" aria-live="polite">
                <h3 className="empty-title">Loading your notes</h3>
                <p className="status-copy">
                  We&apos;re pulling the latest content into your dashboard.
                </p>
              </div>
            ) : notes.length === 0 ? (
              <div className="empty-state">
                <h3 className="empty-title">No notes yet</h3>
                <p className="empty-copy">
                  Add your first topic from the form on the left to start building your
                  study library.
                </p>
              </div>
            ) : (
              <div className="note-grid">
                {notes.map((note) => (
                  <button
                    key={note._id}
                    type="button"
                    className="note-card"
                    onClick={() => navigate(`/note/${note._id}`)}
                    aria-label={`Open note ${note.title}`}
                  >
                    <h3 className="note-card-title">{note.title}</h3>
                    <p className="note-card-copy">
                      {note.content.length > 120
                        ? `${note.content.substring(0, 120)}...`
                        : note.content}
                    </p>
                    <div className="meta-row">
                      <span className={note.flashcards.length > 0 ? "pill pill-success" : "pill"}>
                        {note.flashcards.length} flashcards
                      </span>
                      <span className={note.quiz.length > 0 ? "pill pill-primary" : "pill"}>
                        {note.quiz.length} quiz Qs
                      </span>
                      <span className={note.summary ? "pill pill-warning" : "pill"}>
                        {note.summary ? "summary ready" : "no summary"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}

export default Dashboard;
