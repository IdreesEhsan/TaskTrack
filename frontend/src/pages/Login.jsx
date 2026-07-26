import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error } = useAuth();
    const navigate = useNavigate() // lets us redirect after a successful login

    const handleSubmmit = async (e) => {
        e.preventDefault(); // stop the browser's default full-page form submit
        const ok = await login(email, password);
        if (ok) navigate('/tasks'); // only redirect if login actually succeeded
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmmit}>
                <h1 className="app-title">TaskTrack</h1>
                <h2>Log In</h2>
                {error && <p className="error">{error}</p>}
                <input
                    type = 'email'
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Log In'}
                </button>
                <p>
                    No account? <Link to="/register">Register</Link>
                </p>
            </form>
        </div>
    );
}