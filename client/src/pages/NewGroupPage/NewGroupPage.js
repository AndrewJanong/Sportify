import React, { useState } from "react";
import styles from './NewGroupPage.module.css';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import Cross from '../../icons/Cross.png';

const NewGroupPage = (props) => {
    const [groupName, setGroupName] = useState('');
    const [sports, setSports] = useState('');
    const [member, setMember] = useState('');
    const [error, setError] = useState('');
    const { user } = useAuthContext();
    const [addedMembers, setAddedMembers] = useState([]);
    const navigate = useNavigate();

    const ListOfSports = ['', 'Basketball', 'Soccer', 'Voleyball', 'Badminton', 'Table Tennis', 'Tennis'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('You Must Be Logged In');
            return;
        }
        
        const group = {
            name: groupName,
            sports,
            members: [user.username]
        };
    
        const response = await fetch(process.env.REACT_APP_BASEURL+'/api/groups', {
            method: 'POST',
            body: JSON.stringify(group),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })

        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
            return;
        }

        addedMembers.forEach(async (member) => {
            const request = await fetch(process.env.REACT_APP_BASEURL+'/api/group-requests/', {
                method: 'POST',
                body: JSON.stringify({
                    group: groupName,
                    groupId: json._id,
                    target: member
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            })

            const notification = await fetch(process.env.REACT_APP_BASEURL+'/api/notifications/', {
                method: 'POST',
                body: JSON.stringify({
                    type: "group-request",
                    target_user: member,
                    sender: json._id,
                    message: `You have been invited to join ${groupName}`
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const json_request = await request.json();
            const json_notification = await notification.json();

            if (!request.ok) {
                setError(json_request.error);
            }

            if (!notification.ok) {
                setError(json_notification.error)
            }
        });
    
        
    
        if (!response.ok) {
            setError(json.error);
        } else {
            setGroupName('');
            setSports('');
    
            console.log('New group created!');

            navigate("/mygroups");
        }
    }

    const addMember = async (e) => {
        e.preventDefault();

        const getUserInfo = async () => {
            const response = await fetch(process.env.REACT_APP_BASEURL+'/api/user/'+member, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                return json;
            } else {
                console.log('error');
            }
        }

        let invitedUser = null;

        if (member !== '') {
            invitedUser = await getUserInfo();
        }
        
        if (invitedUser) {
            console.log(invitedUser);
            setAddedMembers([...addedMembers, invitedUser.username]);
            setError('');
        } else {
            setError('User Not Found');
        }

        setMember('');
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1>Create Group</h1>
            </div>
            <form action="" className={styles.form}>
                <label htmlFor="">Group Name</label>
                <input
                    maxLength={50}
                    type="text"
                    onChange={(e) => setGroupName(e.target.value)}
                    value={groupName}
                />
                <label htmlFor="">Sports</label>
                <select name="" id="" value={sports} onChange={(e) => setSports(e.target.value)}>
                    {
                        ListOfSports.map(sport => 
                            <option 
                                key={sport} 
                                value={sport}
                            >
                            {sport}
                            </option>
                        )
                    }
                </select>
                <label htmlFor="">Members</label>
                <div className={styles.invite}>
                    <input
                        maxLength={30}
                        type="text"
                        onChange={(e) => setMember(e.target.value)}
                        value={member}
                    />
                    <button onClick={addMember} id={styles.addButton}>Add</button>
                </div>
                <div className={styles.addedMembers}>
                    {[user.username, ...addedMembers].map((member) => {
                        return (
                            <div className={styles.members} key={member}>
                                <p>{member}</p>
                                {member !== user.username && 
                                    <img 
                                    src={Cross} 
                                    alt=""
                                    onClick={() => {
                                        setAddedMembers((prev) => prev.filter((x) => x !== member));
                                    }}/>}
                            </div>   
                        )
                    })}
                </div>
                <button id={styles.createButton} onClick={handleSubmit}>Create</button>
            </form>

            {error && <div className={styles.error}>{error}</div>}
        </div>
    )
}

export default NewGroupPage;