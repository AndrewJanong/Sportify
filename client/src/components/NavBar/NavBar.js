import React from 'react';
import styles from './NavBar.module.css';
import Logo from '../../icons/Logo.png';
import Section from './Section';
import NewMeetup from './NewMeetup';

const NavBar = (props) => {

    return (
        <div className={styles.navbar}>
            <div className={styles.top}>
                <img src={Logo} alt="" />
                <div className={styles.sections}>
                    <Section section={'Meetups'} />
                    <Section section={'Discussions'} />
                </div>
            </div>
            <div className={styles.bottom}>
                <NewMeetup />
                <p>Profile</p>
            </div>
        </div>
    )
}

export default NavBar;