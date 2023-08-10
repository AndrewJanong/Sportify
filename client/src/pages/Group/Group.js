import React, { useState, useEffect, useRef } from "react";
import styles from './Group.module.css';
import { useAuthContext } from "../../hooks/useAuthContext";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Image } from "cloudinary-react";
import Pusher from "pusher-js";
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

    useEffect(() => {
        const pusher = new Pusher('4a38210c30f8213a34a9', {
            cluster: 'ap1'
        });

        const event = `chat-event-${params.id}`;

        // Subscribe to Pusher channel
        const channel = pusher.subscribe("sportify-chat");

        // Change messages state when someone sends a message
        channel.bind(event, (message) => {
            setCurrentChat((prev) => {
                const messages = [...prev.messages, message];
                return ({...prev, messages: messages});
            })
        });

        // When leaving page, unsubscribe from Pusher channel
        return () => {
            pusher.unsubscribe("sportify-chat");
        }
    }, [user, params.id])

    useEffect(() => {
        // Fetch current group info
        const getGroupInfo = async () => {
            const response = await fetch(process.env.REACT_APP_BASEURL+'/api/groups/'+params.id, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (json && json.test) {
                setGroupInfo(json);
                setLoading(false);
            }

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
        // Fetch current group chat
        const getGroupChat = async () => {
            const chat = await fetch(process.env.REACT_APP_BASEURL+'/api/group-chat/'+params.id, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const chat_json = await chat.json();

            if (chat_json && chat_json.test) {
                setFetchingChat(false);
            }

            if (chat.ok) {
                setCurrentChat(chat_json);
                setFetchingChat(false);
            }
        }

        if (user) {
            getGroupChat();
        }
    }, [user, params.id])

    // To always scroll to last message sent
    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [currentChat])


    // Handle a user sending a message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        setText('');

        if (user.test) {
            if (props.testCallback) props.testCallback();
            return;
        }

        // Send PATCH request to the backend
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
            // This POST request will trigger an event that will be sent to all users subscribed to the Pusher channel
            await fetch(process.env.REACT_APP_BASEURL+'/pusher/chat/'+params.id, {
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

    // If group info or group chat has not been fetched, display loading page
    if (loading || fetchingChat) {
        return <LoadingPage />;
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.groupName}>
                    <Image
                        cloudName={`${process.env.REACT_APP_IMAGECLOUD}`}
                        publicId={`${groupInfo.picture || "ezpvrwy02j9wt9uzn20s"}`}>
                    </Image>
                    <h1>{groupInfo.name}</h1>
                </div>
                <div className={styles.groupOptions}>
                    <button id={styles.info} onClick={() => navigate('/group/info/'+params.id)}>Group Info</button>
                    <button id={styles.createMeetup} onClick={() => navigate('/newmeetup/'+params.id)}>Create Meetup</button>
                </div>
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
                    <input value={text} onChange={(e) => setText(e.target.value)} data-testid="chat-input"/>
                    <button disabled={!text.trim()} data-testid="send-message-button">
                        <img src={SendMessage} alt="" />
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Group;