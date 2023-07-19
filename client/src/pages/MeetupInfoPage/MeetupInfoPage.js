import React from "react";
import styles from './MeetupInfoPage.module.css';
import Swal from 'sweetalert2';
import Success from "../../popups/Success";
import { useNavigate } from "react-router-dom";
import DateWhite from '../../icons/DateWhite.png';
import LocationWhite from '../../icons/LocationWhite.png';
import MemberWhite from '../../icons/MemberWhite.png';
import { useParams } from "react-router-dom";
import { useMeetupsContext } from "../../hooks/useMeetupsContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import UserCard from "../../components/UserCard/UserCard";



const MeetupInfoPage = (props) => {
    const navigate = useNavigate();
    const params = useParams();
    const { meetups, dispatch } = useMeetupsContext();
    const { user } = useAuthContext();

    const meetupId = params.meetupId;
    const meetup = meetups.filter(meetup => meetup._id === meetupId)[0];
    const usernames = meetup.members.map(member => member.username); 

    const handleJoin = async (e) => {
        e.preventDefault();

        if (!user) {
            return;
        }

        if (usernames.length === meetup.vacancy) {
            Swal.fire('Meetup is full!');
            return;
        }

        const response = await fetch(process.env.REACT_APP_BASEURL+'/api/meetups/add-member/' + meetupId, {
            method: 'PATCH',
            body: JSON.stringify({memberId: user.userId}),
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

        if (response.ok) {
            dispatch({
                type: 'SET_MEETUPS',
                payload: newMeetups
            })
            Success.fire({
                icon: 'success',
                title: 'Joined Meetup'
            })
            navigate('/');
        } else {
            console.log('error update');
        }
    }

    const handleDelete = async (e) => {
        e.preventDefault();

        if (!user) {
            return;
        }

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )

                const response = await fetch(process.env.REACT_APP_BASEURL+'/api/meetups/' + meetup._id, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                })
        
                const json = await response.json();
        
                if (response.ok) {
                    dispatch({
                        type: 'DELETE_WORKOUT',
                        payload: json
                    })
        
                    navigate('/');
                }
            }
        })
        
    }

    const handleLeave = async (e) => {
        e.preventDefault();

        if (!user) {
            return;
        }

        Swal.fire({
            title: 'Are you sure?',
            text: "Others might replace you!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, leave!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Left!',
                    'You have left the meetup',
                    'success'
                )

                const response = await fetch(process.env.REACT_APP_BASEURL+'/api/meetups/remove-member/' + meetupId, {
                    method: 'PATCH',
                    body: JSON.stringify({memberId: user.userId}),
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
                    navigate('/');
                } else {
                    console.log('error update');
                }
            }
        })
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <p>{meetup.title}</p>
                <div className={styles.headerButtons}>
                    {user.username === meetup.creator.username && <button className={styles.edit} onClick={(e) => navigate('/editmeetup/'+ meetupId)}>Edit</button>}
                    {user.username === meetup.creator.username && <button className={styles.delete} onClick={handleDelete}>Delete</button>}
                </div>
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
                    {meetup.members.map((member) => {
                        return (
                            <UserCard user={member} key={member._id}/>
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
            usernames.includes(user.username) && user.username !== meetup.creator.username && <button 
                className={styles.leave} 
                onClick={handleLeave}
            >
                    Leave
            </button>
            }
        </div>
    )
}

export default MeetupInfoPage;