import React, { useState, useEffect } from "react";
import styles from './SearchPage.module.css';
import { useAuthContext } from "../../hooks/useAuthContext";
import { Image } from "cloudinary-react";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

const SearchPage = (props) => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch(process.env.REACT_APP_BASEURL+'/api/user/', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();
            
            if (json.length > 0 && json[0].test) {
                setUsers(json.filter((user) => user.username.includes(input)));
                setIsLoading(false);
            }

            if (response.ok) {
                setUsers(json.filter((user) => user.username.includes(input)));
                setIsLoading(false);
            }
        }

        if (user) {
            fetchUsers();
        }
    }, [user, input])

    console.log(users);

    return (
        <div className={styles.page}>
            <input 
                id={styles.userInput} 
                type="text"
                placeholder="Search" 
                onChange={(e) => {
                    setIsLoading(true);
                    setInput(e.target.value);
                }}
            />
            {!isLoading && input !== '' && users.length !== 0 &&
            <div className={styles.users}>
                {users.map((user) => {
                    return (
                        <div key={user.username} className={styles.user} onClick={(e) => navigate("/profile/"+user.username)}>
                            <Image
                                cloudName={`${process.env.REACT_APP_IMAGECLOUD}`}
                                publicId={`${user.picture || "Member_qx5vfp"}`}>
                            </Image>
                            <p>{user.username}</p>
                        </div>
                    )
                })}
            </div>}
            {!isLoading && input !== '' && users.length === 0 &&
            <div className={styles.notFound}>
                <p>No users found</p>
            </div>}
            {isLoading && 
                <div className={styles.loading}>
                    <ClipLoader
                        color={'#fff'}
                        loading={isLoading}
                        size={64}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </div>
            }
        </div>
    )
}

export default SearchPage;