import React, { useEffect, useState } from "react";
import styles from './GroupsPage.module.css';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import GroupCard from "./GroupCard";

const GroupsPage = (props) => {

    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [userGroups, setUserGroups] = useState([]);

    useEffect(() => {
        const fetchUserGroups = async () => {
            const response = await fetch(process.env.REACT_APP_BASEURL+'/api/groups/user/'+user.username, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                setUserGroups(json);
            }
        }

        if (user) {
            fetchUserGroups();
        }
    }, [user])

    const handleCreateGroup = () => {
        navigate('/newgroup');
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1>My Groups</h1>
                <button className={styles.createButton} onClick={handleCreateGroup}>Create Group</button>
            </div>
            <div className={styles.groups}>
                {
                    userGroups.map((group) => {
                        return (
                            <GroupCard group={group} key={group.name}/>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default GroupsPage;