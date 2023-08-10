import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './EditMeetupPage.module.css';
import Success from "../../popups/Success";
import { useMeetupsContext } from "../../hooks/useMeetupsContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useParams } from "react-router-dom";

const EditMeetupPage = (props) => {
    const params = useParams();
    const { meetups, dispatch } = useMeetupsContext();
    const [meetup, setMeetup] = useState(meetups.filter(meetup => meetup._id === params.meetupId)[0])
    const [error, setError] = useState('');

    const { user } = useAuthContext();
    const navigate = useNavigate();

    // Array of possible sports for the meetup
    const ListOfSports = ['', 'Basketball', 'Soccer', 'Voleyball', 'Badminton', 'Table Tennis', 'Tennis'];

    // Edit function handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Make sure user is logged in
        if (!user) {
            setError('You Must Be Logged In');
            return;
        }

        // The new edited meetup which values are obtained from the form
        const editedMeetup = {
            title: meetup.title,
            sports: meetup.sports,
            date: meetup.date,
            location: meetup.location,
            members: meetup.members.map((member) => member._id),
            vacancy: meetup.vacancy,
            description: meetup.description,
            creator: meetup.creator._id
        }
    
        // Send PATCH request to the backend to handle meetup editing
        const response = await fetch(process.env.REACT_APP_BASEURL+'/api/meetups/'+params.meetupId, {
            method: 'PATCH',
            body: JSON.stringify(editedMeetup),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
    
        const json = await response.json();
    
        if (!response.ok) {
            setError(json.error);
        } else {
            // Change context state
            dispatch({
              type: 'SET_MEETUPS',
              payload: [json, ...meetups.filter((meetup) => meetup._id !== params.meetupId)], 
            })
    
            Success.fire({
                icon: 'success',
                title: 'Meetup edited'
            })

            // Navigate user to meetups page
            navigate("/meetups/"+json._id);
        }
    }

    // Check if date input is valid
    const dateValid = () => {
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate()+1); 

        let day = Number(tomorrow.getDate());
        let month = Number(tomorrow.getMonth() + 1);
        let year = Number(tomorrow.getFullYear());

        const inputDate = meetup.date.split('T')[0].split('-').map((x) => Number(x));
        if (inputDate[0] < year) {
            return false;
        } else if (inputDate[0] === year) {
            if (inputDate[1] < month) {
                return false;
            } else if (inputDate[1] === month) {
                if (inputDate[2] < day) {
                    return false;
                } else {
                    return true;
                }
            }
        }

        return true;
    }

    return (
        <div className={styles.newmeetup}>
            <div className={styles.container}>
                <h2>Edit Meetup</h2>
                <form action="" className={styles.form} onSubmit={handleSubmit}>
                    <label htmlFor="">Title</label>
                    <input
                        maxLength={40}
                        type="text"
                        onChange={(e) => setMeetup((prev) => {return {...prev, title: e.target.value}})}
                        value={meetup.title}
                    />
                    <label htmlFor="">Sports</label>
                    <select name="" id="" value={meetup.sports} onChange={(e) => setMeetup((prev) => {return {...prev, sports: e.target.value}})}>
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
                        onChange={(e) => setMeetup((prev) => {return {...prev, date: e.target.value}})}
                        value={meetup.date}
                        style={!dateValid() ? {marginBottom: '0'} : {}}
                    />
                    {!dateValid() && <p id={styles.invalidDate}>Meetups must be arranged at least 1 day before</p>}
                    <label htmlFor="">Location</label>
                    <input
                        type="text"
                        onChange={(e) => setMeetup((prev) => {return {...prev, location: e.target.value}})}
                        value={meetup.location}
                        maxLength={40}
                    />
                    <label htmlFor="">Vacancy</label>
                    <input
                        type="number"
                        onChange={(e) => setMeetup((prev) => {return {...prev, vacancy: e.target.value}})}
                        value={meetup.vacancy}
                        min={meetup.members.length}
                        max="30"
                    />
                    <label htmlFor="">Description</label>
                    <textarea 
                        cols="30" 
                        rows="10" 
                        maxLength={300}
                        onChange={(e) => setMeetup((prev) => {return {...prev, description: e.target.value}})}
                        value={meetup.description}
                    ></textarea>
                    <div className={styles.buttons}>
                        <button id={styles.createButton} disabled={!dateValid()}>Edit</button>
                        <button id={styles.cancelButton} onClick={(e) => {
                            e.preventDefault();
                            navigate("/meetups/"+params.meetupId);
                        }}>Cancel</button>
                        
                    </div>
                </form>
                {error && <div className={styles.error}>{error}</div>}
            </div>
        </div>
    )
}

export default EditMeetupPage;