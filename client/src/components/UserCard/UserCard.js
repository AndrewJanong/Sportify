import React from "react";
import styles from './UserCard.module.css';
import Member from '../../icons/Member.png';
import { useNavigate } from "react-router-dom";

const UserCard = (props) => {

    const navigate = useNavigate();

    const handleOpenProfile = (e) => {
        e.preventDefault();

        navigate(`/profile/${props.username}`);
    }

    return (
        <div className={styles.card} onClick={handleOpenProfile}>
            <div className={styles.profilePicture}>
                <img src={Member} alt="" />
            </div>
            <div className={styles.username}>
                <p>{props.username}</p>
            </div>
        </div>
    )
}

export default UserCard;