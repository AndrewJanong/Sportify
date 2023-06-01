import React from "react";
import styles from './ProfilePage.module.css';
import Member from '../../icons/Member.png';
import { useParams } from "react-router-dom";
import { useLogout } from '../../hooks/useLogout';
import { useAuthContext } from "../../hooks/useAuthContext";

const ProfilePage = (props) => {
    const params = useParams();
    const { logout } = useLogout();
    const { user } = useAuthContext();

    const handleLogout = () => {
        logout();
    }

    return (
        <div className={styles.profilePage}>
            <div className={styles.container}>
                <div className={styles.profilePicture}>
                    <img src={Member} alt="" />
                </div>
                <div className={styles.username}>
                    <p>{params.username}</p>
                    { user.username === params.username &&
                        <button className={styles.edit}>Edit</button>
                    }
                    { user.username === params.username &&
                        <button className={styles.logout} onClick={handleLogout}>Log Out</button>
                    }
                </div>
            </div>
            <div>

            </div>
        </div>
    )
}

export default ProfilePage;