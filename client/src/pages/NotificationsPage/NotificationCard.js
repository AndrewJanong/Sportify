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

        const notification_response = await fetch(process.env.REACT_APP_BASEURL+'/api/notifications/', {
            method: 'POST',
            body: JSON.stringify({
                type: "message",
                target_user: notification.sender,
                sender: user.username,
                message: `${user.username} has accepted your friend request!`
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json();
        const deleted_json = await deleted.json();
        const notification_response_json = await notification_response.json();
        
        console.log(json);
        console.log(deleted_json);
        console.log(notification_response_json);

        props.refreshPage();
    }

    const handleConfirmMessage = async (e) => {
        const deleted = await fetch(process.env.REACT_APP_BASEURL+'/api/notifications/'+notification._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        const deleted_json = await deleted.json();

        console.log(deleted_json);

        props.refreshPage();
    }

    return (
        <div className={styles.card}>
            <div className={styles.message}>
                <p>{notification.message}</p>
            </div>
            <div className={styles.buttons}>
                {notification.type === 'friend-request' &&
                    <button onClick={handleAcceptFriend} className={styles.acceptButton}>Accept</button>
                }
                {notification.type === 'message' &&
                    <button onClick={handleConfirmMessage} className={styles.confirmButton}>Got it</button>
                }
            </div>
        </div>
    )
}

export default NotificationCard;