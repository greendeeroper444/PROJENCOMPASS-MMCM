import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import adminProfile from '../../assets/admin.png';


export default function AllNotificationsPage() {
    const {admin, setAdmin, darkMode} = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);

    
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
    

    const handleNotificationClick = async(notificationId) => {
        try {
            await axios.put(`/notification/mark-as-read/${notificationId}`);
            const updatedNotifications = notifications.map(notification =>
                notification._id === notificationId ? { ...notification, read: true } : notification
            );
            setNotifications(updatedNotifications);
            const newNotificationCount = updatedNotifications.filter(notification => !notification.read).length;
            setNotificationCount(newNotificationCount);
        } catch (error) {
            console.error(error);
        }
    };
    


    
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
                            <div className='col mt-5'>
                                
                                <div className='mt-4'>
                                    <h5 className={`${darkMode ? 'dark-mode-text' : ''}`}><FontAwesomeIcon icon={faBell} /> 
                                    &nbsp; {notifications.length <= 1 ? 'Notification' : 'Notifications'}
                                    </h5>
                                    <ul className='list-group' style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {
                                        notifications && notifications.length > 0 ? (
                                            notifications.map((notification, index) => (
                                                <li key={index} className={`list-group-item notification-item ${darkMode ? 'dark-mode' : ''} ${notification.read ? '' : `unread ${darkMode ? 'dark-mode-unread' : ''}`}`}
                                                style={{ backgroundColor: notification.read ? 'white' : 'lightgray' }}
                                                onClick={() => handleNotificationClick(notification._id)}>
                                                    {
                                                        notification.sender && (
                                                            <>
                                                                <div className='notification-content'>
                                                                    <div className='notification-text'>
                                                                        
                                                                        {
                                                                            notification.notificationType === 'reply' && (
                                                                                <Link 
                                                                                to={`/home/post/comment/detail/${notification.content.postId}/${notification.content.commentId}`}
                                                                                style={{ textDecoration: 'none', color: 'black' }}
                                                                                className={`${darkMode ? 'dark-mode' : ''} ${notification.read ? '' : `unread ${darkMode ? 'dark-mode-unread' : ''}`}`}>
                                                                                <img src={notification.senderType === 'Admin' ? adminProfile : notification.sender.image} className='notification-sender-image' alt='Sender' />
                                                                                    <span className='notification-sender'>
                                                                                    {notification.senderType === 'Admin' ? notification.sender.username : notification.sender.name}
                                                                                    </span> replied to your comment.
                                                                                </Link>
                                                                            )
                                                                        }
                                                                        {
                                                                            notification.notificationType === 'comment' && (
                                                                                <Link
                                                                                to={`/home/post/detail/${notification.content.postId}`}
                                                                                style={{ textDecoration: 'none', color: 'black' }}
                                                                                className={`${darkMode ? 'dark-mode' : ''} ${notification.read ? '' : `unread ${darkMode ? 'dark-mode-unread' : ''}`}`}
                                                                                >
                                                                                <img src={notification.senderType === 'Admin' ? adminProfile : notification.sender.image} className='notification-sender-image' alt='Sender' />
                                                                                    <span className='notification-sender'>
                                                                                    {notification.senderType === 'Admin' ? notification.sender.username : notification.sender.name}
                                                                                    </span> commented on your post.
                                                                                </Link>
                                                                            )
                                                                        }
                                                                    </div>
                                                                    <div className='notification-time'>{formatRelativeTime(notification.createdAt)}</div>
                                                                </div>
                                                            </>
                                                        )
                                                    }
                                                </li>
                                            ))
                                        ) : (          
                                            <li className={`list-group-item text-center ${darkMode ? 'dark-mode' : ''}`}>No notifications yet.</li>
                                        )
                                    }
                                    </ul>
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
