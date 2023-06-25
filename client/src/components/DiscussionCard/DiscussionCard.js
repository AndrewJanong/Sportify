import React, { useState } from "react";
import styles from './DiscussionCard.module.css';
import Swal from 'sweetalert2';
import { Image } from 'cloudinary-react';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDiscussionsContext } from "../../hooks/useDiscussionsContext";
import Likes from '../../icons/Likes.png';


const DiscussionCard = (props) => {
    const navigate = useNavigate();
    const auth = useAuthContext();
    const user = auth.user;
    const id = props.discussion._id;
    
    const { discussions, dispatch } = useDiscussionsContext();
    const discussion = discussions.filter(x => x._id === id)[0];

    const [likesList, setLikesList] = useState(discussion.likes);
    
    const [commentForm, setCommentForm] = useState('');
    const [commentsList, setCommentsList] = useState(discussion.comments);
    const [show, setShow] = useState(false);

    const likeHandler = async (e) => {
        e.preventDefault();

        if (!likesList.includes(user.username)) { 
            const response = await fetch(process.env.REACT_APP_BASEURL+'/api/discussions/' + id, {
                method: 'PATCH',
                body: JSON.stringify({likes: [...likesList, user.username]}),
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
  
                setLikesList([...likesList, user.username]);
            } else {
                console.log('error update');
            }
        } else {
            const response = await fetch(process.env.REACT_APP_BASEURL+'/api/discussions/' + id, {
                method: 'PATCH',
                body: JSON.stringify({likes: likesList.filter((u) => u!== user.username)}),
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
                setLikesList(likesList.filter((u) => u!== user.username));
            } else {
                console.log('error update');
            }
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
                    'Your discussion has been deleted.',
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

    const handleClick = async (e) => {
        e.preventDefault();

        if (!commentForm) {
            return;
        }

        const response = await fetch(process.env.REACT_APP_BASEURL+'/api/discussions/' + id, {
            method: 'PATCH',
            body: JSON.stringify({comments: [...commentsList, {uName: user.username, comment: commentForm}]}),
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
            setCommentsList([...commentsList, {uName: user.username, comment: commentForm}]);
            setCommentForm('');
            setShow(true);
        } else {
            console.log('error update');
        }
    }

    const handleShow = async (e) => {
        if (show) {
            setShow(false);
        } else {
            setShow(true);
        }
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
                <button className={likesList.includes(user.username) ? styles.likesafter : styles.likes} onClick={likeHandler} >
                    <img src={Likes} alt="" />
                    <p>{likesList.length-1}</p>
                </button>
                {user.username === discussion.creator && <button className={styles.delete} onClick={handleDelete}>Delete
                </button>}
            </div>

            {/*start of comment section*/}
            <h3>Comments</h3>
            <div className={styles.form}>
                <input 
                    maxLength = {400}
                    type="text" 
                    onChange={(e) => setCommentForm(e.target.value)}
                    value={commentForm}
                />
                <button onClick={handleClick}>Comment</button>
                <button onClick={handleShow}>{show ? "Show Less" : "Show More"}</button>
            </div>

            <div className={styles.comments}>
                {commentsList.length !== 1
                ? commentsList
                    .filter((comment) => show ? true : comment === commentsList[1])
                    .filter((comment) => comment !== commentsList[0])
                    .map((comment) => {
                    return (
                        <div className={styles.indComment}>
                            <p>{comment.uName}</p> 
                            {comment.comment}
                        </div>
                    )
                })
                : <div className={styles.indComment}>No Comment</div>}
            </div>
           
        </div>

    );
}
 
export default DiscussionCard;