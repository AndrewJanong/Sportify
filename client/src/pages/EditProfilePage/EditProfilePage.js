import React, { useState, useEffect } from "react";
import styles from './EditProfilePage.module.css';
import { Image } from 'cloudinary-react';
import { useAuthContext } from "../../hooks/useAuthContext";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../LoadingPage/LoadingPage";

const EditProfilePage = (props) => {
    const params = useParams();
    const navigate = useNavigate();
    const { user, dispatch } = useAuthContext();
    const [fetched, setFetched] = useState(false);
    const [picture, setPicture] = useState("Member_qx5vfp");
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [imageSelected, setImageSelected] = useState("");

    useEffect(() => {
        const getUserInfo = async () => {
            const response = await fetch(process.env.REACT_APP_BASEURL+'/api/user/'+params.userId, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                setPicture(json.picture);
                if (json.bio) setBio(json.bio);
                if (json.name) setName(json.name);
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

            if (parsed) setPicture(parsed.public_id);
        }

        if (user && !fetched) {
            getUserInfo();
        }

        if (imageSelected) {
            uploadImage();
        }
    }, [user, params.userId, imageSelected, fetched])

    const handleSubmit = async (e) => {
        e.preventDefault();

        await fetch(process.env.REACT_APP_BASEURL+'/api/user/'+params.userId, {
            method: 'PATCH',
            body: JSON.stringify({picture, name, bio}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
        })

        dispatch({
             type: 'EDIT',
             payload: {picture, name, bio}
        })

        navigate('/profile/'+params.userId);
    }

    if (!fetched) {
        return <LoadingPage />;
    }

    return (
        <div className={styles.page}>
            <h1>Edit Profile</h1>
            <div className={styles.container}>
                <form action="" className={styles.form}>
                    <label htmlFor="">Profile Picture</label>
                    <div className={styles.profilePicture}>
                        <Image cloudName={`${process.env.REACT_APP_IMAGECLOUD}`} publicId={`${picture || "Member_qx5vfp"}`}></Image>
                        <div>
                            <p>Change profile picture</p>
                            <input type="file" accept=".jpg, .png" onChange={(e) => {
                                setImageSelected(e.target.files[0]);
                            }}/>
                        </div>
                    </div>
                    <label htmlFor="">Name</label>
                    <input 
                        maxLength={30}
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                        value={name} 
                    />

                    <label htmlFor="">Bio</label>
                    <textarea 
                        cols="25" 
                        rows="5" 
                        maxLength={100}
                        onChange={(e) => setBio(e.target.value)}
                        value={bio}
                    ></textarea>
                    <div>
                        <button id={styles.editButton} onClick={handleSubmit}>Edit</button>
                        <button id={styles.cancelButton} onClick={() => navigate('/profile/'+params.userId)}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditProfilePage;