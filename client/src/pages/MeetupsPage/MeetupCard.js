import React from "react";
import styles from './MeetupCard.module.css';

const MeetupCard = (props) => {

    return (
        <div className={styles.meetupcard}>
            <h1>{props.meetup.title}</h1>
            <p>{props.meetup.sports}</p>
            <div className={styles.info}>
                <p>{props.meetup.date}</p>
                <p>{props.meetup.location}</p>
                <p>{props.meetup.vacancy}</p>
            </div>
            <button>
                View
            </button>
        </div>
    )
}

export default MeetupCard;