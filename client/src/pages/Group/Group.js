import React, { useState, useEffect } from "react";
import styles from './Group.module.css';
import { useAuthContext } from "../../hooks/useAuthContext";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Image } from "cloudinary-react";

const Group = (props) => {
    const params = useParams();
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [groupInfo, setGroupInfo] = useState({});

    useEffect(() => {
        const getGroupInfo = async () => {
            const response = await fetch(process.env.REACT_APP_BASEURL+'/api/groups/'+params.id, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                setGroupInfo(json);
            }
        }

        if (user) {
            getGroupInfo();
        }
    }, [user, params.id])

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <Image
                    cloudName={`${process.env.REACT_APP_IMAGECLOUD}`}
                    publicId={`${groupInfo.picture || "ezpvrwy02j9wt9uzn20s"}`}>
                </Image>
                <h1>{groupInfo.name}</h1>
                <button id={styles.info} onClick={() => navigate('/group/info/'+params.id)}>Group Info</button>
                <button id={styles.createMeetup} onClick={() => navigate('/newmeetup/'+params.id)}>Create Meetup</button>
            </div>
            <div className={styles.chat}>
                <p>Chatting feature comming soon...</p>
            </div>
        </div>
    )
}

export default Group;