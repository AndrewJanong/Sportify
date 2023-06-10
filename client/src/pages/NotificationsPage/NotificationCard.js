import React from "react";
import styles from './NotificationCard.module.css';
import { useAuthContext } from "../../hooks/useAuthContext";

const NotificationCard = (props) => {

    const { user } = useAuthContext();

    const notification = props.notification;

    const handleAcceptFriend = async (e) => {
        e.preventDefault();

        const response = await fetch(process.env.REACT_APP_BASEURL+'/api/friends/accept', {
            method: 'PATCH',
            body: JSON.stringify({requester: user.username, recipient: notification.sender}),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const deleted = await fetch(process.env.REACT_APP_BASEURL+'/api/notifications/'+notification._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        const json = await response.json();
        const deleted_json = await deleted.json();
        console.log(json);
        console.log(deleted_json);
    }

    return (
        <div className={styles.card}>
            <div className={styles.message}>
                <p>{notification.message}</p>
            </div>
            <div className={styles.buttons}>
                {notification.type === 'friend-request' &&
                    <button onClick={handleAcceptFriend}>Accept</button>
                }
            </div>
        </div>
    )
}

export default NotificationCard;