import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import AppHeader from "../components/AppHeader";

function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("summary");

  useEffect(() => {
    fetchNote();
  }, []);

  async function fetchNote() {
    setPageLoading(true);
    setError("");

    try {
      const res = await axios.get(`/notes/${id}`);
      setNote(res.data);
    } catch (err) {
      console.log(err);
      setError("We couldn't load this note right now. Please go back and try again.");
    } finally {
      setPageLoading(false);
    }
  }

  async function handleGenerate(type) {
    setLoading(type);
    setError("");

    try {
      const res = await axios.post(`/generate/${type}/${id}`);
      setNote((prev) => ({ ...prev, ...res.data }));
      setActiveTab(type === "flashcards" ? "flashcards" : type === "quiz" ? "quiz" : "summary");
    } catch (err) {
      console.log(err);
      setError(`We couldn't generate ${type} right now. Please try again.`);
    }

    setLoading("");
  }

  if (pageLoading) {
    return (
      <main className="page-shell">
        <div className="page-content">
          <div className="status-banner" aria-live="polite">
            <h2 className="section-title">Loading note</h2>
            <p className="status-copy">Preparing the full note and its study materials.</p>
          </div>
        </div>
      </main>
    );
  }

  if (!note) {
    return (
      <main className="page-shell">
        <div className="page-content">
          <div className="empty-state">
            <h2 className="section-title">Note unavailable</h2>
            <p className="empty-copy">
              This note could not be displayed. Return to the dashboard and try again.
            </p>
            <div className="spacer-top">
              <button className="primary-button" type="button" onClick={() => navigate("/dashboard")}>
                Back to dashboard
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const actions = [
    {
      key: "summary",
      title: "Generate Summary",
      copy: "Condense the note into a quick review-ready overview.",
    },
    {
      key: "flashcards",
      title: "Generate Flashcards",
      copy: "Turn key concepts into fast active-recall practice cards.",
    },
    {
      key: "quiz",
      title: "Generate Quiz",
      copy: "Create MCQs to test recall and understanding.",
    },
  ];

  return (
    <main className="page-shell">
      <div className="page-content">
        <AppHeader
          title="AI Study Buddy"
          subtitle="Study material generator"
          secondaryAction={
            <button className="ghost-button" type="button" onClick={() => navigate("/dashboard")}>
              Back
            </button>
          }
        />

        <section className="detail-grid">
          <div className="stack">
            <article className="panel-card">
              <div className="note-header">
                <div>
                  <p className="eyebrow">Source note</p>
                  <h2 className="note-title">{note.title}</h2>
                </div>
                <div className="meta-row">
                  <span className={note.summary ? "pill pill-warning" : "pill"}>Summary</span>
                  <span className={note.flashcards.length > 0 ? "pill pill-success" : "pill"}>
                    {note.flashcards.length} cards
                  </span>
                  <span className={note.quiz.length > 0 ? "pill pill-primary" : "pill"}>
                    {note.quiz.length} quiz items
                  </span>
                </div>
              </div>

              <p className="note-body">{note.content}</p>
            </article>

            {error && (
              <div className="error-banner" role="alert" aria-live="polite">
                {error}
              </div>
            )}

            <div className="tab-row">
              <div>
                <p className="eyebrow">Review output</p>
                <h2 className="section-title">Study materials</h2>
              </div>
              <div className="tab-group" role="tablist" aria-label="Study material tabs">
                {["summary", "flashcards", "quiz"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className="tab-button"
                    aria-selected={activeTab === tab}
                    role="tab"
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="result-card">
              {activeTab === "summary" && (
                note.summary ? (
                  <p className="note-body">{note.summary}</p>
                ) : (
                  <div className="empty-state">
                    <h3 className="empty-title">No summary yet</h3>
                    <p className="empty-copy">
                      Generate a summary to create a concise version of this note for quick revision.
                    </p>
                  </div>
                )
              )}

              {activeTab === "flashcards" && (
                note.flashcards.length === 0 ? (
                  <div className="empty-state">
                    <h3 className="empty-title">No flashcards yet</h3>
                    <p className="empty-copy">
                      Generate flashcards to practice recall from this topic in short bursts.
                    </p>
                  </div>
                ) : (
                  <div className="flashcards-grid">
                    {note.flashcards.map((card, i) => (
                      <FlipCard key={i} front={card.front} back={card.back} />
                    ))}
                  </div>
                )
              )}

              {activeTab === "quiz" && (
                note.quiz.length === 0 ? (
                  <div className="empty-state">
                    <h3 className="empty-title">No quiz yet</h3>
                    <p className="empty-copy">
                      Generate quiz questions to test how well you understand this note.
                    </p>
                  </div>
                ) : (
                  <QuizSection questions={note.quiz} />
                )
              )}
            </div>
          </div>

          <aside className="stack">
            <div className="panel-card">
              <p className="eyebrow">AI actions</p>
              <h2 className="section-title">Build study assets</h2>
              <p className="section-copy">
                Generate exactly what you need next, then switch tabs to review it.
              </p>

              <div className="action-grid spacer-top-lg">
                {actions.map((action) => (
                  <button
                    key={action.key}
                    type="button"
                    className="action-card"
                    onClick={() => handleGenerate(action.key)}
                    disabled={loading === action.key}
                    aria-busy={loading === action.key}
                  >
                    <h3 className="action-card-title">{action.title}</h3>
                    <p className="action-card-copy">{action.copy}</p>
                    <span className="pill pill-primary">
                      {loading === action.key ? "Generating..." : "Run"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="status-banner">
              <h3 className="empty-title">Study flow</h3>
              <p className="status-copy">
                Start with a summary for clarity, then use flashcards for recall and quiz mode
                for self-testing.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

function FlipCard({ front, back }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flip-card">
      <button
        type="button"
        className={`flip-card-button${flipped ? " is-flipped" : ""}`}
        onClick={() => setFlipped(!flipped)}
        aria-pressed={flipped}
      >
        <div className="flip-card-inner">
          <div className="flip-face front">
            <strong>{front}</strong>
            <span className="flip-hint">Click to reveal the answer</span>
          </div>
          <div className="flip-face back">
            <strong>{back}</strong>
            <span className="flip-hint">Click to flip back</span>
          </div>
        </div>
      </button>
    </div>
  );
}

function QuizSection({ questions }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function handleSelect(qIndex, option) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: option }));
  }

  function getScore() {
    return questions.filter((q, i) => answers[i] === q.answer).length;
  }

  return (
    <div className="quiz-list">
      {questions.map((q, i) => (
        <article key={i} className="quiz-card">
          <p className="quiz-question">
            {i + 1}. {q.question}
          </p>

          <div className="quiz-options">
            {q.options.map((opt, j) => {
              let stateClass = "";

              if (submitted) {
                if (opt === q.answer) stateClass = " correct";
                else if (opt === answers[i] && answers[i] !== q.answer) stateClass = " incorrect";
              } else if (answers[i] === opt) {
                stateClass = " selected";
              }

              return (
                <button
                  key={j}
                  type="button"
                  className={`option-button${stateClass}`}
                  onClick={() => handleSelect(i, opt)}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </article>
      ))}

      {!submitted ? (
        <button className="primary-button" type="button" onClick={() => setSubmitted(true)}>
          Submit Quiz
        </button>
      ) : (
        <div className="score-banner">
          You scored {getScore()} out of {questions.length}.
        </div>
      )}
    </div>
  );
}

export default NoteDetail;
