/* eslint-disable */

import React, { useEffect, useState } from "react";
import styles from './DiscussionsPage.module.css';
import { useAuthContext } from "../../hooks/useAuthContext";



const DiscussionsPage = (props) => { 
    //const { discussions, dispatch } = useDiscussionsContext();
    //const { user } = useAuthContext();
    const [sports, setSports] = useState('Any');

    const ListOfSports = ['Any', 'Basketball', 'Soccer', 'Voleyball', 'Badminton', 'Table Tennis', 'Tennis'];

    return (
        <div className={styles.discussionsPage}>
            testssss
        </div>
        // <div className={styles.discussionsPage}>
        //     <div className={styles.filter}>
        //         <div className={styles.sportsFilter}>
        //             <p>Sports:</p>
        //             <select name="" id="" value={sports} onChange={(e) => setSports(e.target.value)}>
        //                 {
        //                     ListOfSports.map(sport =>
        //                         <option
        //                             key={sport}
        //                             value={sport}
        //                         >
        //                                 {sport}
        //                         </option>
        //                     )
        //                 }
        //             </select>
        //         </div>
        //     </div>
        //     <div className={styles.discussions}>
        //         {discussions &&
        //         discussions.filter((discussion) => {
        //             if (sports === 'Any') {
        //                 return true;
        //             } else {
        //                 return sports === discussion.sports
        //             }
        //         })
        //         .map((discussion) => {
        //             return (
        //                 <DiscussionCard key={discussion.id} discussion= {discussion} />
        //             )
        //         })}
        //     </div>
        // </div>
    )
}


/* eslint-enable */

export default DiscussionsPage;

