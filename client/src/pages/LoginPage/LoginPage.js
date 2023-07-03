import React, { useState } from "react";
import styles from './LoginPage.module.css';
import Success from "../../popups/Success";
import { Link } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";
import Logo from '../../icons/Logo.png'

const ResetPassword = (props) => {

    const [email, setEmail] = useState('')
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const sendResetPasswordLink = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        setSent(false);

        const user = await fetch(process.env.REACT_APP_BASEURL+'/api/user/send-reset', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email})
        });

        const user_json = await user.json();
        
        if (!user.ok) {
            setError(user_json.error);
            setIsLoading(false);
            setSent(false);
        } else {
            setError('');
            setIsLoading(false);
            setSent(true);
        }
    }
    
    return (
        <div className={styles.resetPassword}>
            <h2>Enter Email</h2>
            <form action="" className={styles.resetPasswordForm} onSubmit={sendResetPasswordLink}>
                <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <button disabled={isLoading || !email}>Submit</button>
            </form>
            {error && <p className={styles.resetError}>{error}</p>}
            {sent && <p className={styles.resetSuccess}>Link sent</p>}
        </div>
    )
}

const LoginPage = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {login, error, isLoading} = useLogin();
    const [isChangingPassword, setIsChangingPassword] = useState(false);

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
            { isChangingPassword && <ResetPassword />}
            { !isChangingPassword && 
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
                    <p onClick={(e) => setIsChangingPassword(true)}>Forgot Password?</p>
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
            </div>}
        </div>
    )
}

export default LoginPage;