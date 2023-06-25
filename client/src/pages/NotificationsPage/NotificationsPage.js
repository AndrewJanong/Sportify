import React, { useEffect, useState } from "react";
import styles from './NotificationsPage.module.css';
import NotificationCard from "./NotificationCard";
import { useAuthContext } from "../../hooks/useAuthContext";
import LoadingPage from "../LoadingPage/LoadingPage";

const NotificationsPage = (props) => {

    const { user } = useAuthContext();
    const [notifications, setNotifications] = useState([]);
    const [refresh, setRefresh] = useState(1);
    const [loading, setLoading] = useState(true);

    // Fetch the user notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            const response = await fetch(process.env.REACT_APP_BASEURL+'/api/notifications/'+user.username, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (json.length > 0 && json[0].test) {
                setNotifications(json);
                setLoading(false);
            }

            if (response.ok) {
                setNotifications(json);
                setLoading(false);
            }
        }

        if (user) {
            fetchNotifications();
        }
    }, [user, refresh])

    const refreshPage = () => {
        setRefresh((refresh + 1) % 2);
    }

    if (loading) {
        return <LoadingPage />
    }

    return (
        <div className={styles.page}>
            <h1>Notifications</h1>
            <div className={styles.notifications}>
                {notifications.map((notification) => {
                    return (
                        <NotificationCard 
                            key={notification._id} 
                            notification={notification} 
                            refreshPage={refreshPage}
                        />
                    )
                }) }
                {notifications.length === 0 &&
                    <p>No notifications</p>
                }
            </div>
        </div>
    )
}

export default NotificationsPage;