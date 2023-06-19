import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from './NewMeetupPage.module.css';
import Success from "../../popups/Success";
import { useMeetupsContext } from "../../hooks/useMeetupsContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useParams } from "react-router-dom";

const NewMeetupPage = (props) => {
    const params = useParams();
    const { dispatch } = useMeetupsContext();
    const [title, setTitle] = useState('');
    const [sports, setSports] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [vacancy, setVacancy] = useState(1);
    const [description, setDescription] = useState('');
    const [groupInfo, setGroupInfo] = useState({});
    const [error, setError] = useState('');

    const { user } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        const getGroupInfo = async () => {
            const response = await fetch(process.env.REACT_APP_BASEURL+'/api/groups/'+params.groupId, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                setGroupInfo(json);
            }
        }

        if (user && params.groupId) {
            getGroupInfo();
            setSports(groupInfo.sports);
        }
    }, [user, params.groupId, groupInfo.sports])

    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate()+1); 

    let day = tomorrow.getDate();
    let month = tomorrow.getMonth() + 1;
    let year = tomorrow.getFullYear();

    const ListOfSports = ['', 'Basketball', 'Soccer', 'Voleyball', 'Badminton', 'Table Tennis', 'Tennis'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('You Must Be Logged In');
            return;
        }
        
        let members = [user.username];
        if (params.groupId) {
            members = [user.username, ...groupInfo.members.filter((member) => member !== user.username)];
        }
        const meetup = {title, sports, date, location, members, vacancy: members.length, description};
    
        const response = await fetch(process.env.REACT_APP_BASEURL+'/api/meetups', {
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
            Success.fire({
                icon: 'success',
                title: 'Meetup created'
            })
            navigate("/");
        }
    }

    return (
        <div className={styles.newmeetup}>
            <div className={styles.container}>
                <h2>Create Meetup</h2>

                {params.groupId &&
                    <div className={styles.group}>
                        <h3>Group: {groupInfo.name}</h3>
                    </div>
                }
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
                        min={`${year}-${month}-${day}T00:00`}
                    />
                    <label htmlFor="">Location</label>
                    <input
                        type="text"
                        onChange={(e) => setLocation(e.target.value)}
                        value={location}
                    />
                    {!params.groupId && <label htmlFor="">Vacancy</label>}
                    {!params.groupId && 
                    <input
                        type="number"
                        onChange={(e) => setVacancy(e.target.value)}
                        value={vacancy}
                        min="1"
                    />}
                    <label htmlFor="">Description</label>
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