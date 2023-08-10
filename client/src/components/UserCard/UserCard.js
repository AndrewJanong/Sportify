import React  from "react";
import styles from './UserCard.module.css';
import { Image } from 'cloudinary-react';
import { useNavigate } from "react-router-dom";


// UserCard is used to display a user in the form of it's profile picture and (possibly) username
const UserCard = (props) => {

    const navigate = useNavigate();

    // Opens the user profile if clicked
    const handleOpenProfile = (e) => {
        e.preventDefault();

        navigate(`/profile/${props.user._id}`);
    }

    // If props.pictureOnly is true, only the user's profile picture will be shown in the card
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