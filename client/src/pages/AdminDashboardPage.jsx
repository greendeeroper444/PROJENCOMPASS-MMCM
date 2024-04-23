import React, { useEffect, useState } from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faListAlt, faSave, faUsers } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';


export default function AdminDashboardPage() {
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [savedPosts, setSavedPosts] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const {admin,darkMode} = useAuth();
    
    useEffect(() => {
        const fetchNotificationsAndCounts = async() => {
            try {
                
                let response;
                if(admin){
                    response = await axios.get('/notification/get-notifications-admin');
                } else{
                    response = await axios.get('/notification/get-notifications');
                }
                
                if(response.status === 200){
                    
                    setNotifications(response.data.notifications);
                    
                } else{
                    throw new Error('Failed to fetch notifications');
                }
            } catch (error) {
                console.error(error);
            }
        }
  
        fetchNotificationsAndCounts();
    }, []);
    

    useEffect(() => {
        const fetchSavedPosts = async() => {
            try {
                const response = await axios.get('/post/get-saved-posts');
                if(response.status === 200){
                    setSavedPosts(response.data.posts);
                } else{
                    throw new Error('Failed to fetch saved posts');
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchSavedPosts();
    }, []);
   

    useEffect(() => {
        axios.get('/admin/get-all-users')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        const fetchPosts = async() => {
            try {
                const response = await axios.get('/post/get-own-post-admin');
                if(response.status === 200){
                    const sortedPosts = response.data.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
                    setPosts(sortedPosts);
                } else{
                    throw new Error('Failed to fetch posts');
                }
            } catch (error) {
                console.error('Error fetching posts:', error.message);
            }
        };
  
        fetchPosts();
    }, []);


    
    const formatRelativeTime = (timestamp) => {
        const now = new Date();
        const postDate = new Date(timestamp);
        const timeDiff = now - postDate;

        const seconds = Math.floor(timeDiff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);

        if(months > 0){
            return `${months} month${months > 1 ? 's' : ''} ago`;
        } else if(weeks > 0){
            return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        } else if(days > 0){
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if(hours > 0){
            return `${hours} hr${hours > 1 ? 's' : ''} ago`;
        } else if(minutes > 0){
            return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
        } else{
            return `${seconds} sec${seconds > 1 ? 's' : ''} ago`;
        }
    };


  return (
    <>
        <div className='container-fluid'>
            <div className='row'>
                
                {/* Content */}
                <div className='col'>
                    <div className='container'>
                        <div className='mt-5 row row--content'>
                            <div className={`col mt-5 ${darkMode ? 'dark-mode' : ''}`} style={{ backgroundColor: 'white' }}>
                                <h1 className='text-center mt-5'>Dashboard</h1>
                                <p className='text-center'>Welcome to admin dashboard. Here you can manage all users, notifications, posts, and saved posts.</p>
                                <div className='col mt-5 d-flex flex-wrap'>
                                    <div className='mt-3 col-12 col-md-4'>
                                        <Link to='/admin/dashboard/allusers' style={{ textDecoration: 'none' }} 
                                        className={`card rounded-lg p-4 shadow d-flex align-items-center ${darkMode ? 'dark-mode' : ''}`}>
                                            <FontAwesomeIcon icon={faUsers} color='green' size='3x' className='mr-4' />
                                            <div className='card-body text-center'>
                                                <h4 className='card-title'><span style={{ color: 'red' }}>{users.length}</span> {users.length <= 1? 'User': 'Users' }</h4>
                                                <p className='card-text'>All Users</p>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className='mt-3 col-12 col-md-4'>
                                        <Link to='/admin/dashboard/allnotifications' style={{ textDecoration: 'none' }} 
                                        className={`card rounded-lg p-4 shadow d-flex align-items-center ${darkMode ? 'dark-mode' : ''}`}>
                                            <FontAwesomeIcon icon={faBell} color='red' size='3x' className='mr-4' />
                                            <div className='card-body text-center'>
                                                <h4 className='card-title'><span style={{ color: 'red' }}>{notifications.length}</span> {notifications.length <= 1 ? 'Notification' : 'Notifications' }</h4>
                                                <p className='card-text'>All Notifications</p>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className='mt-3 col-12 col-md-4'>
                                        <Link to='/admin/dashboard/allposts' style={{ textDecoration: 'none' }} 
                                        className={`card rounded-lg p-4 shadow d-flex align-items-center ${darkMode ? 'dark-mode' : ''}`}>
                                            <FontAwesomeIcon icon={faListAlt} color='blue' size='3x' className='mr-4' />
                                            <div className='card-body text-center'>
                                                <h4 className='card-title'><span style={{ color: 'red' }}>{posts.length}</span> {posts.length <= 1 ? 'Post' : 'Posts'}</h4>
                                                <p className='card-text'>All Posts</p>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className='mt-3 col-12 col-md-4'>
                                        <Link to='/admin/dashboard/allsaveposts' style={{ textDecoration: 'none' }} 
                                        className={`card rounded-lg p-4 shadow d-flex align-items-center ${darkMode ? 'dark-mode' : ''}`}>
                                            <FontAwesomeIcon icon={faSave} color='purple' size='3x' className='mr-4' />
                                            <div className='card-body text-center'>
                                                <h4 className='card-title'><span style={{ color: 'red' }}>{savedPosts.length}</span> {savedPosts.length <= 1? 'Save Post': 'Save Posts' }</h4>
                                                <p className='card-text'>All Saved</p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </>
  );
}
