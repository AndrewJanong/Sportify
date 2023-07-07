import React  from "react";
import styles from './UserCard.module.css';
import { Image } from 'cloudinary-react';
import { useNavigate } from "react-router-dom";

const UserCard = (props) => {

    const navigate = useNavigate();

    const handleOpenProfile = (e) => {
        e.preventDefault();

        navigate(`/profile/${props.user._id}`);
    }

    const profilePictureOnly = props.pictureOnly || false;

    return (
        <div className={styles.card} onClick={handleOpenProfile}>
            <div className={styles.profilePicture}>
            <Image 
                cloudName={`${process.env.REACT_APP_IMAGECLOUD}`} 
                publicId={`${props.user.picture || "Member_qx5vfp"}`}>
            </Image>
            </div>
            {!profilePictureOnly && 
            <div className={styles.username}>
                <p>{props.user.username}</p>
            </div>}
        </div>
    )
}

export default UserCard;