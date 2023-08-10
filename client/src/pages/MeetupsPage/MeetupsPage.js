import React, { useEffect, useState } from "react";
import styles from "./MeetupsPage.module.css";
import MeetupCard from "../../components/MeetupCard/MeetupCard";
import { useMeetupsContext } from "../../hooks/useMeetupsContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import LoadingPage from "../LoadingPage/LoadingPage";

const MeetupsPage = (props) => {
    const { meetups, dispatch } = useMeetupsContext();
    const { user } = useAuthContext();
    const [sports, setSports] = useState('Any');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('sport');

    // Array of possible sports of the meetup for filter purposes
    const ListOfSports = ['Any', 'Basketball', 'Soccer', 'Voleyball', 'Badminton', 'Table Tennis', 'Tennis'];

    useEffect(() => {
        // Fetch all meetups
        const fetchMeetups = async () => {
            const response = await fetch(process.env.REACT_APP_BASEURL+'/api/meetups', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();
            setLoading(false);

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

    // While meetups being fetched, display loading page
    if (loading) {
        return <LoadingPage />
    }

    // Filtered meetups
    const filteredMeetups = meetups
    .filter((meetup) => {
        if (sports === 'Any') {
            return true;
        } else {
            return sports === meetup.sports;
        }
    })
    .filter((meetup) => {
        if (!date) {
            return true;
        } else {
            return date === meetup.date.split('T')[0];
        }
    });

    return (
        <div className={styles.meetupspage}>
            <div className={styles.filter}>
                <div className={styles.chooseFilter}>
                    <p>Filter:</p>
                    <select name="" id="" value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="sport">Sport</option>
                        <option value="date">Date</option>
                    </select>
                </div>
                <div className={`${filter === 'sport' ? styles.show : styles.hide} ${styles.sportsFilter} `}>
                    <p>Sports:</p>
                    <select name="" id="" value={sports} onChange={(e) => setSports(e.target.value)} data-testid="select-sport">
                        {
                            ListOfSports.map(sport =>
                                <option
                                    key={sport}
                                    value={sport}
                                    data-testid="select-option"
                                >
                                        {sport}
                                </option>
                            )
                        }
                    </select>
                </div>
                <div className={`${filter === 'date' ? styles.show : styles.hide} ${styles.dateFilter} `}>
                    <p>Date:</p>
                    <input type="date" name="" id=""  onChange={(e) => setDate(e.target.value)} data-testid="input-date"/>
                </div>
            </div>
            <div className={styles.meetups}>
                {filteredMeetups.length > 0 ?
                filteredMeetups.map((meetup) => {
                    return (
                        <MeetupCard key={meetup._id} meetup={meetup}/>
                    )
                }) : <p>No Meetups</p>
                } 
            </div>
        </div>
    )
}

export default MeetupsPage;