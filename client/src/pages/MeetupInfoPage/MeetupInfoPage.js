import React from "react";
import styles from './MeetupInfoPage.module.css';
import { useNavigate } from "react-router-dom";
import DateWhite from '../../icons/DateWhite.png';
import LocationWhite from '../../icons/LocationWhite.png';
import MemberWhite from '../../icons/MemberWhite.png';
import { useParams } from "react-router-dom";
import { useMeetupsContext } from "../../hooks/useMeetupsContext";
import { useAuthContext } from "../../hooks/useAuthContext";

//function useForceUpdate(){
//    const [value, setValue] = useState(0); // integer state
//    return () => setValue(value => value + 1); // update state to force render
    // A function that increment 👆🏻 the previous state like here 
    // is better than directly setting `setValue(value + 1)`
//}

const MeetupInfoPage = (props) => {
    const navigate = useNavigate();
    const params = useParams();
    const { meetups, dispatch } = useMeetupsContext();
    const { user } = useAuthContext();

    const meetupId = params.meetupId;
    const meetup = meetups.filter(x => x._id === meetupId)[0];
    const usernames = meetup.members;
    //const forceUpdate = useForceUpdate();
    

    const handleJoin = async (e) => {
        e.preventDefault();

        if (!user) {
            return;
        }

        const response = await fetch('/api/meetups/' + meetupId, {
            method: 'PATCH',
            body: JSON.stringify({members: [...usernames, user.username]}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },

        });

        const json = await response.json();
        const newMeetups = meetups.map((meetup) => {
            if (meetup._id === meetupId) {
                return json;
            } else {
                return meetup;
            } 
        })

        console.log(newMeetups);

        if (response.ok) {
            dispatch({
                type: 'SET_MEETUPS',
                payload: newMeetups
            })
            //forceUpdate();
            navigate('/');
        } else {
            console.log('error update');
        }
    }

    return (
        <div className={styles.meetup}>
            <div className={styles.header}>
                <h1>{meetup.title}</h1>
                <button className={styles.edit}>Edit</button>
                <button className={styles.delete}>Delete</button>
            </div>
            <div className={styles.info}>
                <div className={styles.container}>
                    <p>{meetup.sports}</p>
                    <div>
                        <img src={DateWhite} alt="" />
                        <p>{meetup.date.split('T')[0]}, {meetup.date.split('T')[1]}</p>
                    </div>
                    <div>
                        <img src={LocationWhite} alt="" />
                        <p>{meetup.location}</p>
                    </div>
                    <div>
                        <img src={MemberWhite} alt="" />
                        <p>{meetup.members.length} / {meetup.vacancy}</p>
                    </div>
                </div>
                <div className={styles.description}>
                    <p>{meetup.description}</p>
                </div>
            </div>
            <div className={styles.members}>
                <h2>In The Meetup</h2>
                <div>
                    {usernames.map((username) => {
                        return (
                            <div key={username}>
                                <p>{username}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
            {
            !usernames.includes(user.username) && <button 
                className={styles.join} 
                onClick={handleJoin}
            >
                    Join
            </button>
            }
            {
            usernames.includes(user.username) && <button 
                className={styles.leave} 
                
            >
                    Leave
            </button>
            }
        </div>
    )
}

export default MeetupInfoPage;