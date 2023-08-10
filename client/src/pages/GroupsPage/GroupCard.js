import React from "react";
import styles from './GroupCard.module.css';
import { useNavigate } from "react-router-dom";
import { Image } from "cloudinary-react";

// Group Card to display the group in Groups Page
const GroupCard = (props) => {
    const navigate = useNavigate();

    return (
        <div className={styles.card} onClick={() => navigate('/group/' + props.group._id)}>
            <div className={styles.groupPicture}>
                <Image
                    cloudName={`${process.env.REACT_APP_IMAGECLOUD}`}
                    publicId={`${props.group.picture || "ezpvrwy02j9wt9uzn20s"}`}>
                </Image>
            </div>
            <div className={styles.group}>
                <h2 id={styles.groupName}>{props.group.name}</h2>
                <p>{props.group.sports}</p>
            </div>
        </div>
    )
}

export default GroupCard;