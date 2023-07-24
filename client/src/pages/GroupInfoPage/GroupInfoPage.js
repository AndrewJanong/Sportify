import React, { useState, useEffect } from "react";
import styles from './GroupInfoPage.module.css';
import { useAuthContext } from "../../hooks/useAuthContext";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import UserCard from "../../components/UserCard/UserCard";
import { Image } from "cloudinary-react";
import LoadingPage from "../LoadingPage/LoadingPage";


const GroupInfoPage = (props) => {
    const params = useParams();
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [groupInfo, setGroupInfo] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

    if (loading) {
        return <LoadingPage />;
    }

    const addMember = async (memberId) => {
        await fetch(process.env.REACT_APP_BASEURL+'/api/group-requests/', {
            method: 'POST',
            body: JSON.stringify({
                group: groupInfo._id,
                target: memberId
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })

        await fetch(process.env.REACT_APP_BASEURL+'/api/group-notifications/', {
            method: 'POST',
            body: JSON.stringify({
                type: "group-request",
                target_user: memberId,
                sender: groupInfo._id,
                message: `You have been invited to join ${groupInfo.name}`
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    const handleAddMember = () => {
        if (user.test) {
            if (props.testCallback) props.testCallback();
            return;
        }

        Swal.fire({
            title: 'Find username',
            input: 'text',
            inputAttributes: {
              autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Look up',
            showLoaderOnConfirm: true,
            preConfirm: (username) => {
              return fetch(process.env.REACT_APP_BASEURL+'/api/user/username/'+username)
                .then(response => {
                  if (!response.ok) {
                    throw new Error(response.statusText);
                  }
                  return response.json()
                })
                .catch(error => {
                  Swal.showValidationMessage(
                    `Request failed: ${error}`
                  )
                })
            },
            allowOutsideClick: () => !Swal.isLoading()
          }).then((result) => {
            if (result.isConfirmed) {
                if (groupInfo.members.map(member => member.username).includes(result.value.username)) {
                    Swal.fire({
                        title: `${result.value.username} is already in the group`,
                    })
                } else {
                    Swal.fire({
                        title: `Invite ${result.value.username} to the group?`,
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Invite'
                    }).then((res) => {
                        if (res.isConfirmed) {
                            addMember(result.value._id);
                            Swal.fire(
                                'Invitation sent!',
                                `An invitation has been sent to ${result.value.username}`,
                                'success'
                            )
                        }
                    })
                }
            }
          })
    }

    const handleDelete = async (e) => {
        e.preventDefault();
        if (user.test) {
            if (props.testCallback) props.testCallback();
            return;
        }

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
                await fetch(process.env.REACT_APP_BASEURL+'/api/groups/' + params.id, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                })

                Swal.fire(
                    'Deleted!',
                    'Your group has been deleted.',
                    'success'
                )

                navigate('/mygroups');
        
            }
        })
        
    }

    const handleLeave = (e) => {
        e.preventDefault();

        if (user.test) {
            if (props.testCallback) props.testCallback();
            return;
        }

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
                await fetch(process.env.REACT_APP_BASEURL+'/api/groups/remove_member/' + params.id, {
                    method: 'PATCH',
                    body: JSON.stringify({member: user.userId}),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
        
                });

                Swal.fire(
                    'Left!',
                    'You have left the group',
                    'success'
                )

                navigate('/mygroups');
            }
        })
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <Image
                    cloudName={`${process.env.REACT_APP_IMAGECLOUD}`}
                    publicId={`${groupInfo.picture || "ezpvrwy02j9wt9uzn20s"}`}>
                </Image>
                <div style={{display: 'flex', alignItems: 'center'}} >
                    <h1>{groupInfo.name}</h1>
                    <div className={styles.groupOptions}>
                        {groupInfo.captain && groupInfo.captain.username === user.username &&
                        <button id={styles.editButton} onClick={() => navigate("/group/edit/"+params.id)} data-testid="edit-button">Edit</button>}

                        {groupInfo.captain && groupInfo.captain.username === user.username &&
                        <button id={styles.deleteButton} onClick={handleDelete} data-testid="delete-button">Delete</button>}

                        {groupInfo.captain && groupInfo.captain.username !== user.username &&
                        groupInfo.members && groupInfo.members.map(member => member.username).includes(user.username) && 
                        <button id={styles.leaveButton} onClick={handleLeave} data-testid="leave-button">Leave</button>}
                    </div>
                </div>
                <p>Sports: {groupInfo.sports}</p>
                <div className={styles.groupOptionsMobile}>
                    {groupInfo.captain && groupInfo.captain.username === user.username &&
                    <button id={styles.editButton} onClick={() => navigate("/group/edit/"+params.id)}>Edit</button>}
                    
                    {groupInfo.captain && groupInfo.captain.username === user.username &&
                    <button id={styles.deleteButton} onClick={handleDelete}>Delete</button>}

                    {groupInfo.captain && groupInfo.captain.username !== user.username &&
                    groupInfo.members && groupInfo.members.map(member => member.username).includes(user.username) && 
                    <button id={styles.leaveButton} onClick={handleLeave}>Leave</button>}
                </div>
                
            </div>
            <div className={styles.members}>
                <div className={styles.memberHeader}>
                    <h2>Members</h2>
                    {groupInfo.captain && groupInfo.captain.username === user.username &&
                    <button id={styles.addMemberButton} onClick={handleAddMember} data-testid="add-button">Add</button>}
                </div>
                <div className={styles.membersContainer}>
                    {groupInfo.members &&
                        groupInfo.members.map((member) => 
                        <div>
                            {member.username === groupInfo.captain.username && <p className={styles.captain}>captain</p>}
                            <UserCard user={member} pictureOnly={false} key={member._id}/>
                        </div>)
                    }
                </div>
            </div>
            {groupInfo.members && groupInfo.members.map(member => member.username).includes(user.username) &&
            <button id={styles.chatButton} onClick={() => navigate('/group/'+params.id)}>Chat</button>}
        </div>
    )
}

export default GroupInfoPage;