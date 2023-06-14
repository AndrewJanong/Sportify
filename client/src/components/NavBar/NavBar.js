import React from 'react';
import styles from './NavBar.module.css';
import { Link } from 'react-router-dom';
import { Image } from 'cloudinary-react';
import Logo from '../../icons/Logo.png';
import NotificationsWhite from '../../icons/NotificationsWhite.png';
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
                    <Link to="/newdiscussion" style={{ textDecoration: 'none' }}>
                        <button type='button' className={styles.creatediscussion}>
                            Create a Discussion
                        </button>
                    </Link>
                    <Link to="/newmeetup" style={{ textDecoration: 'none' }}>
                        <button type='button' className={styles.createmeetup}>
                            Create a Meetup
                        </button>
                    </Link>
                    <div className={styles.container}>
                        <div className={styles.user} onClick={(e) => console.log(user.token)}>
                            <Link to={`/profile/${(user.username)}`} style={{ textDecoration: 'none', color: '#fff' }}>
                                <Image 
                                    cloudName={`${process.env.REACT_APP_IMAGECLOUD}`} 
                                    publicId={`${user.picture || "Member_qx5vfp"}`}>
                                </Image>
                                <p onClick={(e) => {console.log(user)}}>{user.username}</p>
                            </Link>
                        </div>
                        <div className={styles.notifications}>
                            <Link to={`/notifications/${(user.username)}`} style={{ textDecoration: 'none', color: '#fff' }}>
                                    <img src={NotificationsWhite} alt="" />
                            </Link>
                        </div>
                    </div>
                    {/* <button onClick={(e) => console.log(user)}>idk</button> */}
                </div>}
            </div>
        </div>
    )
}

export default NavBar;