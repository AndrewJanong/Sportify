import React, { useState } from "react";
import styles from './SignupPage.module.css';
import Success from "../../popups/Success";
import { Link } from "react-router-dom";
import { useSignup } from '../../hooks/useSignup';

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
        <div className={styles.login}>
            <div className={styles.container}>
                <h2>Sign Up</h2>
                <form className={styles.signupform} onSubmit={handleSubmit}>
                    <label htmlFor="">Username:</label>
                    <input
                        type="text"
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        style={  checkUsername() !== "" ? {
                            border: '1px solid red'
                        } : {}}
                    />
                    <p className={styles.invalid}>{checkUsername(username)}</p>
                    <label htmlFor="">Email:</label>
                    <input
                        type="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        style={  checkEmail() !== "" ? {
                            border: '1px solid #ff8164',
                            color: '#ff8164'
                        } : {}}
                    />
                    <p className={styles.invalid}>{checkEmail(email)}</p>
                    <label htmlFor="">Password:</label>
                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        style={  checkPassword() !== "" ? {
                            border: '1px solid red'
                        } : {}}
                    />
                    <p className={styles.invalid}>{checkPassword(password)}</p>
                    <button disabled={disableButton() || isLoading} className={styles.signupButton}>Sign Up</button>
                    {error && <div className={styles.error}>{error}</div>}
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