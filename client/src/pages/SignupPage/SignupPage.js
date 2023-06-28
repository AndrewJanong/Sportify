import React, { useState } from "react";
import styles from './SignupPage.module.css';
import Success from "../../popups/Success";
import { Link } from "react-router-dom";
import { useSignup } from '../../hooks/useSignup';
import Logo from '../../icons/Logo.png'

const SignupPage = (props) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signup, error, isLoading } = useSignup();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const err = await signup(username, email, password);
        if (err !== 'error') {
            Success.fire({
                icon: 'success',
                title: 'Signed up'
            })
        }
    }

    const checkUsername = () => {
        if (username.length === 0) return "";
        if (username.length > 16) {
            return "username can only be up to 16 characters";
        } else if (!username.match(/^[0-9a-zA-Z]+$/)) {
            return "username must be alphanumeric";
        } else {
            return "";
        }
    }

    const checkEmail = () => {
        if (email.length === 0) return "";
        if (!email
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )) {
            return "please enter a valid email";
        } else {
            return "";
        }
    }

    const checkPassword = () => {
        if (password.length === 0) return "";
        if (password.length < 8) {
            return "password must be at least 8 characters";
        } else if (password === password.toLowerCase()) {
            return "password must contain at least 1 uppercase";
        } else if (password === password.toUpperCase()) {
            return "password must contain at least 1 lowercase";
        } else if (!/\d/.test(password)) {
            return "password must contain a number";
        } else if (!/[ `!@#$%^&*()_+\-=\]{};':"\\|,.<>?~]/.test(password)) {
            return "password must contain a special character";
        } else {
            return "";
        }
    }

    const disableButton = () => {
        if (!username || !email || !password) {
            return true;
        }

        if (checkUsername() || checkEmail() || checkPassword()) return true;

        return false;
    }

    return (
        <div className={styles.signup}>
            <div className={styles.container}>
                <img src={Logo} alt=""/>
                <h2>Sign Up</h2>
                <form className={styles.signupform} onSubmit={handleSubmit}>

                    <input
                        type="text"
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        className={checkUsername() !== '' ? styles.invalidInput : styles.input}
                    />
                    <p className={styles.invalid}>{checkUsername()}</p>

                    <input
                        type="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className={checkEmail() !== '' ? styles.invalidInput : styles.input}
                    />
                    <p className={styles.invalid}>{checkEmail()}</p>

                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className={checkPassword() !== '' ? styles.invalidInput : styles.input}
                    />
                    <p className={styles.invalid}>{checkPassword()}</p>
                    <button disabled={disableButton() || isLoading} id={styles.signupButton}>Sign Up</button>
                    {error && <div className={styles.error}>{error}</div>}
                </form>

                <div className={styles.login}>
                    <p style={{marginRight: '8px'}}>
                        Already have an account?
                    </p>
                    <Link to="/login" style={{ textDecoration: 'none', color: '#3b62be' }}>
                        <p>Log In</p>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SignupPage;