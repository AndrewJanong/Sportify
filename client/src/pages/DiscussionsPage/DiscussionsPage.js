import React, { useEffect, useState } from "react";
import styles from './DiscussionsPage.module.css';
import DiscussionCard from "../../components/DiscussionCard/DiscussionCard";
import { useDiscussionsContext } from "../../hooks/useDiscussionsContext";
import { useAuthContext } from "../../hooks/useAuthContext";

const DiscussionsPage = (props) => {
    const { discussions, dispatch } = useDiscussionsContext();
    const { user } = useAuthContext();
    const [sports, setSports] = useState('Any');

    const ListOfSports = ['Any', 'Basketball', 'Soccer', 'Voleyball', 'Badminton', 'Table Tennis', 'Tennis'];

    useEffect(() => {
        const fetchDiscussions = async () => {
            const response = await fetch(process.env.REACT_APP_BASEURL+'/api/discussions', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                dispatch({
                    type: 'SET_DISCUSSIONS',
                    payload: json
                })
            }
        }

        if (user) {
            fetchDiscussions();
        }
    }, [dispatch, user])

    return (
        <div className={styles.discussionspage}>
            <div className={styles.filter}>
                <div className={styles.sportsFilter}>
                    <p>Sports:</p>
                    <select name="" id="" value={sports} onChange={(e) => setSports(e.target.value)}>
                        {
                            ListOfSports.map(sport =>
                                <option
                                    key={sport}
                                    value={sport}
                                >
                                        {sport}
                                </option>
                            )
                        }
                    </select>
                </div>
            </div>
            <div className={styles.discussions}>
                {discussions &&
                discussions.filter((discussion) => {
                    if (sports === 'Any') {
                        return true;
                    } else {
                        return sports === discussion.sports
                    }
                })
                .map((discussion) => {
                    return (
                        <DiscussionCard key={discussion._id} discussion={discussion} />
                    )
                })}
            </div>
        </div>
    )
}

export default DiscussionsPage;