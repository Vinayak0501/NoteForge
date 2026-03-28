import { useState, useEffect, act } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios  from "../api/axios";

function NoteDetail(){

    const { id } = useParams();
    const navigate = useNavigate();
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState('');
    const [activeTab, setActiveTab] = useState('summary');

    useEffect(() => {
        fetchNote();
    }, []);

    
    async function fetchNote(){

        try{
            
            const res = await axios.get(`/notes/${id}`);
            setNote(res.data);

        }

        catch(err){
            console.log(err);
        }

    }


    async function handleGenerate(type){

        setLoading(type);

        try{

            const res = await axios.post(`/generate/${type}/${id}`);
            setNote((prev) => ({ ...prev, ...res.data}));

            setActiveTab(type === 'flashcards' ? 'flashcards' : type === 'quiz' ? 'quiz' : 'summary');

        }

        catch(err){
            console.log(err);
        }

        setLoading('');
    }


    if(!note){
        return <p style={{padding: '2rem'}}>Loading...</p>
    }

    return(

        <div style={styles.container}>
            <div style={styles.navbar}>

                <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
                    Back
                </button>

                <h2 style={styles.logo}>AI Study Buddy</h2>
            </div>

            <div style={styles.main}>

                <h2 style={styles.noteTitle}>{note.title}</h2>

                <div style={styles.contentBox}>
                    <p style={styles.contentText}>{note.content}</p>
                </div>

                <div style={styles.aiButtons}>

                    <button style={styles.aiBtn} onClick={() => handleGenerate('summary')} disabled={loading === 'summary'}>
                        {loading === 'summary' ? 'Generating...' : 'Generate Summary'}
                    </button>

                    <button style={styles.aiBtn} onClick={() => handleGenerate('flashcards')} disabled={loading === 'flashcards'}>
                        {loading === 'flashcards' ? 'Generating...' : 'Generate Flashcards'}
                    </button>

                    <button style={styles.aiBtn} onClick={() => handleGenerate('quiz')} disabled={loading === 'quiz'}>
                        {loading === 'quiz' ? 'Generating...' : 'Generate Quiz'}
                    </button>
                </div>

                <div style={styles.tabs}>
                    {['summary', 'flashcards', 'quiz'].map((tab) => (
                        
                        <button key={tab} 
                        style={activeTab === tab ? styles.tabActive : styles.tab}
                        onClick={() => setActiveTab(tab)}>

                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {activeTab === 'summary' && (
                    
                    <div style={styles.resultBox}>
                        {note.summary ? (
                            <p style={styles.summaryText}>{note.summary}</p>
                        ) : (
                            <p style={styles.empty}>No summary yet. Click "Generate Summary" above</p>
                        )}
                    </div>
                )}


                {activeTab === 'flashcards' && (

                    <div>
                        {note.flashcards.length === 0 ? (
                            <p style={styles.empty}>No flashcards yet. Click "Generate Flashcards" above.</p>
                        ) : (
                            <div style={styles.flashcardsGrid}>
                                {note.flashcards.map((card,i) => (
                                    <FlipCard key = {i} front = {card.front} back={card.back}/>
                                ))}
                            </div>
                        )}
                    </div>
                )}


                {activeTab === 'quiz' && (
                    <div>
                        {note.quiz.length === 0 ? (
                            <p style={styles.empty}>No quiz yet. Click "Generate Quiz" above.</p>
                        ) : (
                            <QuizSection questions ={note.quiz}/>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function FlipCard({front, back}){

    const [flipped, setFlipped] = useState(false);

    return(
        <div style={styles.flipContainer} onClick={() => setFlipped(!flipped)}>
            <div style={{...styles.flipCard, transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'}}>

                <div style={styles.flipFront}>
                    <p style={styles.flipText}>{front}</p>
                    <span style={styles.flipHint}>Click to reveal</span>
                </div>

                <div style={styles.flipBack}>
                    <p style={styles.flipText}>{back}</p>
                </div>
            </div>
        </div>
    )
}


function QuizSection({ questions }){

    const [answers, setAnswers] = useState({});
    const[submitted, setSubmitted] = useState(false);

    function handleSelect(qIndex, option){

        if(submitted) return;
        setAnswers((prev) => ({ ...prev, [qIndex]: option}));

    }

    function getScore(){
        return questions.filter((q,i) => answers[i] === q.answer).length;
    }

    return(

        <div>
            {questions.map((q,i) => (
                <div key={i} style={styles.quizCard}>
                    <p style={styles.question}>
                        {i+1}. {q.question}
                    </p>

                    <div>
                        {q.options.map((opt, j) => {

                            let bg = 'white';

                            if(submitted){
                                if(opt === q.answer) bg = '#d1fae5';
                                else if (opt === answers[i] && answers[i] !== q.answer) bg = '#fee2e3'
                            }
                            else if(answers[i] === opt){
                                bg = '#ede9fe';
                            }

                            return(
                                <div
                                key={j}
                                style={{ ...styles.option, backgroundColor: bg}}
                                onClick={() => handleSelect(i, opt)}>
                                    {opt}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}

            {!submitted ? (

                <button style={styles.aiBtn} onClick={() => setSubmitted(true)}>Submit Quiz</button>
            ) : (
                <div style={styles.scoreBox}>
                    You scored {getScore()} out of {questions.length}
                </div>
            )}
        </div>
    );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5' },
  navbar: { backgroundColor: 'white', padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' },
  backBtn: { padding: '6px 14px', backgroundColor: 'transparent', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
  logo: { margin: 0, fontSize: '18px', color: '#6c63ff' },
  main: { maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' },
  noteTitle: { fontSize: '22px', margin: '0 0 1rem', color: '#333' },
  contentBox: { backgroundColor: 'white', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  contentText: { margin: 0, fontSize: '14px', color: '#555', lineHeight: '1.7' },
  aiButtons: { display: 'flex', gap: '12px', marginBottom: '1.5rem', flexWrap: 'wrap' },
  aiBtn: { padding: '10px 18px', backgroundColor: '#6c63ff', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '1rem' },
  tab: { padding: '8px 18px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
  tabActive: { padding: '8px 18px', backgroundColor: '#6c63ff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
  resultBox: { backgroundColor: 'white', padding: '1.25rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  summaryText: { margin: 0, fontSize: '14px', color: '#444', lineHeight: '2' },
  empty: { color: '#999', fontSize: '14px' },
  flashcardsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' },
  flipContainer: { perspective: '1000px', height: '160px', cursor: 'pointer' },
  flipCard: { width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d', transition: 'transform 0.5s' },
  flipFront: { position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', backgroundColor: 'white', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', boxSizing: 'border-box', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  flipBack: { position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', backgroundColor: '#6c63ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', boxSizing: 'border-box', transform: 'rotateY(180deg)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  flipText: { margin: 0, fontSize: '13px', textAlign: 'center', color: 'inherit' },
  flipHint: { fontSize: '11px', color: '#aaa', marginTop: '8px' },
  quizCard: { backgroundColor: 'white', padding: '1.25rem', borderRadius: '12px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  question: { margin: '0 0 12px', fontSize: '14px', fontWeight: '500', color: '#333' },
  option: { padding: '10px 14px', borderRadius: '8px', marginBottom: '8px', fontSize: '13px', cursor: 'pointer', border: '1px solid #eee', transition: 'background 0.2s' },
  scoreBox: { backgroundColor: '#ede9fe', padding: '1rem', borderRadius: '12px', textAlign: 'center', fontSize: '16px', fontWeight: '500', color: '#6c63ff' },
};

export default NoteDetail;