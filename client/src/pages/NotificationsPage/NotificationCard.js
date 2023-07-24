import React from "react";
import styles from './NotificationCard.module.css';
import { useAuthContext } from "../../hooks/useAuthContext";
import ProfilePicture from "../../components/ProfilePicture/ProfilePicture";

const NotificationCard = (props) => {

    const { user } = useAuthContext();
    const notification = props.notification;

    // Accepting a friend request
    const handleAcceptFriend = async (e) => {
        e.preventDefault();
        if (notification.test) {
            if (props.testCallback) props.testCallback();
            return;
        }

        await fetch(process.env.REACT_APP_BASEURL+'/api/friends/accept', {
            method: 'PATCH',
            body: JSON.stringify({requester: user.userId, recipient: notification.sender._id}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })

        await fetch(process.env.REACT_APP_BASEURL+'/api/user-notifications/'+notification._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        await fetch(process.env.REACT_APP_BASEURL+'/api/user-notifications/', {
            method: 'POST',
            body: JSON.stringify({
                type: 'message',
                target_user: notification.sender._id,
                sender: user.userId,
                message: `${user.username} has accepted your friend request!`
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })

        props.refreshPage();
    }

    // Rejecting a friend request
    const handleRejectFriend = async (e) => {
        e.preventDefault();
        if (notification.test) {
            if (props.testCallback) props.testCallback();
            return;
        }

        await fetch(process.env.REACT_APP_BASEURL+'/api/friends/reject', {
            method: 'PATCH',
            body: JSON.stringify({requester: user.userId, recipient: notification.sender._id}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })

        await fetch(process.env.REACT_APP_BASEURL+'/api/user-notifications/'+notification._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        await fetch(process.env.REACT_APP_BASEURL+'/api/user-notifications/', {
            method: 'POST',
            body: JSON.stringify({
                type: 'message',
                target_user: notification.sender._id,
                sender: user.userId,
                message: `${user.username} has rejected your friend request!`
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })

        props.refreshPage();
    }


    // Accepting a Group request
    const handleAcceptGroup = async (e) => {
        if (notification.test) {
            if (props.testCallback) props.testCallback();
            return;
        }

        await fetch(process.env.REACT_APP_BASEURL+'/api/group-notifications/'+notification._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        await fetch(process.env.REACT_APP_BASEURL+'/api/groups/add_member/'+notification.sender._id, {
            method: 'PATCH',
            body: JSON.stringify({
                member: notification.target_user._id
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        await fetch(process.env.REACT_APP_BASEURL+'/api/group-requests/'+notification.sender._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        props.refreshPage();
    }


    // Rejecting a Group request
    const handleRejectGroup = async (e) => {
        if (notification.test) {
            if (props.testCallback) props.testCallback();
            return;
        }
        
        await fetch(process.env.REACT_APP_BASEURL+'/api/group-notifications/'+notification._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        await fetch(process.env.REACT_APP_BASEURL+'/api/group-requests/'+notification.sender._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        props.refreshPage();
    }

    // Confirming a message
    const handleConfirmMessage = async (e) => {
        await fetch(process.env.REACT_APP_BASEURL+'/api/user-notifications/'+notification._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        props.refreshPage();
    }

    return (
        <div className={styles.card}>
            <div className={styles.senderPicture}>
                {(notification.type === 'friend-request' || notification.type === 'message') && 
                    <ProfilePicture 
                        picture={notification.sender.picture} 
                        size={4} 
                        type={'user'}
                        user={notification.sender._id}
                    />
                }
                {(notification.type === 'group-request') && 
                    <ProfilePicture 
                        picture={notification.sender.picture} 
                        size={4}
                        type={'group'}
                        group={notification.sender._id}
                    />
                }       

            </div>
            <div className={styles.message}>
                <p>{notification.message}</p>
            </div>
            <div className={styles.buttons}>
                {notification.type === 'friend-request' &&
                    <button onClick={handleAcceptFriend} className={styles.acceptButton}>Accept</button>
                }
                {notification.type === 'friend-request' &&
                    <button onClick={handleRejectFriend} className={styles.rejectButton}>Reject</button>
                }
                {notification.type === 'group-request' &&
                    <button onClick={handleAcceptGroup} className={styles.acceptButton}>Accept</button>
                }
                {notification.type === 'group-request' &&
                    <button onClick={handleRejectGroup} className={styles.rejectButton}>Reject</button>
                }
                {notification.type === 'message' &&
                    <button onClick={handleConfirmMessage} className={styles.confirmButton}>Got it</button>
                }
            </div>
        </div>
    )
}

export default NotificationCard;