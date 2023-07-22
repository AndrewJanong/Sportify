import React, { useEffect, useState } from "react";
import styles from './CommentCard.module.css';
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const CommentCard = (props) => {
    const [show, setShow] = useState(false);
    const [showReply, setShowReply] = useState(false);
    const [commentForm, setCommentForm] = useState('');

    setTimeout(4000);

    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [repliesList, setRepliesList] = useState(props.comment.replies);
    const [repliesObject, setRepliesObject] = useState(props.comment.replies);
    const [error, setError] = useState('');
    
    console.log(props.comment);
    console.log(repliesObject);

    const handleReply = async (e) => {
        if (showReply) {
            setShowReply(false);
        } else {
            setShowReply(true);
        }
    }
    
    const handleShow = async (e) => {
        if (show) {
            setShow(false);
        } else {
            setShow(true);
        }
    }

    const handleClick = async (e) => {
        e.preventDefault();

        if (!commentForm) {
            return;
        }

        //Adding comment to DB
        const comment = {text: commentForm, replies:[], creator: user.userId}; //RECHECK THIS

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
            console.log("comment not posted!")
            setError(json1.error);
        } else {
            console.log('New reply added!');
        }

        const replyId = json1._id;

        //patch parrent comment
        const response2 = await fetch(process.env.REACT_APP_BASEURL+'/api/comments/' + props.comment._id, {
            method: 'PATCH',
            body: JSON.stringify({replies: [...repliesList, replyId]}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },

        });
        if (response2.ok) {
            console.log("reply good");
            setRepliesList([...repliesList, replyId]);
            console.log(commentForm);
            setRepliesObject([...repliesObject, {text: commentForm, replies:[], creator: user}]);
            setCommentForm('');
        }
        setShow(true);

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

                const response1 = await fetch(process.env.REACT_APP_BASEURL+'/api/comments/' + props.comment._id, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                })
        
                const json1 = await response1.json();

                const response2 = await fetch(process.env.REACT_APP_BASEURL+'/api/discussions/' + props.discussion._id, {
                    method: 'PATCH',
                    body: JSON.stringify({comments: props.discussion.comments.filter((id) => id !== props.comment)}),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
    
                });

                const json2 = await response2.json();
        
                if (response2.ok) {  
                    console.log("went here");
                    document.location.reload();
                    navigate('/discussions');
                }
            }
        })
    }

    return ( 
        props.comment && <div className={styles.indComment} key={props.comment._id}>
            <p>{props.comment.creator && props.comment.creator.username}</p> 
            <div>{props.comment.text}</div>
            <button onClick={handleReply}>{showReply ? "Cancel" : "Reply"}</button>
            {repliesObject.length > 1 && <button onClick={handleShow}>{show ? "Hide Reply" : "Show Reply"}</button>}

            {(user.userId === props.comment.creator._id || user.userId === props.comment.creator.userId) && <button className={styles.delete} onClick={handleDelete}>Delete</button>}
            {showReply && <div className={styles.form}>
                <input 
                    maxLength = {400}
                    type="text" 
                    onChange={(e) => setCommentForm(e.target.value)}
                    value={commentForm}
                />
                <button onClick={handleClick} disabled={commentForm === ''} className={styles.commentButton}>Comment</button>
            </div>}
            

            <div className={styles.replies}>
                {repliesObject.length !== 0
                && repliesObject
                    .filter((reply) => show ? true : reply === repliesObject[0])
                    .map((reply) => {
                        console.log(reply)
                    return ( reply &&
                        <div className={styles.reply}>
                            <p className={styles.uName}>{reply.creator && reply.creator.username}</p>
                            <p className={styles.body}>{reply.text}</p>
                        </div>
                        
                    )
                })}
            </div>
        </div>
     );
}
 
export default CommentCard;