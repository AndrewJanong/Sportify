import React, { useEffect, useState } from "react";
import styles from './DiscussionCard.module.css';
import Swal from 'sweetalert2';
import { Image } from 'cloudinary-react';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDiscussionsContext } from "../../hooks/useDiscussionsContext";
import Likes from '../../icons/Likes.png';
import CommentCard from "../CommentCard/CommentCard";


const DiscussionCard = (props) => {
    const navigate = useNavigate();
    const auth = useAuthContext();
    const user = auth.user;
    const id = props.discussion._id;
    const [error, setError] = useState('');
    
    const { discussions, dispatch } = useDiscussionsContext();
    const [discussion, setDiscussion] = useState(props.discussion);

    const [likesList, setLikesList] = useState(discussion.likes);
    
    const [commentForm, setCommentForm] = useState('');
    const [commentsList, setCommentsList] = useState(discussion.comments);
    const [commentsObject, setCommentsObject] = useState(discussion.comments);
    const [show, setShow] = useState(false);

    const name = discussion.creator.username;

    // handling like action
    const likeHandler = async (e) => {
        e.preventDefault();

        // if the user never like the post
        if (!likesList.includes(user.userId)) { 
            const response = await fetch(process.env.REACT_APP_BASEURL+'/api/discussions/' + id, {
                method: 'PATCH',
                body: JSON.stringify({likes: [...likesList, user.userId]}),
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
  
                setLikesList([...likesList, user.userId]);
            } else {
                console.log('error update');
            }
        } else { // if the user already like the post
            const response = await fetch(process.env.REACT_APP_BASEURL+'/api/discussions/' + id, {
                method: 'PATCH',
                body: JSON.stringify({likes: likesList.filter((u) => u!== user.userId)}),
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
                setLikesList(likesList.filter((u) => u!== user.userId));
            } else {
                console.log('error update');
            }
        }

    }

    // handle the deletion of discussion
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

    const handleClick = async (e) => { //handle submittiong comment
        e.preventDefault();

        if (!commentForm) {
            return;
        }

        //Adding comment to DB
        const comment = {text: commentForm, replies:[], creator: user.userId};

        const response1 = await fetch(process.env.REACT_APP_BASEURL+'/api/comments', {
            method: 'POST',
            body: JSON.stringify(comment),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });

        const json1 = await response1.json();

        if (!response1.ok) {
            setError(json1.error);
        } else {
            dispatch({
                type: 'CREATE_COMMENT',
                payload: json1
            })
        }

        const commentId = json1._id;

        //patch discussion
        const response2 = await fetch(process.env.REACT_APP_BASEURL+'/api/discussions/' + id, {
            method: 'PATCH',
            body: JSON.stringify({comments: [...commentsList, commentId]}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },

        });

        const json2 = await response2.json();
        const newDiscussions = discussions.map((discussion) => {
            if (discussion._id === id) {
                return json2;
            } else {
                return discussion;
            } 
        })

        if (response2.ok) {
            dispatch({
                type: 'SET_DISCUSSIONS',
                payload: newDiscussions
            })
            setCommentsList([...commentsList, commentId]);
            setCommentsObject([...commentsObject, {_id: commentId, text: commentForm, replies:[], creator: user}])
            setCommentForm('');
            setShow(true);
        } else {
            console.log('error update');
        }
    }

    // handle showing more or less comments
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
                <h1>{discussion.title}</h1>
                <p>Created by {name} <br></br> {props.discussion.date.split('T')[0]}</p>
            </div>
            <p className={styles.sports}>{discussion.sports}</p>
            {discussion.picture && <Image className={styles.picture}cloudName={`${process.env.REACT_APP_IMAGECLOUD}`} publicId={`${discussion.picture}`}></Image>}
            <p className={styles.text}>{discussion.text}</p>
            <div className={styles.info}>
                <button className={likesList.includes(user.userId) ? styles.likesafter : styles.likes} onClick={likeHandler} data-testid="likestest" >
                    <img src={Likes} alt="" />
                    <p>{likesList.length}</p>
                </button>
                {user.username === name && <button className={styles.delete} onClick={handleDelete} data-testid="deletetest">Delete
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
                <button onClick={handleClick} disabled={commentForm === ''} id={styles.commentButton} data-testid="commenttest">Comment</button>
                <button onClick={handleShow} data-testid="showtest">{show ? "Show Less" : "Show More"}</button>
            </div>

            <div className={styles.comments}>
                {commentsObject.length !== 0
                ? commentsObject
                    .filter((comment) => show ? true : comment === commentsObject[0])
                    .map((comment) => {
                    return (
                        comment && <CommentCard key={comment._id} comment={comment} discussion={props.discussion} />
                    )
                })
                : <div className={styles.indComment}>No Comment</div>}
            </div>
           
        </div>

    );
}
 
export default DiscussionCard;