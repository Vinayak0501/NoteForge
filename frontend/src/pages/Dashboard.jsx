import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      const res = await axios.get('/notes');
      setNotes(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleCreateNote(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/notes', { title, content });
      setTitle('');
      setContent('');
      fetchNotes();
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.logo}>AI Study Buddy</h2>
        <div style={styles.navRight}>
          <span style={styles.welcome}>Hello, {user}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.main}>
        <div style={styles.formCard}>
          <h3 style={styles.sectionTitle}>Add a new note</h3>
          <form onSubmit={handleCreateNote}>
            <input
              style={styles.input}
              type="text"
              placeholder="Title (e.g. Operating Systems)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              style={styles.textarea}
              placeholder="Paste your notes here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={5}
            />
            <button style={styles.button} type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Note'}
            </button>
          </form>
        </div>

        <div>
          <h3 style={styles.sectionTitle}>Your notes</h3>
          {notes.length === 0 && (
            <p style={styles.empty}>No notes yet. Add one above!</p>
          )}
          <div style={styles.notesGrid}>
            {notes.map((note) => (
              <div
                key={note._id}
                style={styles.noteCard}
                onClick={() => navigate(`/note/${note._id}`)}
              >
                <h4 style={styles.noteTitle}>{note.title}</h4>
                <p style={styles.notePreview}>
                  {note.content.substring(0, 100)}...
                </p>
                <div style={styles.noteMeta}>
                  <span style={note.flashcards.length > 0 ? styles.badgeActive : styles.badge}>
                    {note.flashcards.length} flashcards
                  </span>
                  <span style={note.quiz.length > 0 ? styles.badgeActive : styles.badge}>
                    {note.quiz.length} quiz Qs
                  </span>
                  <span style={note.summary ? styles.badgeActive : styles.badge}>
                    {note.summary ? 'summarised' : 'no summary'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5' },
  navbar: { backgroundColor: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' },
  logo: { margin: 0, fontSize: '20px', color: '#6c63ff' },
  navRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  welcome: { fontSize: '14px', color: '#666' },
  logoutBtn: { padding: '6px 14px', backgroundColor: 'transparent', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
  main: { maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' },
  formCard: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  sectionTitle: { margin: '0 0 1rem', fontSize: '16px', color: '#333' },
  input: { width: '100%', padding: '10px 12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px 12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' },
  button: { padding: '10px 20px', backgroundColor: '#6c63ff', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' },
  empty: { color: '#999', fontSize: '14px' },
  notesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' },
  noteCard: { backgroundColor: 'white', padding: '1.25rem', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #eee' },
  noteTitle: { margin: '0 0 8px', fontSize: '15px', color: '#333' },
  notePreview: { margin: '0 0 12px', fontSize: '13px', color: '#888', lineHeight: '1.5' },
  noteMeta: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  badge: { fontSize: '11px', padding: '3px 8px', borderRadius: '20px', backgroundColor: '#f0f0f0', color: '#888' },
  badgeActive: { fontSize: '11px', padding: '3px 8px', borderRadius: '20px', backgroundColor: '#ede9fe', color: '#6c63ff' },
};

export default Dashboard;