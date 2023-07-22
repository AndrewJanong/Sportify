import React, { useState, useEffect, useRef } from "react";
import styles from './MeetupInfoPage.module.css';
import Swal from 'sweetalert2';
import Success from "../../popups/Success";
import { useNavigate } from "react-router-dom";
import DateWhite from '../../icons/DateWhite.png';
import LocationWhite from '../../icons/LocationWhite.png';
import MemberWhite from '../../icons/MemberWhite.png';
import SendMessage from "../../icons/SendMessage.png";
import { useParams } from "react-router-dom";
import { useMeetupsContext } from "../../hooks/useMeetupsContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import UserCard from "../../components/UserCard/UserCard";
import { Image } from "cloudinary-react";
import Pusher from "pusher-js";
import PuffLoader from "react-spinners/PuffLoader";


const MeetupChat = (props) => {

    const params = useParams();
    const { user } = useAuthContext();
    const [text, setText] = useState('');
    const scrollRef = useRef();

    useEffect(() => {
        const pusher = new Pusher('4a38210c30f8213a34a9', {
            cluster: 'ap1'
        });

        const event = `meetup-chat-event-${params.meetupId}`;
        const channel = pusher.subscribe("sportify-chat");

        channel.bind(event, (message) => {
            props.setCurrentChat((prev) => {
                const messages = [...prev.messages, message];
                return ({...prev, messages: messages});
            })
            console.log(message);
        });

        return () => {
            pusher.unsubscribe("sportify-chat");
        }
    }, [user, params.meetupId, props])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [props.currentChat])


    let currentChat = props.currentChat;

    const handleSendMessage = async (e) => {
        e.preventDefault();
        setText('');

        const message = await fetch(process.env.REACT_APP_BASEURL+'/api/meetup-chat/'+currentChat._id, {
            method: 'PATCH',
            body: JSON.stringify({
                sender: user.userId,
                text
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })

        const message_json = await message.json();

        if (message.ok) {
            await fetch(process.env.REACT_APP_BASEURL+'/pusher/meetup-chat/'+params.meetupId, {
                method: 'POST',
                body: JSON.stringify({
                    message: message_json
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            })
        }
    }

    if (props.fetchingChat) {
        return (
            <div className={styles.chat}>
                <PuffLoader
                    color={'#3b62be'}
                    loading={true}
                    size={144}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            </div>
        )
    }

    return (
        <div className={styles.chat}>
            <div className={styles.chatContainer}>
                {currentChat && currentChat.messages && currentChat.messages.map(message => {
                    const index = currentChat.messages.findIndex((m) => m._id === message._id);
                    let containPicture = true;
                    if (index !== 0 && currentChat.messages[index-1].sender.username === message.sender.username) {
                        containPicture = false;
                    }
                    let normalMargin = true;
                    if (index < currentChat.messages.length - 1 && currentChat.messages[index+1].sender.username === message.sender.username) {
                        normalMargin = false;
                    }

                    return (
                        <div 
                            key={message._id} 
                            className={styles.message}
                            ref={scrollRef}
                            style={{
                                justifyContent: user.username === message.sender.username ? 'end' : 'start',
                                marginBottom: normalMargin ? '10px' : '2px'
                            }}
                        >
                            {(containPicture && user.username !== message.sender.username) ?
                                <Image
                                    cloudName={`${process.env.REACT_APP_IMAGECLOUD}`}
                                    publicId={`${message.sender.picture || "Member_qx5vfp"}`}>
                                </Image> :
                                <div className={styles.invisible}></div>
                            }
                            <div className={styles.text} style={{
                                backgroundColor: user.username === message.sender.username ? '#3b62be' : '#656869'
                            }}>
                                {containPicture && user.username !== message.sender.username && 
                                    <p className={styles.sender}>{message.sender.username}</p>
                                }
                                <p className={styles.content}>{message.text}</p>
                            </div>
                            {(containPicture && user.username === message.sender.username) ?
                                <Image
                                    cloudName={`${process.env.REACT_APP_IMAGECLOUD}`}
                                    publicId={`${message.sender.picture || "Member_qx5vfp"}`}>
                                </Image> :
                                <div className={styles.invisible}></div>
                            }
                        </div>
                    )
                })}
            </div>
            <form action="" onSubmit={handleSendMessage}>
                <input value={text} onChange={(e) => setText(e.target.value)}/>
                <button disabled={!text.trim()}>
                    <img src={SendMessage} alt="" />
                </button>
            </form>
        </div>
    )
}


const MeetupInfoPage = (props) => {
    const navigate = useNavigate();
    const params = useParams();
    const { meetups, dispatch } = useMeetupsContext();
    const { user } = useAuthContext();
    const [section, setSection] = useState('members');
    const [currentChat, setCurrentChat] = useState({});
    const [fetchingChat, setFetchingChat] = useState(true);

    useEffect(() => {
        const getMeetupChat = async () => {
            const chat = await fetch(process.env.REACT_APP_BASEURL+'/api/meetup-chat/'+params.meetupId, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const chat_json = await chat.json();

            if (chat.ok) {
                setCurrentChat(chat_json);
                setFetchingChat(false);
            }
        }

        if (user && meetups.filter((meetup) => meetup.members.find((member) => member.username === user.username))) {
            getMeetupChat();
        }
    }, [user, params.meetupId, meetups])

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
                    'Your meetup has been deleted.',
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
            <div className={styles.sections}>
                <p 
                    onClick={() => setSection('members')} 
                    className={section === 'members' ? styles.currentSection : ''}
                    style={!usernames.find(username => user.username === username) ? {
                        borderBottom: 'none',
                        textAlign: 'start',
                        width: '100%'} : {}}>
                        Members
                </p>
                {usernames.find(username => user.username === username) && 
                    <p onClick={() => setSection('chat')} className={section === 'chat' ? styles.currentSection : ''}>Chat</p>
                }
            </div>
            {section === 'members' &&
            <div className={styles.members}>
                <div>
                    {meetup.members.map((member) => {
                        return (
                            <UserCard user={member} key={member._id}/>
                        )
                    })}
                </div>
            </div>}
            {section === 'chat' && <MeetupChat currentChat={currentChat} setCurrentChat={setCurrentChat} fetchingChat={fetchingChat}/>}
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