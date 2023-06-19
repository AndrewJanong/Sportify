import React, { useState, useEffect } from "react";
import styles from './SearchPage.module.css';
import { useAuthContext } from "../../hooks/useAuthContext";

const SearchPage = (props) => {
    const { user } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        setIsLoading(true);

        const fetchUsers = async () => {
            const response = await fetch(process.env.REACT_APP_BASEURL+'/api/user/', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                setUsers(json.filter((user) => user.username.includes(input)));
            }
        }

        if (user) {
            fetchUsers();
            setIsLoading(false);
        }
    }, [user, input])

    return (
        <div className={styles.page}>
            <input type="text" onChange={(e) => setInput(e.target.value)}/>
            {!isLoading && users.map((user) => {
                return <div key={user.username}>{user.username}</div>
            })}
            {isLoading && 
                <div>LOADING</div>
            }
        </div>
    )
}

export default SearchPage;