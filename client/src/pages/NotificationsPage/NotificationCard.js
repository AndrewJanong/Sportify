import React, { useState, useEffect } from "react";
import styles from './NotificationCard.module.css';
import { useAuthContext } from "../../hooks/useAuthContext";
import ProfilePicture from "../../components/ProfilePicture/ProfilePicture";

const NotificationCard = (props) => {

    const { user } = useAuthContext();
    const [senderInfo, setSenderInfo] = useState({});

    useEffect(() => {
        const getGroupInfo = async () => {
            const response = await fetch(process.env.REACT_APP_BASEURL+'/api/groups/'+props.notification.sender, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                setSenderInfo(json);
            }
        }

        const getUserInfo = async () => {
            const response = await fetch(process.env.REACT_APP_BASEURL+'/api/user/'+props.notification.sender, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                setSenderInfo(json);
            }
        }

        if (user ) {
            if (props.notification.type === 'group-request') getGroupInfo();
            if (props.notification.type === 'friend-request') getUserInfo();
        }
    }, [user, props.notification.sender, props.notification.type])

    const notification = props.notification;

    // Accepting a friend request
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

    // Rejecting a friend request
    const handleRejectFriend = async (e) => {
        e.preventDefault();

        const response = await fetch(process.env.REACT_APP_BASEURL+'/api/friends/reject', {
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
                message: `${user.username} has rejected your friend request!`
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


    // Accepting a Group request
    const handleAcceptGroup = async (e) => {
        const deleted = await fetch(process.env.REACT_APP_BASEURL+'/api/notifications/'+notification._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        const group = await fetch(process.env.REACT_APP_BASEURL+'/api/groups/add_member/'+notification.sender, {
            method: 'PATCH',
            body: JSON.stringify({
                member: notification.target_user
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const request = await fetch(process.env.REACT_APP_BASEURL+'/api/group-requests/'+notification.sender, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        const deleted_json = await deleted.json();
        const group_json = group.json();
        const request_json = request.json();
        
        console.log(deleted_json);
        console.log(group_json);
        console.log(request_json);

        props.refreshPage();
    }


    // Rejecting a Group request
    const handleRejectGroup = async (e) => {
        const deleted = await fetch(process.env.REACT_APP_BASEURL+'/api/notifications/'+notification._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        const group = await fetch(process.env.REACT_APP_BASEURL+'/api/groups/remove_member/'+notification.sender, {
            method: 'PATCH',
            body: JSON.stringify({
                member: notification.target_user
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const request = await fetch(process.env.REACT_APP_BASEURL+'/api/group-requests/'+notification.sender, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        const deleted_json = await deleted.json();
        const group_json = group.json();
        const request_json = request.json();
        
        console.log(deleted_json);
        console.log(group_json);
        console.log(request_json);

        props.refreshPage();
    }



    // Confirming a message
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
            <div className={styles.senderPicture}>
                {(notification.type === 'friend-request' || notification.type === 'message') && 
                    <ProfilePicture 
                        picture={senderInfo.picture} 
                        size={72} 
                        type={'user'}
                        user={notification.sender}
                    />
                }
                {(notification.type === 'group-request') && 
                    <ProfilePicture 
                        picture={senderInfo.picture} 
                        size={72}
                        type={'group'}
                        group={notification.sender}
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