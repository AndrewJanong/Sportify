import React, { useEffect, useState } from "react";
import styles from './NotificationsPage.module.css';
import NotificationCard from "./NotificationCard";
import { useAuthContext } from "../../hooks/useAuthContext";

const NotificationsPage = (props) => {

    const { user } = useAuthContext();
    const [notifications, setNotifications] = useState([]);

    // Fetch the user notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            const response = await fetch(process.env.REACT_APP_BASEURL+'/api/notifications/'+user.username, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                setNotifications(json);
                console.log(json);
            }
        }

        if (user) {
            fetchNotifications();
        }
    }, [user])

    return (
        <div className={styles.page}>
            <h1>Notifications</h1>
            <div className={styles.notifications}>
                {notifications.map((notification) => {
                    return (
                        <NotificationCard key={notification._id} notification={notification}/>
                    )
                }) }
            </div>
        </div>
    )
}

export default NotificationsPage;