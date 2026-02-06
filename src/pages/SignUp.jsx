import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import '../styles/auth.css';

const SignUp = () => {
    const [formData, setFormData] = useState({
        id: '',
        password: '',
        confirmPassword: '',
        name: ''
    });
    const [error, setError] = useState('');
    const { signUp } = useAppContext();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            signUp({ id: formData.id, password: formData.password, name: formData.name });
            alert("Registration successful! Please login.");
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container flex-center">
            <div className="auth-card">
                <h2>Join Theater Club</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text" name="name" required
                            value={formData.name} onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Username (ID)</label>
                        <input
                            type="text" name="id" required
                            value={formData.id} onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password" name="password" required
                            value={formData.password} onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password" name="confirmPassword" required
                            value={formData.confirmPassword} onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="primary-btn full-width">Sign Up</button>
                </form>
                <p className="auth-link">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
