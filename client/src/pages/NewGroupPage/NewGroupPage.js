import React, { useState, useEffect } from "react";
import styles from './NewGroupPage.module.css';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import Cross from '../../icons/Cross.png';
import { Image } from 'cloudinary-react';

const NewGroupPage = (props) => {
    const [groupName, setGroupName] = useState('');
    const [sports, setSports] = useState('');
    const [member, setMember] = useState('');
    const [error, setError] = useState('');
    const { user } = useAuthContext();
    const [addedMembers, setAddedMembers] = useState([]);
    const navigate = useNavigate();
    const [imageSelected, setImageSelected] = useState('');
    const [picture, setPicture] = useState("ezpvrwy02j9wt9uzn20s");

    useEffect(() => {
        const uploadImage = async () => {
            const url = `https://api.cloudinary.com/v1_1/dpjocjbpp/image/upload`;
            const data = new FormData();
            data.append('file', imageSelected);
            data.append('upload_preset', process.env.REACT_APP_PRESET);
    
            const fetched = await fetch(url, {
                method: "post",
                body: data,
            });
            const parsed = await fetched.json();
            console.log(
                parsed.public_id // 200, success!
            );
    
            if (parsed) setPicture(parsed.public_id);
        }

        if (imageSelected) uploadImage();
    }, [imageSelected]);

    const ListOfSports = ['', 'Basketball', 'Soccer', 'Voleyball', 'Badminton', 'Table Tennis', 'Tennis'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('You Must Be Logged In');
            return;
        }
        
        const group = {
            name: groupName,
            picture,
            sports,
            members: [user.userId]
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

        const groupChat = await fetch(process.env.REACT_APP_BASEURL+'/api/group-chat/'+json._id, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        const groupchat_json = await groupChat.json();

        if (!groupChat.ok) {
            setError(groupchat_json.error);
            return;
        }

        addedMembers.forEach(async (member) => {
            const request = await fetch(process.env.REACT_APP_BASEURL+'/api/group-requests/', {
                method: 'POST',
                body: JSON.stringify({
                    group: json._id,
                    target: member._id
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            })

            const notification = await fetch(process.env.REACT_APP_BASEURL+'/api/group-notifications/', {
                method: 'POST',
                body: JSON.stringify({
                    type: "group-request",
                    target_user: member._id,
                    sender: json._id,
                    message: `You have been invited to join ${groupName}`
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
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
            const response = await fetch(process.env.REACT_APP_BASEURL+'/api/user/username/'+member, {
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
            if (!addedMembers.find((member) => member.username === invitedUser.username)) setAddedMembers([...addedMembers, invitedUser]);
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
                <label htmlFor="">Group Picture</label>
                <div className={styles.groupPicture}>
                    <Image
                        cloudName={`${process.env.REACT_APP_IMAGECLOUD}`}
                        publicId={`${picture}`}>
                    </Image>
                    <input type="file" accept=".jpg, .png" onChange={(e) => {
                        setImageSelected(e.target.files[0]);
                    }}/>
                </div>
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
                    {[user, ...addedMembers].map((member) => {
                        return (
                            <div className={styles.members} key={member._id}>
                                <p>{member.username}</p>
                                {member.username !== user.username && 
                                    <img 
                                    src={Cross} 
                                    alt=""
                                    onClick={() => {
                                        setAddedMembers((prev) => prev.filter((x) => x._id !== member._id));
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