import React, { useState, useEffect } from "react";
import styles from './UserCard.module.css';
import { Image } from 'cloudinary-react';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

const UserCard = (props) => {

    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        const getUserInfo = async () => {
            const response = await fetch(process.env.REACT_APP_BASEURL+'/api/user/'+props.username, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                setUserInfo(json);
            }
        }

        if (user) {
            getUserInfo();
        }
    }, [user, props.username])

    const handleOpenProfile = (e) => {
        e.preventDefault();

        navigate(`/profile/${props.username}`);
    }

    return (
        <div className={styles.card} onClick={handleOpenProfile}>
            <div className={styles.profilePicture}>
            <Image 
                cloudName={`${process.env.REACT_APP_IMAGECLOUD}`} 
                publicId={`${userInfo.picture || "Member_qx5vfp"}`}>
            </Image>
            </div>
            <div className={styles.username}>
                <p>{props.username}</p>
            </div>
        </div>
    )
}

export default UserCard;