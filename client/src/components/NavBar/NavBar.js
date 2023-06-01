import React from 'react';
import styles from './NavBar.module.css';
import { Link } from 'react-router-dom';
import Logo from '../../icons/Logo.png';
import Section from './Section';
import { useAuthContext } from '../../hooks/useAuthContext';

const NavBar = (props) => {

    const { user } = useAuthContext();

    return (
        <div className={styles.navbar}>
            <div className={styles.top}>
                <img src={Logo} alt="" />
                <div className={styles.sections}>
                    <Link to="/mymeetups" style={{ textDecoration: 'none', width: '100%'}}>
                        <Section section={'My Meetups'} />
                    </Link>
                    <Link to="/meetups" style={{ textDecoration: 'none', width: '100%' }}>
                        <Section section={'Meetups'} />
                    </Link>
                    <Link to="/discussions" style={{ textDecoration: 'none', width: '100%' }}>
                        <Section section={'Discussions'} />
                    </Link>
                </div>
            </div>
            <div className={styles.bottom}>
                { !user && 
                <div className={styles.loggedout}>
                    <Link to="/login" style={{ textDecoration: 'none' }} >
                        <button type='button' className={styles.login}>
                            Login
                        </button>
                    </Link>
                </div>}
                { user &&
                <div className={styles.loggedin}> 
                    <Link to="/newmeetup" style={{ textDecoration: 'none' }}>
                        <button type='button' className={styles.createmeetup}>
                            Create a Meetup
                        </button>
                    </Link>
                    <div>
                        <div className={styles.user} onClick={(e) => console.log(user.token)}>
                            <Link to={`/profile/${(user.username)}`} style={{ textDecoration: 'none', color: '#fff' }}>
                                {user.username}
                            </Link>
                        </div>

                    </div>
                </div>}
            </div>
        </div>
    )
}

export default NavBar;