import React from 'react';
import styles from './NavBar.module.css';
import { Link, NavLink } from 'react-router-dom';
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
                {user && 
                <div className={styles.sections}>
                    <NavLink 
                        className={({isActive}) => isActive ? styles.active : ''} 
                        to="/mymeetups" 
                        style={{ textDecoration: 'none', width: '100%', borderRadius: '5px'}}
                    >
                        <Section section={'My Meetups'}/>
                    </NavLink>
                    <NavLink 
                        className={({isActive}) => isActive ? styles.active : ''} 
                        to="/search" 
                        style={{ textDecoration: 'none', width: '100%', borderRadius: '5px'}}
                    >
                        <Section section={'Search'}/>
                    </NavLink>
                    <NavLink 
                        className={({isActive}) => isActive ? styles.active : ''} 
                        to="/mygroups" 
                        style={{ textDecoration: 'none', width: '100%', borderRadius: '5px'}}
                    >
                        <Section section={'Groups'}/>
                    </NavLink>
                    <NavLink 
                        className={({isActive}) => isActive ? styles.active : ''} 
                        to="/meetups" 
                        style={{ textDecoration: 'none', width: '100%', borderRadius: '5px'}}
                    >
                        <Section section={'Meetups'}/>
                    </NavLink>
                    <NavLink 
                        className={({isActive}) => isActive ? styles.active : ''} 
                        to="/discussions" 
                        style={{ textDecoration: 'none', width: '100%', borderRadius: '5px'}}
                    >
                        <Section section={'Discussions'}/>
                    </NavLink>
                </div>}
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
                    <Link to="/newmeetup" style={{ textDecoration: 'none' }} >
                        <button type='button' className={styles.createmeetup}>
                            Create a Meetup
                        </button>
                    </Link>
                    <div className={styles.container}>
                        <div className={styles.user} onClick={(e) => console.log(user.token)}>
                            <NavLink 
                                className={({isActive}) => isActive ? styles.active : ''}
                                to={`/profile/${(user.username)}`} 
                                style={{ textDecoration: 'none', color: '#fff' }} 
                            >
                                <Image 
                                    cloudName={`${process.env.REACT_APP_IMAGECLOUD}`} 
                                    publicId={`${user.picture || "Member_qx5vfp"}`}>
                                </Image>
                                <p onClick={(e) => {console.log(user)}}>{user.username}</p>
                            </NavLink>
                        </div>
                        <div className={styles.notifications}>
                            <NavLink
                                className={({isActive}) => isActive ? styles.active : ''}
                                to={`/notifications/${(user.username)}`} 
                                style={{ textDecoration: 'none', color: '#fff' }}
                            >
                                    <img src={NotificationsWhite} alt="" />
                            </NavLink>
                        </div>
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default NavBar;