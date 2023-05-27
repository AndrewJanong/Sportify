import React, { useState } from "react";
import styles from './LoginPage.module.css';
import Success from "../../popups/Success";
import { Link } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";

const LoginPage = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {login, error, isLoading} = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        await login(email, password);
        Success.fire({
            icon: 'success',
            title: 'Logged in'
        })
    }

    return (
        <div className={styles.login}>
            <div className={styles.container}>
                <h2>Sign In</h2>
                <form className={styles.loginform} onSubmit={handleSubmit}>
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
                    <button disabled={isLoading}>Log In</button>
                    {error && <div className={styles.error}>{error}</div>}
                </form>
                <p>Don't Have an account?</p>
                <Link to="/signup" style={{ textDecoration: 'none' }}>
                    <button type='button'>
                        Sign Up
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default LoginPage;