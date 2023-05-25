import React, { useEffect } from "react";
import styles from "./MyMeetupsPage.module.css";
import MeetupCard from "./MeetupCard";
import { useMeetupsContext } from "../../hooks/useMeetupsContext";
import { useAuthContext } from "../../hooks/useAuthContext";

const MyMeetupsPage = (props) => {
    const { meetups, dispatch } = useMeetupsContext();
    const { user } = useAuthContext();

    useEffect(() => {
        const fetchMeetups = async () => {
            const response = await fetch('api/meetups/user', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                dispatch({
                    type: 'SET_MEETUPS',
                    payload: json
                })
            }
        }

        if (user) {
            fetchMeetups();
        }
    }, [dispatch, user])

    return (
        <div className={styles.meetupspage}>
            <div className={styles.filter}>

            </div>
            <div className={styles.meetups}>
                {meetups && meetups.map((meetup) => {
                    return (
                        <MeetupCard key={meetup._id} meetup={meetup}/>
                    )
                })}
            </div>
        </div>
    )
}

export default MyMeetupsPage;