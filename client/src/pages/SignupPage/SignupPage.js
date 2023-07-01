import React, { useState } from "react";
import styles from './SignupPage.module.css';
import Success from "../../popups/Success";
import { Link } from "react-router-dom";
import { useSignup } from '../../hooks/useSignup';
import { useAuthContext } from "../../hooks/useAuthContext";
import Logo from '../../icons/Logo.png'

const VerificationPage = (props) => {
    const [otp, setOtp] = useState({
        otp1: '',
        otp2: '',
        otp3: '',
        otp4: ''
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { dispatch } = useAuthContext();
    
    const inputfocus = (elmnt) => {
        if (elmnt.key === "Delete" || elmnt.key === "Backspace") {
            const next = elmnt.target.tabIndex - 2;
            if (next > -1) {
                elmnt.target.form.elements[next].focus()
            }
        }
        else {
            console.log("next");
            const next = elmnt.target.tabIndex;
            if (next < 4) {
                elmnt.target.form.elements[next].focus()
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const inputOTP = otp.otp1 + otp.otp2 + otp.otp3 + otp.otp4;
        console.log(inputOTP);

        const userVerified = await fetch(process.env.REACT_APP_BASEURL+'/api/user/verify', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: props.username, otp: inputOTP})
        })

        const json = await userVerified.json();
        console.log(json);

        if (!userVerified.ok) {
            setIsLoading(false);
            setError(json.error);
        } else {
            setError('');
            dispatch({type: 'EDIT', payload: {verified: true}});
            setIsLoading(false);
            Success.fire({
                icon: 'success',
                title: 'Signed up'
            })
            console.log('verified!!');
        }
    }
    
    return (
        <div className={styles.verificationPage}>
            <h2>Enter OTP</h2>
            <p style={{marginBottom: '12px'}}>We have sent an OTP to your email</p>
            <form action="" onSubmit={handleSubmit}>
                <div className={styles.otpContainer}>
                    <input
                        name="otp1"
                        type="text"
                        autoComplete="off"
                        className={styles.inputOTP}
                        value={otp.otp1}
                        onChange={e => setOtp((prev) => {
                            return {...prev, otp1: e.target.value};
                        })}
                        tabIndex="1" maxLength="1" onKeyUp={e => inputfocus(e)}
                    />
                    <input
                        name="otp2"
                        type="text"
                        autoComplete="off"
                        className={styles.inputOTP}
                        value={otp.otp2}
                        onChange={e => setOtp((prev) => {
                            return {...prev, otp2: e.target.value};
                        })}
                        tabIndex="2" maxLength="1" onKeyUp={e => inputfocus(e)}
                    />
                    <input
                        name="otp3"
                        type="text"
                        autoComplete="off"
                        className={styles.inputOTP}
                        value={otp.otp3}
                        onChange={e => setOtp((prev) => {
                            return {...prev, otp3: e.target.value};
                        })}
                        tabIndex="3" maxLength="1" onKeyUp={e => inputfocus(e)}
                    />
                    <input
                        name="otp4"
                        type="text"
                        autoComplete="off"
                        className={styles.inputOTP}
                        value={otp.otp4}
                        onChange={e => setOtp((prev) => {
                            return {...prev, otp4: e.target.value};
                        })}
                        tabIndex="4" maxLength="1" onKeyUp={e => inputfocus(e)}
                    />
                </div>
                <button className={styles.verifyButton} disabled={isLoading}>Verify</button>
            </form>
            {error && <p className={styles.OTPerror}>{error}</p>}
        </div>
    )
}

const SignupPage = (props) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verifying, setVerifying] = useState(false);
    const { signup, error, isLoading } = useSignup();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const err = await signup(username, email, password);
        if (err !== 'error') {
            setVerifying(true);
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
            {verifying && <VerificationPage email={email} username={username}/>}
            {!verifying &&
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
            </div>}
        </div>
    )
}

export default SignupPage;