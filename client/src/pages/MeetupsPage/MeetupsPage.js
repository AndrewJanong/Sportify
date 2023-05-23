import React, { useEffect, useState } from "react";
import styles from "./MeetupsPage.module.css";
import MeetupCard from "./MeetupCard";

const MeetupsPage = (props) => {
    const [meetups, setMeetups] = useState(null);
    console.log(meetups);

    useEffect(() => {
        const fetchMeetups = async () => {
            const response = await fetch('api/meetups');
            const json = await response.json();

            if (response.ok) {
                console.log("HMM");
                setMeetups(json);
            }
        }

        fetchMeetups();
    }, [])

    return (
        <div className={styles.meetupspage}>
            <div className={styles.filter}>

            </div>
            <div className={styles.meetups}>
                {meetups && meetups.map((meetup) => {
                    return (
                        <MeetupCard key={meetup._id} meetup={meetup}/>
                        //<p key={meetup._id}>{`${meetup.title}`}</p>
                    )
                })}
            </div>
        </div>
    )
}

export default MeetupsPage;