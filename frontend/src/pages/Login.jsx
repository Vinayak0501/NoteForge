import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from '../api/axios';


function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const Navigate = useNavigate();

    async function handleSubmit(e) {

        e.preventDefault();
        setLoading(true);
        setError('');

        try {

            const res = await API.post('/auth/login', { email, password });
            login(res.data.token, res.data.name);
            Navigate('/dashboard');

        }

        catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }

        finally {
            setLoading(false);
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>

                <h2 style={styles.title}>AI Study Buddy</h2>
                <p style={styles.subtitle}>Login to your account</p>

                {error && <p style={styles.error}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <input style={styles.input}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input style={styles.input}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button style={styles.button} type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                </form>

                <p style={styles.link}>
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' },
    card: { background: '#fff', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' },
    title: { margin: '0 0 4px', fontSize: '24px', fontWeight: '600' },
    subtitle: { margin: '0 0 24px', color: '#666', fontSize: '14px' },
    input: { width: '100%', padding: '10px 12px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' },
    button: { width: '100%', padding: '10px', backgroundColor: '#5c6bc0', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer' },
    error: { color: 'red', fontSize: '13px', marginBottom: '12px' },
    link: { textAlign: 'center', marginTop: '16px', fontSize: '13px' }
};

export default Login;