import React, { useState } from "react";
import styles from './SignupPage.module.css';
import { Link } from "react-router-dom";
import { useSignup } from '../../hooks/useSignup';

const SignupPage = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signup, error, isLoading } = useSignup();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        await signup(email, password);
    }

    return (
        <div className={styles.login}>
            <div className={styles.container}>
                <form className={styles.signupform} onSubmit={handleSubmit}>
                    <label htmlFor="">Email:</label>
                    <input
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                    <label htmlFor="">Password:</label>
                    <input
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                    <button disabled={isLoading}>Sign Up</button>
                    {error && <div className="error">{error}</div>}
                </form>
                <p>Already Have an account?</p>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                    <button type='button'>
                        Log In
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default SignupPage;