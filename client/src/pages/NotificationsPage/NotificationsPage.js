import React, { useEffect, useState } from "react";
import styles from './NotificationsPage.module.css';
import NotificationCard from "./NotificationCard";
import { useAuthContext } from "../../hooks/useAuthContext";
import LoadingPage from "../LoadingPage/LoadingPage";

const NotificationsPage = (props) => {

    const { user } = useAuthContext();
    const [userNotifications, setUserNotifications] = useState([]);
    const [groupNotifications, setGroupNotifications] = useState([]);
    const [refresh, setRefresh] = useState(1);
    const [loading, setLoading] = useState(true);

    // Fetch notifications
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
                setLoading(false);
            }
        }

        if (user) {
            fetchNotifications();
        }
    }, [user, refresh])

    console.log(userNotifications);

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
                {userNotifications.map((notification) => {
                    return <NotificationCard notification={notification} refreshPage={refreshPage} key={notification._id} />
                })}

                {groupNotifications.map((notification) => {
                    return <NotificationCard notification={notification} refreshPage={refreshPage} key={notification._id} />
                })}

                {userNotifications.length + groupNotifications.length === 0 && <p>You have no notifications</p>}
            </div>
        </div>
    )
}

export default NotificationsPage;