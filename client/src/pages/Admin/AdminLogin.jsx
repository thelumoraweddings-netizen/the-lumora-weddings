import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, User } from 'lucide-react';
import './Admin.css';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (login(password)) {
            navigate('/admin');
        } else {
            setError('Invalid password');
        }
    };

    return (
        <div className="admin-login-page">
            <div className="login-card glass">
                <div className="login-header">
                    <h1>Admin Portal</h1>
                    <p>Secure login for website management</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-with-icon">
                            <Lock size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter admin password"
                                required
                            />
                        </div>
                    </div>
                    {error && <p className="error-text">{error}</p>}
                    <button type="submit" className="btn btn-primary login-btn">Login</button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
