import React, { useEffect, useState } from "react";
import styles from './NotificationIcon.module.css';
import { useAuthContext } from "../../hooks/useAuthContext";



const NotificationIcon = (props) => {
    const { user } = useAuthContext();
    const [userNotifications, setUserNotifications] = useState([]);
    const [groupNotifications, setGroupNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            const userNotifications = await fetch(process.env.REACT_APP_BASEURL+'/api/user-notifications/'+user.userId, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            const user_json = await userNotifications.json();

            if (userNotifications.ok) {
                setUserNotifications(user_json);
            }

            const groupNotifications = await fetch(process.env.REACT_APP_BASEURL+'/api/group-notifications/'+user.userId, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            const group_json = await groupNotifications.json();

            if (groupNotifications.ok) {
                setGroupNotifications(group_json);
            }
        }

        if (user) {
            fetchNotifications();
        }
    }, [user])


    return (
        <div className={styles.notification}>
            {userNotifications && groupNotifications && (userNotifications.length + groupNotifications.length > 0) &&
                <div className={styles.number}>{userNotifications.length + groupNotifications.length}</div>
            }
            {props.children}
        </div>
    )
}

export default NotificationIcon;