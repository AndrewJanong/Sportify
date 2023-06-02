import React, { useEffect, useState } from "react";
import styles from './ProfilePage.module.css';
import Member from '../../icons/Member.png';
import { useParams } from "react-router-dom";
import { useLogout } from '../../hooks/useLogout';
import { useAuthContext } from "../../hooks/useAuthContext";


const ProfilePage = (props) => {
    const params = useParams();
    const { logout } = useLogout();
    const { user } = useAuthContext();
    const [status, setStatus] = useState(0);

    const userA = user.username;
    const userB = params.username;

    useEffect(() => {
        const getFriendshipStatus = async () => {
            const response = await fetch(process.env.REACT_APP_BASEURL+'/api/friends/');
            const json = await response.json();
            
            if (response.ok) {
                const friendship = json.filter(x => (x.requester === userA && x.recipient === userB));
                
                if (friendship.length > 0) {
                    const status = friendship[0].status;
                    setStatus(status);
                }
            }
        }

        if (user) {
            getFriendshipStatus();
        }
    }, [user, userA, userB])

    const handleAddFriend = async (e) => {
        e.preventDefault();

        const response = await fetch(process.env.REACT_APP_BASEURL+'/api/friends/request', {
            method: 'POST',
            body: JSON.stringify({requester: userA, recipient: userB}),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json();
        console.log(json);
        setStatus(json.status);
    }

    const handleAcceptFriend = async (e) => {
        e.preventDefault();

        const response = await fetch(process.env.REACT_APP_BASEURL+'/api/friends/accept', {
            method: 'PATCH',
            body: JSON.stringify({requester: userA, recipient: userB}),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json();
        console.log(json);
        setStatus(3);
    }

    const handleRemoveFriend = async (e) => {
        e.preventDefault();

        const response = await fetch(process.env.REACT_APP_BASEURL+'/api/friends/remove', {
            method: 'PATCH',
            body: JSON.stringify({requester: userA, recipient: userB}),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json();
        console.log(json);
        setStatus(0);
    }

    const handleLogout = () => {
        logout();
    }

    return (
        <div className={styles.profilePage}>
            <div className={styles.container}>
                <div className={styles.profilePicture}>
                    <img src={Member} alt="" />
                </div>
                <div>
                    <div className={styles.username}>
                        <p>{params.username}</p>
                        { user.username === params.username &&
                            <button className={styles.edit}>Edit</button>
                        }
                        { user.username === params.username &&
                            <button className={styles.logout} onClick={handleLogout}>Log Out</button>
                        }
                    </div>
                    <div className={styles.friendship}>
                        { status === 0 && userA !== userB &&
                            <button className={styles.addFriend} onClick={handleAddFriend}>Add Friend</button>
                        }
                        { status === 1 && userA !== userB &&
                            <button className={styles.requestedFriend}>Requested</button>
                        }
                        { status === 2 && userA !== userB &&
                            <button className={styles.pendingFriend} onClick={handleAcceptFriend}>Accept Request</button>
                        }
                        { status === 3 && userA !== userB &&
                            <button className={styles.removeFriend} onClick={handleRemoveFriend}>Remove Friend</button>
                        }
                    </div>
                </div>
            </div>
            <div>

            </div>
        </div>
    )
}

export default ProfilePage;