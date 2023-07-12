import React from "react";
import styles from './MeetupCard.module.css';
import Date from '../../icons/Date.png';
import Location from '../../icons/Location.png';
import Member from '../../icons/Member.png';
import { useNavigate } from "react-router-dom";

const MeetupCard = (props) => {
    const navigate = useNavigate();

    const viewHandler = (e) => {
        e.preventDefault();

        navigate(`/meetups/${props.meetup._id}`)
    }

    return (
        <div className={styles.meetupcard}>
            <div className={styles.header}>
                <h1>{props.meetup.title}</h1>
                {/* <p>Created by {props.meetup.members[0].username}</p> */}
            </div>
            <p className={styles.sport}>{props.meetup.sports}</p>
            <div className={styles.info}>
                <div className={styles.date}>
                    <img src={Date} alt="" />
                    <p>{props.meetup.date.split('T')[0]}, {props.meetup.date.split('T')[1]}</p>
                </div>
                <div className={styles.location}>
                    <img src={Location} alt="" />
                    <p>{props.meetup.location}</p>
                </div>
                <div className={styles.members}>
                    <img src={Member} alt="" />
                    <p>{props.meetup.members.length} / {props.meetup.vacancy}</p>
                </div>
            </div>
            <button className={styles.view} onClick={viewHandler}>
                View
            </button>
        </div>
    )
}

export default MeetupCard;