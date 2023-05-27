import React, { useEffect, useState } from "react";
import styles from "./MyMeetupsPage.module.css";
import MeetupCard from "../../components/MeetupCard/MeetupCard";
import { useMeetupsContext } from "../../hooks/useMeetupsContext";
import { useAuthContext } from "../../hooks/useAuthContext";

const MyMeetupsPage = (props) => {
    const { meetups, dispatch } = useMeetupsContext();
    const { user } = useAuthContext();
    const [sports, setSports] = useState('Any');

    const ListOfSports = ['Any', 'Basketball', 'Soccer', 'Voleyball', 'Badminton', 'Table Tennis', 'Tennis'];

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
                <div className={styles.sportsFilter}>
                    <p>Sports:</p>
                    <select name="" id="" value={sports} onChange={(e) => setSports(e.target.value)}>
                        {
                            ListOfSports.map(sport =>
                                <option
                                    key={sport}
                                    value={sport}
                                >
                                        {sport}
                                </option>
                            )
                        }
                    </select>
                </div>
            </div>
            <div className={styles.meetups}>
                {meetups && 
                meetups
                .filter((meetup) => {
                    if (sports === 'Any') {
                        return true;
                    } else {
                        return sports === meetup.sports;
                    }
                })
                .map((meetup) => {
                    return (
                        <MeetupCard key={meetup._id} meetup={meetup}/>
                    )
                })}
            </div>
        </div>
    )
}

export default MyMeetupsPage;