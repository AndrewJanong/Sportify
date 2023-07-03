import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useSignup = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();

    const signup = async (username, email, password) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch(process.env.REACT_APP_BASEURL+'/api/user/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, email, password})
        })

        const json = await response.json();

        if (!response.ok) {
            setIsLoading(false);
            setError(json.error);
            return 'error';
        } else {
            localStorage.setItem('user', JSON.stringify(json));

            const verification = await fetch(process.env.REACT_APP_BASEURL+'/api/user/send-verification', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, email})
            })
    
            const verification_json = await verification.json();
            console.log(verification_json);

            // update the auth context
            dispatch({type: 'LOGIN', payload: json});

            setIsLoading(false);
            return '';
        }
    }

    return { signup, isLoading, error };
}