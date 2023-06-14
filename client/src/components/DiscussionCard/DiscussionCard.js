import React, { useState } from "react";
import styles from './DiscussionCard.module.css';
import Swal from 'sweetalert2';
import { Image } from 'cloudinary-react';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDiscussionsContext } from "../../hooks/useDiscussionsContext";
import Success from "../../popups/Success";
import Likes from '../../icons/Likes.png';


const DiscussionCard = (props) => {
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    const navigate = useNavigate();
    const auth = useAuthContext();
    const [user, setUser] = useState(auth.user);
    const id = props.discussion._id;
    const { discussions, dispatch } = useDiscussionsContext();
    const discussion = discussions.filter(x => x._id === id)[0];
    
    const [usernames, setUsernames] = useState(discussion.likes);
    const [numLikes, setNumLikes] = useState(discussion.likes.length-1);

    const likeHandler = async (e) => {

        
        e.preventDefault();

        if (!user) {
            return;
        }

        console.log(usernames);

        if (!usernames.includes(user.username)) {
            const response = await fetch(process.env.REACT_APP_BASEURL+'/api/discussions/' + id, {
                method: 'PATCH',
                body: JSON.stringify({likes: [...usernames, user.username]}),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },

            });

            const json = await response.json();
            const newDiscussions = discussions.map((discussion) => {
                if (discussion._id === id) {
                    return json;
                } else {
                    return discussion;
                } 
            })

            if (response.ok) {
                dispatch({
                    type: 'SET_DISCUSSIONS',
                    payload: newDiscussions
                })
                Success.fire({
                    icon: 'success',
                    title: 'like added'
                })
            } else {
                console.log('error update');
            }
        } else {
            const response = await fetch(process.env.REACT_APP_BASEURL+'/api/discussions/' + id, {
                method: 'PATCH',
                body: JSON.stringify({likes: usernames.filter((u) => u!== user.username)}),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },

            });

            const json = await response.json();
            const newDiscussions = discussions.map((discussion) => {
                if (discussion._id === id) {
                    return json;
                } else {
                    return discussion;
                } 
            })

            if (response.ok) {
                dispatch({
                    type: 'SET_DISCUSSIONS',
                    payload: newDiscussions
                })
                Success.fire({
                    icon: 'success',
                    title: 'like removed'
                })
            } else {
                console.log('error update');
            }
        }
        //forceUpdate();
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

                const response = await fetch(process.env.REACT_APP_BASEURL+'/api/discussions/' + discussion._id, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                })
        
                const json = await response.json();
        
                if (response.ok) {
                    dispatch({
                        type: 'DELETE_DISCUSSION',
                        payload: json
                    })
        
                    navigate('/discussions');
                }
            }
        })
    }


    return (
        <div className={styles.discussioncard}>
            <div className={styles.header}>
                <h1>{props.discussion.title}</h1>
                <p>Created by {props.discussion.creator} <br></br> {props.discussion.date.split('T')[0]}</p>
            </div>
            <p className={styles.sports}>{props.discussion.sports}</p>
            {discussion.picture && <Image className={styles.picture}cloudName={`${process.env.REACT_APP_IMAGECLOUD}`} publicId={`${discussion.picture}`}></Image>}
            <p className={styles.text}>{props.discussion.text}</p>
            <div className={styles.info}>
                <button className={styles.likes} onClick={likeHandler}>
                    <img src={Likes} alt="" />
                    <p>{numLikes}</p>
                </button>
                {user.username === discussion.creator && <button className={styles.delete} onClick={handleDelete}>Delete
                </button>}
            </div>
        </div>

    );
}
 
export default DiscussionCard;