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

    const addMember = async (member) => {
        const request = await fetch(process.env.REACT_APP_BASEURL+'/api/group-requests/', {
            method: 'POST',
            body: JSON.stringify({
                group: groupInfo.name,
                groupId: groupInfo._id,
                target: member
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })

        const notification = await fetch(process.env.REACT_APP_BASEURL+'/api/notifications/', {
            method: 'POST',
            body: JSON.stringify({
                type: "group-request",
                target_user: member,
                sender: groupInfo._id,
                message: `You have been invited to join ${groupInfo.name}`
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const json_request = await request.json();
        const json_notification = await notification.json();

        console.log(json_request);
        console.log(json_notification);
    }

    const handleAddMember = () => {
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
              return fetch(process.env.REACT_APP_BASEURL+'/api/user/'+username)
                .then(response => {
                  if (!response.ok) {
                    console.log(response.json());
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
                if (groupInfo.members.includes(result.value.username)) {
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
                            addMember(result.value.username);
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

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <Image
                    cloudName={`${process.env.REACT_APP_IMAGECLOUD}`}
                    publicId={`${groupInfo.picture || "ezpvrwy02j9wt9uzn20s"}`}>
                </Image>
                <div style={{display: 'flex', alignItems: 'center'}} >
                    <h1>{groupInfo.name}</h1>
                    {groupInfo.members && groupInfo.members.includes(user.username) &&
                    <button id={styles.editButton} onClick={() => navigate("/group/edit/"+params.id)}>Edit</button>}
                </div>
                <p>Sports: {groupInfo.sports}</p>
                
            </div>
            <div className={styles.members}>
                <div className={styles.memberHeader}>
                    <h2>Members</h2>
                    {groupInfo.members && groupInfo.members.includes(user.username) &&
                    <button id={styles.addMemberButton} onClick={handleAddMember}>Add Member</button>}
                </div>
                <div className={styles.membersContainer}>
                    {groupInfo.members &&
                        groupInfo.members.map((member) => <UserCard username={member} pictureOnly={false} key={member}/>)
                    }
                </div>
            </div>
            {groupInfo.members && groupInfo.members.includes(user.username) &&
            <button id={styles.chatButton} onClick={() => navigate('/group/'+params.id)}>Chat</button>}
        </div>
    )
}

export default GroupInfoPage;