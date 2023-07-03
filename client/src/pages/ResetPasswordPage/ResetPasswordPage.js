import React, { useState } from "react";
import styles from './ResetPasswordPage.module.css';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Success from "../../popups/Success";

const ResetPasswordPage = (props) => {

    const [password, setPassword] = useState('')
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [changed, setChanged] = useState(false);
    const params = useParams();
    const navigate = useNavigate();
    const id = params.id;
    const token = params.token;

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

    const changePassword = async (e) => {
        e.preventDefault();
        setError('');
        setChanged(false);
        setIsLoading(true);

        const user = await fetch(process.env.REACT_APP_BASEURL+'/api/user/reset-password/' + id + '/' + token, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({password})
        });

        const user_json = await user.json();
        
        if (!user.ok) {
            setError(user_json.error);
            setChanged(false);
            setIsLoading(false);
        } else {
            setError('');
            setChanged(true);
            setIsLoading(false);
            Success.fire({
                icon: 'success',
                title: 'Password changed!'
            })
            navigate("/login");
        }
    }
    
    return (
        <div className={styles.page}>
            <div className={styles.resetPassword}>
                <h2>Enter New Password</h2>
                <form action="" className={styles.resetPasswordForm} onSubmit={changePassword}>
                    <input 
                        type="password" 
                        placeholder="New Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        className={checkPassword() !== '' ? styles.invalidInput : styles.input}
                    />
                    <p className={styles.invalid} style={{display: checkPassword() ? 'block' : 'none'}}>{checkPassword()}</p>
                    <button disabled={isLoading || password.length === 0 || checkPassword()}>Change Password</button>
                </form>
                {error && <p className={styles.resetError}>{error}</p>}
                {changed && <p className={styles.resetSuccess}>Link sent</p>}
            </div>
        </div>
    )
}

export default ResetPasswordPage;