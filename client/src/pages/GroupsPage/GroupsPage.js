import React, { useEffect, useState } from "react";
import styles from './GroupsPage.module.css';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import GroupCard from "./GroupCard";
import LoadingPage from "../LoadingPage/LoadingPage";

const GroupsPage = (props) => {

    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [userGroups, setUserGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserGroups = async () => {
            const response = await fetch(process.env.REACT_APP_BASEURL+'/api/groups/user/'+user.userId, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (json.length > 0 && json[0].test) {
                setUserGroups(json);
                setLoading(false);
            }

            if (response.ok) {
                setUserGroups(json);
                setLoading(false);
            }
        }

        if (user) {
            fetchUserGroups();
        }
    }, [user])

    const handleCreateGroup = () => {
        navigate('/newgroup');
    }

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1>My Groups</h1>
                <button className={styles.createButton} onClick={handleCreateGroup}>Create</button>
            </div>
            <div className={styles.groups}>
                {
                    userGroups.map((group) => {
                        return (
                            <GroupCard group={group} key={group._id}/>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default GroupsPage;