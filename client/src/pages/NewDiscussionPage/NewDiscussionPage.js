import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './NewDiscussionPage.module.css';
import Success from "../../popups/Success";
import { useDiscussionsContext } from "../../hooks/useDiscussionsContext";
import { useAuthContext } from "../../hooks/useAuthContext";


const NewDiscussionPage = () => {
    const { user } = useAuthContext();

    const { dispatch } = useDiscussionsContext();
    const [title, setTitle] = useState('');
    const [sports, setSports] = useState('');
    const [date, setDate] = useState(new Date()); //change to auto today date with new Date()???
    const [text, setText] = useState('');
    const [likes, setLikes] = useState(["null"]); 
    const [creator, setCreator] = useState(user.username);
    const [error, setError] = useState('');
    const comments = [{uName: user.username, comment: "default"}];

    const [imageSelected, setImageSelected] = useState('');

    const navigate = useNavigate();

    const ListOfSports = ['', 'Basketball', 'Soccer', 'Voleyball', 'Badminton', 'Table Tennis', 'Tennis'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('You Must Be Logged In');
            return;
        }

        //PROCESS Image
        const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_IMAGECLOUD}/image/upload`;
        const data = new FormData();
        data.append('file', imageSelected);
        data.append('upload_preset', process.env.REACT_APP_PRESET);

        const fetched = await fetch(url, {
            method: "post",
            body: data,
        });
        const parsed = await fetched.json();

        //POSTING 
        const discussion = {title, sports, date, text, likes, picture: parsed.public_id, creator, comments};

        const response = await fetch(process.env.REACT_APP_BASEURL+'/api/discussions', {
            method: 'POST',
            body: JSON.stringify(discussion),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
    
        const json = await response.json();
    
        if (!response.ok) {
            setError(json.error);
        } else {
            setTitle('');
            setSports('');
            setText('');
            setLikes(["null"]);
            setCreator(user.username);

            dispatch({
                type: 'CREATE_DISCUSSION',
                payload: json
            })

            console.log('New discussion added!');
            Success.fire({
                icon: 'success',
                title: 'Discussion created'
            })
            navigate("/discussions");
        }

    }

    return (
        <div className={styles.newdiscussion}>
            <div className={styles.container}>
                <h2>Create Discussion</h2>
                <form action="" className={styles.form} onSubmit={handleSubmit}>
                    <label htmlFor="">Title</label>
                    <input 
                        maxLength = {50}
                        type="text" 
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
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
                    <label htmlFor="">Text</label>
                    <textarea 
                        cols="30" 
                        rows="20" 
                        maxLength={2000}
                        onChange={(e) => setText(e.target.value)}
                        value={text}
                    ></textarea>
                    <label htmlFor="">Picture</label>
                    <input type="file" accept=".jpg, .png" onChange={(e) => {
                            setImageSelected(e.target.files[0]);
                    }}/>
                    <button>Create</button>
                </form>
                {error && <div className={styles.error}>{error}</div>}
            </div>
        </div>
     );
}
 
export default NewDiscussionPage;