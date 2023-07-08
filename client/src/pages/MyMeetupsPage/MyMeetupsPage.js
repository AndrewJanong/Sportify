import React, { useEffect, useState } from "react";
import styles from "./MyMeetupsPage.module.css";
import MeetupCard from "../../components/MeetupCard/MeetupCard";
import { useMeetupsContext } from "../../hooks/useMeetupsContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import LoadingPage from "../LoadingPage/LoadingPage";

const MyMeetupsPage = (props) => {
    const { meetups, dispatch } = useMeetupsContext();
    const { user } = useAuthContext();
    const [sports, setSports] = useState('Any');
    const [created, setCreated] = useState(false);
    const [loading, setLoading] = useState(true);

    const ListOfSports = ['Any', 'Basketball', 'Soccer', 'Voleyball', 'Badminton', 'Table Tennis', 'Tennis'];

    useEffect(() => {
        const fetchMeetups = async () => {
            const response = await fetch(process.env.REACT_APP_BASEURL+ '/api/meetups/user', {
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
                setLoading(false);
            }
        }

        if (user) {
            fetchMeetups();
        }
    }, [dispatch, user])

    if (loading) {
        return <LoadingPage />;
    }

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
                <div className={styles.upcomingFilter}>
                    <input
                    type="checkbox"
                    defaultChecked={created}
                    onChange={(e) => setCreated(!created)}/>
                    <label>Only Created By Me</label>
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
                .filter((meetup) => {
                    if (!created) {
                        return true;
                    } else {
                        return meetup.creator.username === user.username;
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