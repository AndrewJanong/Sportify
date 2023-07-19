import React, { useState, useEffect } from "react";
import styles from './EditGroupPage.module.css';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useParams } from "react-router-dom";
import { Image } from 'cloudinary-react';

const EditGroupPage = (props) => {
    const [groupName, setGroupName] = useState('');
    const [sports, setSports] = useState('');
    const [error, setError] = useState('');
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const params = useParams();
    const [imageSelected, setImageSelected] = useState('');
    const [picture, setPicture] = useState("ezpvrwy02j9wt9uzn20s");
    const [fetched, setFetched] = useState(false);

    useEffect(() => {
        const getGroupInfo = async () => {
            const response = await fetch(process.env.REACT_APP_BASEURL+'/api/groups/'+params.id, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                setPicture(json.picture || "ezpvrwy02j9wt9uzn20s");
                setGroupName(json.name);
                setSports(json.sports);
                setFetched(true);
            }
        }

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

        if (user && !fetched) getGroupInfo();
        if (imageSelected) uploadImage();
    }, [imageSelected, fetched, params.id, user]);

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
        };
    
        const response = await fetch(process.env.REACT_APP_BASEURL+'/api/groups/'+params.id, {
            method: 'PATCH',
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
    
        if (!response.ok) {
            setError(json.error);
        } else {
            setGroupName('');
            setSports('');

            navigate("/group/info/"+params.id);
        }
    }


    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1>Edit Group</h1>
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
                    maxLength={40}
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
                <div>
                    <button id={styles.editButton} onClick={handleSubmit}>Edit</button>
                    <button id={styles.cancelButton} onClick={() => navigate("/group/info/"+params.id)}>Cancel</button>
                </div>
            </form>
            {error && <div className={styles.error}>{error}</div>}
        </div>
    )
}

export default EditGroupPage;