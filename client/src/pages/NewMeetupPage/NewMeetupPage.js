import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from './NewMeetupPage.module.css';
import Success from "../../popups/Success";
import { useMeetupsContext } from "../../hooks/useMeetupsContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useParams } from "react-router-dom";

const getTomorrowDate = () => {
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate()+1); 

    let day = tomorrow.getDate();
    let month = tomorrow.getMonth() + 1;
    let year = tomorrow.getFullYear();

    return `${year}-${month}-${day}T00:00`;
}

const NewMeetupPage = (props) => {
    const params = useParams();
    const { dispatch } = useMeetupsContext();
    const [title, setTitle] = useState('');
    const [sports, setSports] = useState('');
    const [date, setDate] = useState(getTomorrowDate());
    const [location, setLocation] = useState('');
    const [vacancy, setVacancy] = useState(1);
    const [description, setDescription] = useState('');
    const [groupInfo, setGroupInfo] = useState({});
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

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

    

    const ListOfSports = ['', 'Basketball', 'Soccer', 'Voleyball', 'Badminton', 'Table Tennis', 'Tennis'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        if (!user) {
            setError('You Must Be Logged In');
            return;
        }
        
        let members = [user.userId];
        

        let meetup = {title, sports, date, location, members, vacancy, description, creator: user.userId};

        if (params.groupId) {
            members = [user.userId, ...groupInfo.members.filter(member => member._id !== user.userId)];
            meetup.vacancy = members.length;
            meetup.members = members;
        }
    
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
            setSubmitting(false);
        } else {
            setTitle('');
            setSports('');
            setDate('');
            setLocation('');
            setVacancy(1);
            setDescription('');

            await fetch(process.env.REACT_APP_BASEURL+'/api/meetup-chat/'+json._id, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })

            dispatch({
              type: 'CREATE_MEETUP',
              payload: json
            })
    
            Success.fire({
                icon: 'success',
                title: 'Meetup created'
            })
            navigate("/");
            setSubmitting(true);
        }
    }

    const dateValid = () => {
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate()+1); 

        let day = Number(tomorrow.getDate());
        let month = Number(tomorrow.getMonth() + 1);
        let year = Number(tomorrow.getFullYear());

        const inputDate = date.split('T')[0].split('-').map((x) => Number(x));
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
                <h2>Create Meetup</h2>

                {params.groupId &&
                    <div className={styles.group}>
                        <h3>Group: {groupInfo.name}</h3>
                    </div>
                }
                <form action="" className={styles.form} onSubmit={handleSubmit}>
                    <label htmlFor="">Title</label>
                    <input
                        maxLength={40}
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
                        style={!dateValid() ? {marginBottom: '0'} : {}}
                    />
                    {!dateValid() && <p id={styles.invalidDate}>Meetups must be arranged at least 1 day before</p>}
                    <label htmlFor="">Location</label>
                    <input
                        type="text"
                        onChange={(e) => setLocation(e.target.value)}
                        value={location}
                        maxLength={40}
                    />
                    {!params.groupId && <label htmlFor="">Vacancy</label>}
                    {!params.groupId && 
                    <input
                        type="number"
                        onChange={(e) => setVacancy(e.target.value)}
                        value={vacancy}
                        min="1"
                        max="30"
                    />}
                    <label htmlFor="">Description</label>
                    <textarea 
                        cols="30" 
                        rows="10" 
                        maxLength={300}
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                    ></textarea>
                    <button disabled={submitting || !dateValid()}>Create</button>
                </form>
                {error && <div className={styles.error}>{error}</div>}
            </div>
        </div>
    )
}

export default NewMeetupPage;