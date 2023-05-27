import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './NewMeetupPage.module.css';
import { useMeetupsContext } from "../../hooks/useMeetupsContext";
import { useAuthContext } from "../../hooks/useAuthContext";

const NewMeetupPage = (props) => {
    const { dispatch } = useMeetupsContext();
    const [title, setTitle] = useState('');
    const [sports, setSports] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [vacancy, setVacancy] = useState(1);
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const { user } = useAuthContext();
    const navigate = useNavigate();

    const ListOfSports = ['', 'Basketball', 'Soccer', 'Voleyball', 'Badminton', 'Table Tennis', 'Tennis'];


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('You Must Be Logged In');
            return;
        }
        
        const members = [user.username];
        const meetup = {title, sports, date, location, members, vacancy, description};
    
        const response = await fetch('/api/meetups', {
            method: 'POST',
            body: JSON.stringify(meetup),
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
            setDate('');
            setLocation('');
            setVacancy(1);
            setDescription('');
            dispatch({
              type: 'CREATE_MEETUP',
              payload: json
            })
    
            console.log('New meetup added!');
            navigate("/");
        }
    }

    return (
        <div className={styles.newmeetup}>
            <div className={styles.container}>
                <h2>Create Meetup</h2>
                <form action="" className={styles.form} onSubmit={handleSubmit}>
                    <label htmlFor="">Title</label>
                    <input
                        maxLength={50}
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
                    <label htmlFor="">Date</label>
                    <input
                        type="datetime-local"
                        onChange={(e) => setDate(e.target.value)}
                        value={date}
                    />
                    <label htmlFor="">Location</label>
                    <input
                        type="text"
                        onChange={(e) => setLocation(e.target.value)}
                        value={location}
                    />
                    <label htmlFor="">Vacancy</label>
                    <input
                        type="number"
                        onChange={(e) => setVacancy(e.target.value)}
                        value={vacancy}
                        min="1"
                    />
                    <label htmlFor="">Description</label>
                    {/* <input
                        style={{height: '4.8rem', alignItems: 'start'}}
                        type="textarea"
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                    /> */}
                    <textarea 
                        cols="30" 
                        rows="10" 
                        maxLength={300}
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                    ></textarea>
                    <button>Create</button>
                </form>
                {error && <div className={styles.error}>{error}</div>}
            </div>
        </div>
    )
}

export default NewMeetupPage;