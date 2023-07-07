import React, { useEffect, useState } from "react";
import { Image } from 'cloudinary-react';
import styles from './ProfilePage.module.css';
import Loading from '../../icons/Loading.gif';
import { useNavigate } from "react-router-dom";
import UserCard from "../../components/UserCard/UserCard";
import MeetupCard from "../../components/MeetupCard/MeetupCard";
import DiscussionCard from "../../components/DiscussionCard/DiscussionCard";
import { useParams } from "react-router-dom";
import { useLogout } from '../../hooks/useLogout';
import { useAuthContext } from "../../hooks/useAuthContext";
import { useMeetupsContext } from "../../hooks/useMeetupsContext";
import { useDiscussionsContext } from "../../hooks/useDiscussionsContext";

const ProfilePage = (props) => {
    const params = useParams();
    const navigate = useNavigate();
    const { logout } = useLogout();
    const meetupsContext = useMeetupsContext();
    const meetups = meetupsContext.meetups;
    const meetupsDispatch = meetupsContext.dispatch;
    const discussionsContext = useDiscussionsContext();
    const discussions = discussionsContext.discussions;
    const discussionsDispatch = discussionsContext.dispatch;
    const { user } = useAuthContext();
    const [status, setStatus] = useState(-1);
    const [display, setDisplay] = useState('friends');
    const [friends, setFriends] = useState([]);
    const [userInfo, setUserInfo] = useState({});
    const [userNotifications, setUserNotifications] = useState([]);

    const handleEditProfile = (e) => {
        e.preventDefault();
        navigate(`/edit/${params.userId}`);
    }

    const userA = user.userId;
    const userB = params.userId;

    useEffect(() => {
        const getFriendshipStatus = async () => {
            const response = await fetch(process.env.REACT_APP_BASEURL+'/api/friends/'+userB, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();
            console.log(json);
            
            if (response.ok) {
                setDisplay('friends');
                if (json) setStatus(json.status);
                if (!json) setStatus(0);
            }
        }

        const getFriends = async () => {
            const response = await fetch(process.env.REACT_APP_BASEURL+'/api/friends/accepted/'+userB, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();
            console.log(json);
            
            if (response.ok) {
                setFriends(json.map((friendship) => friendship.recipient));
                setDisplay('friends');
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
                meetupsDispatch({
                    type: 'SET_MEETUPS',
                    payload: json
                })
            }
        }

        const fetchDiscussions = async () => {
            const response = await fetch(process.env.REACT_APP_BASEURL+'/api/discussions', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                discussionsDispatch({
                    type: 'SET_DISCUSSIONS',
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

        const fetchUserNotifications = async () => {
            const response = await fetch(process.env.REACT_APP_BASEURL+'/api/user-notifications/'+userA, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                setUserNotifications(json);
                console.log(json);
            }
        }

        if (user) {
            if (userA !== userB) getFriendshipStatus();
            getFriends();
            fetchMeetups();
            fetchDiscussions();
            getUserInfo();
            fetchUserNotifications();
        }
    }, [meetupsDispatch, discussionsDispatch, status, user, userA, userB])

    console.log('user notifications');
    console.log(userNotifications);

    const handleAddFriend = async (e) => {
        e.preventDefault();

        const response = await fetch(process.env.REACT_APP_BASEURL+'/api/friends/request', {
            method: 'POST',
            body: JSON.stringify({requester: userA, recipient: userB}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })

        const notification = await fetch(process.env.REACT_APP_BASEURL+'/api/user-notifications/', {
            method: 'POST',
            body: JSON.stringify({
                type: 'friend-request',
                target_user: userB,
                sender: userA,
                message: `You got a friend request from ${user.username}`
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
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
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })

        const notif_id = userNotifications
            .filter((notification) => notification.sender._id === userB && 
                                      notification.target_user._id === userA)[0]._id;

        const deleted = await fetch(process.env.REACT_APP_BASEURL+'/api/user-notifications/'+notif_id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        const notification_response = await fetch(process.env.REACT_APP_BASEURL+'/api/user-notifications/', {
            method: 'POST',
            body: JSON.stringify({
                type: 'message',
                target_user: userB,
                sender: userA,
                message: `${user.username} has accepted your friend request!`
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
            

        const json = await response.json();
        const deleted_json = await deleted.json();
        const notification_response_json = await notification_response.json();
        
        console.log(json);
        console.log(deleted_json);
        console.log(notification_response_json);
        setStatus(3);
    }

    const handleRejectFriend = async (e) => {
        e.preventDefault();

        const response = await fetch(process.env.REACT_APP_BASEURL+'/api/friends/reject', {
            method: 'PATCH',
            body: JSON.stringify({requester: userA, recipient: userB}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })

        console.log(userNotifications);

        const notif_id = userNotifications
            .filter((notification) => notification.sender._id === userB && 
                                      notification.target_user._id === userA)[0]._id;


        const deleted = await fetch(process.env.REACT_APP_BASEURL+'/api/user-notifications/'+notif_id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        const notification_response = await fetch(process.env.REACT_APP_BASEURL+'/api/user-notifications/', {
            method: 'POST',
            body: JSON.stringify({
                type: 'message',
                target_user: userB,
                sender: userA,
                message: `${user.username} has rejected your friend request!`
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
            

        const json = await response.json();
        const deleted_json = await deleted.json();
        const notification_response_json = await notification_response.json();
        
        console.log(json);
        console.log(deleted_json);
        console.log(notification_response_json);
        setStatus(0);
    }

    const handleRemoveFriend = async (e) => {
        e.preventDefault();

        const response = await fetch(process.env.REACT_APP_BASEURL+'/api/friends/remove', {
            method: 'PATCH',
            body: JSON.stringify({requester: userA, recipient: userB}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
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
                    <Image 
                        cloudName={`${process.env.REACT_APP_IMAGECLOUD}`} 
                        publicId={`${userInfo.picture || "Member_qx5vfp"}`}>
                    </Image>
                </div>
                <div className={styles.profile}>
                    <div className={styles.username}>
                        <p>{userInfo.username}</p>
                        { user.userId === params.userId &&
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
                                <button className={styles.pendingFriend} onClick={handleAcceptFriend}>Accept</button>
                            }
                            { status === 2 &&
                                <button className={styles.rejectFriend} onClick={handleRejectFriend}>Reject</button>
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
                        {discussions &&
                        discussions
                        .filter((discussion) => discussion.creator.includes(userB))
                        .map((discussion) => {
                            return (
                                <DiscussionCard key={discussion._id} discussion={discussion}/>
                            )
                        })}
                    </div>
                }
                { display === "friends" &&
                    <div id={styles.friends}>
                        {friends.map((user) => {
                            return (
                                <UserCard user={user} key={user._id}/>
                            )
                        })}
                    </div>
                }
            </div>
        </div>
    )
}

export default ProfilePage;