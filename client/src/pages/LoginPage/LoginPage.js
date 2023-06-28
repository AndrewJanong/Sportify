import React, { useState } from "react";
import styles from './LoginPage.module.css';
import Success from "../../popups/Success";
import { Link } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";
import Logo from '../../icons/Logo.png'

const LoginPage = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {login, error, isLoading} = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const err = await login(email, password);
        if (err !== 'error') {
            Success.fire({
                icon: 'success',
                title: 'Logged in'
            }
        )}
    }

    return (
        <div className={styles.login}>
            <div className={styles.container}>
                <img src={Logo} alt=""/>
                <h2>Sign In</h2>
                <form className={styles.loginform} onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                    <a href="https://getcssscan.com/css-box-shadow-examples">Forgot Password?</a>
                    <button disabled={isLoading} id={styles.loginButton}>Log In</button>
                    {error && <div className={styles.error}>{error}</div>}
                </form>
                <div className={styles.signup}>
                    <p style={{marginRight: '8px'}}>
                        Don't have an account?
                    </p>
                    <Link to="/signup" style={{ textDecoration: 'none', color: '#3b62be' }}>
                        <p>Sign Up</p>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;