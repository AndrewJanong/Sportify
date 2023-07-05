import React, { useState, useEffect, useRef } from "react";
import styles from './Group.module.css';
import { useAuthContext } from "../../hooks/useAuthContext";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Image } from "cloudinary-react";
import { io } from "socket.io-client";
import LoadingPage from "../LoadingPage/LoadingPage";
import SendMessage from "../../icons/SendMessage.png";

const Group = (props) => {
    const params = useParams();
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [groupInfo, setGroupInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [fetchingChat, setFetchingChat] = useState(true);
    const [text, setText] = useState('');
    const [currentChat, setCurrentChat] = useState({});
    const scrollRef = useRef();
    const socket = useRef();

    useEffect(() => {
        socket.current = io(process.env.REACT_APP_SOCKET);
        socket.current.on("getMessage", (message) => {
            params.id === message.chat.group && setCurrentChat((prev) => {
                const messages = [...prev.messages, message];
                return ({...prev, messages: messages});
            })
        });
        
    }, [user, currentChat._id, params.id]);

    useEffect(() => {
        socket.current.emit("addUser", user.username);
        socket.current.on("getUsers", users => {
            console.log(users);
        })
    }, [user]);

    useEffect(() => {
        const getGroupInfo = async () => {
            const response = await fetch(process.env.REACT_APP_BASEURL+'/api/groups/'+params.id, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                setGroupInfo(json);
                setLoading(false);
            }
        }

        if (user) {
            getGroupInfo();
        }
    }, [user, params.id])

    useEffect(() => {
        const getGroupChat = async () => {
            const chat = await fetch(process.env.REACT_APP_BASEURL+'/api/group-chat/'+params.id, {
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

        if (user) {
            getGroupChat();
        }
    }, [user, params.id])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [currentChat])

    const handleSendMessage = async (e) => {
        e.preventDefault();
        setText('');

        const message = await fetch(process.env.REACT_APP_BASEURL+'/api/group-chat/'+currentChat._id, {
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
            socket.current.emit("sendMessage", {
                message: message_json,
                groupMembers: groupInfo.members
            });
        }
    }

    if (loading || fetchingChat) {
        return <LoadingPage />;
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <Image
                    cloudName={`${process.env.REACT_APP_IMAGECLOUD}`}
                    publicId={`${groupInfo.picture || "ezpvrwy02j9wt9uzn20s"}`}>
                </Image>
                <h1>{groupInfo.name}</h1>
                <button id={styles.info} onClick={() => navigate('/group/info/'+params.id)}>Group Info</button>
                <button id={styles.createMeetup} onClick={() => navigate('/newmeetup/'+params.id)}>Create Meetup</button>
            </div>
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
                                    <p>{message.text}</p>
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
        </div>
    )
}

export default Group;