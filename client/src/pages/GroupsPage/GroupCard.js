import React from "react";
import styles from './GroupCard.module.css';
import { useNavigate } from "react-router-dom";

const GroupCard = (props) => {
    const navigate = useNavigate();

    return (
        <div className={styles.card} onClick={() => navigate('/group/' + props.group._id)}>
            <h2 id={styles.groupName}>{props.group.name}</h2>
            <p>{props.group.sports}</p>
        </div>
    )
}

export default GroupCard;