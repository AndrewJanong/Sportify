import React, { useState } from "react";
import styles from './EditProfilePage.module.css';
import { Image } from 'cloudinary-react';
import { useAuthContext } from "../../hooks/useAuthContext";

const EditProfilePage = (props) => {
    const { user, dispatch } = useAuthContext();
    const [imageSelected, setImageSelected] = useState('');

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

        const response = await fetch(process.env.REACT_APP_BASEURL+'/api/user/'+user.username, {
            method: 'PATCH',
            body: JSON.stringify({picture: parsed.public_id}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
        })

        const json = await response.json();
        console.log(json);

         dispatch({
             type: 'EDIT',
             payload: {picture: parsed.public_id}
        })
    }

    return (
        <div className={styles.page}>
            <h1>Edit Profile</h1>
            <div className={styles.container}>
                <div className={styles.profilePicture}>
                    {/* <img src={Member} alt="" /> */}
                    <Image cloudName={`${process.env.REACT_APP_IMAGECLOUD}`} publicId={`${user.picture || "Member_qx5vfp"}`}></Image>
                    <div>
                        <p>Change profile picture</p>
                        <input type="file" accept=".jpg, .png" onChange={(e) => {
                            setImageSelected(e.target.files[0]);
                        }}/>
                        <button onClick={uploadImage}>Change Profile Picture</button>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default EditProfilePage;