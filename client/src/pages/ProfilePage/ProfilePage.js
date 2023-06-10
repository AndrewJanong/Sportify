import React, { useEffect, useState } from "react";
import { Image } from 'cloudinary-react';
import styles from './ProfilePage.module.css';
import Loading from '../../icons/Loading.gif';
import { useNavigate } from "react-router-dom";
import UserCard from "../../components/UserCard/UserCard";
import MeetupCard from "../../components/MeetupCard/MeetupCard";
import { useParams } from "react-router-dom";
import { useLogout } from '../../hooks/useLogout';
import { useAuthContext } from "../../hooks/useAuthContext";
import { useMeetupsContext } from "../../hooks/useMeetupsContext";


const ProfilePage = (props) => {
    const params = useParams();
    const navigate = useNavigate();
    const { logout } = useLogout();
    const { meetups, dispatch } = useMeetupsContext();
    const { user } = useAuthContext();
    const [status, setStatus] = useState(-1);
    const [display, setDisplay] = useState('friends');
    const [friends, setFriends] = useState([]);
    const [userInfo, setUserInfo] = useState({});
    

    const handleEditProfile = (e) => {
        e.preventDefault();

        navigate(`/edit/${params.username}`);
    }

    const userA = user.username;
    const userB = params.username;

    useEffect(() => {
        const getFriendshipStatus = async () => {
            const response = await fetch(process.env.REACT_APP_BASEURL+'/api/friends/');
            const json = await response.json();
            
            if (response.ok) {
                const friendship = json.filter(x => (x.requester === userA && x.recipient === userB));
                setFriends(json.filter(x => (x.requester === userB && x.status === 3)).map(x => x.recipient));
                setDisplay('friends');
                
                if (friendship.length > 0) {
                    const status = friendship[0].status;
                    setStatus(status);
                } else {
                    setStatus(0);
                }
            }
        }

        const fetchMeetups = async () => {
            const response = await fetch(process.env.REACT_APP_BASEURL+'/api/meetups', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                dispatch({
                    type: 'SET_MEETUPS',
                    payload: json
                })
            }
        }

        const getUserInfo = async () => {
            const response = await fetch(process.env.REACT_APP_BASEURL+'/api/user/'+userB, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                setUserInfo(json);
            }
        }

        if (user) {
            getFriendshipStatus();
            fetchMeetups();
            getUserInfo();
        }
    }, [dispatch, status, user, userA, userB])

    const handleAddFriend = async (e) => {
        e.preventDefault();

        const response = await fetch(process.env.REACT_APP_BASEURL+'/api/friends/request', {
            method: 'POST',
            body: JSON.stringify({requester: userA, recipient: userB}),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const notification = await fetch(process.env.REACT_APP_BASEURL+'/api/notifications/', {
            method: 'POST',
            body: JSON.stringify({
                type: "friend-request",
                target_user: userB,
                sender: userA,
                message: `You got a friend request from ${userA}`
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json();
        const notification_json = await notification.json();
        console.log(json);
        console.log(notification_json);
        setStatus(json.status);
    }

    const handleAcceptFriend = async (e) => {
        e.preventDefault();

        const response = await fetch(process.env.REACT_APP_BASEURL+'/api/friends/accept', {
            method: 'PATCH',
            body: JSON.stringify({requester: userA, recipient: userB}),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json();
        console.log(json);
        setStatus(3);
    }

    const handleRemoveFriend = async (e) => {
        e.preventDefault();

        const response = await fetch(process.env.REACT_APP_BASEURL+'/api/friends/remove', {
            method: 'PATCH',
            body: JSON.stringify({requester: userA, recipient: userB}),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json();
        console.log(json);
        setStatus(0);
    }

    const handleLogout = () => {
        logout();
    }

    return (
        <div className={styles.profilePage}>
            <div className={styles.header}>
                <div className={styles.profilePicture}>
                    {/* <img src={Member} alt="" /> */}
                    <Image 
                        cloudName={`${process.env.REACT_APP_IMAGECLOUD}`} 
                        publicId={`${userInfo.picture || "Member_qx5vfp"}`}>
                    </Image>
                </div>
                <div className={styles.profile}>
                    <div className={styles.username}>
                        <p>{params.username}</p>
                        { user.username === params.username &&
                        <div className={styles.userFunctions}>
                            <button className={styles.edit} onClick={handleEditProfile}>Edit</button>
                            <button className={styles.logout} onClick={handleLogout}>Log Out</button>
                        </div>}
                        { userA !== userB &&
                        <div className={styles.friendship}>
                            { status === -1 &&
                                <button className={styles.loading}><img src={Loading} alt="" /></button>
                            }
                            { status === 0 &&
                                <button className={styles.addFriend} onClick={handleAddFriend}>Add Friend</button>
                            }
                            { status === 1 &&
                                <button className={styles.requestedFriend}>Requested</button>
                            }
                            { status === 2 &&
                                <button className={styles.pendingFriend} onClick={handleAcceptFriend}>Accept Request</button>
                            }
                            { status === 3 &&
                                <button className={styles.removeFriend} onClick={handleRemoveFriend}>Remove Friend</button>
                            }
                        </div>}
                    </div>
                    <div className={styles.bio}>

                    </div>
                </div>
            </div>
            <div className={styles.navigation}>
                <p onClick={(e) => setDisplay("meetups")} className={display === 'meetups' ? styles['nav-current'] : ''}>Meetups</p>
                <p onClick={(e) => setDisplay("discussions")} className={display === 'discussions' ? styles['nav-current'] : ''}>Discussions</p>
                <p onClick={(e) => setDisplay("friends")} className={display === 'friends' ? styles['nav-current'] : ''}>Friends</p>
            </div>
            <div className={styles.container}>
                { display === "meetups" &&
                    <div id={styles.meetups}>
                        {meetups &&
                        meetups
                        .filter((meetup) => meetup.members.includes(userB))
                        .map((meetup) => {
                            return (
                                <MeetupCard key={meetup._id} meetup={meetup}/>
                            )
                        })}
                    </div>
                }
                { display === "discussions" &&
                    <div id={styles.discussions}>
                        discussions
                    </div>
                }
                { display === "friends" &&
                    <div id={styles.friends}>
                        {friends.map((username) => {
                            return (
                                <UserCard username={username} key={username}/>
                            )
                        })}
                    </div>
                }
            </div>
        </div>
    )
}

export default ProfilePage;