import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faHistory, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import iconMcm from '../assets/icon-mcm.png';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import adminProfile from '../assets/admin.png';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';

export default function CustomNavbar({ toggleSidebar }) {
    const {user, admin, darkMode} = useAuth();
    const [showNotifications, setShowNotifications] = useState(false); 
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);
    const navigate = useNavigate();




    //search
    const [showAutocomplete, setShowAutocomplete] = useState(false);
    const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
    const [searchHistory, setSearchHistory] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const searchContainerRef = useRef(null);

    const handleDeleteSearchHistory = async(searchHistoryId) => {
        try {
            
            const userType = admin ? 'admin' : 'user';

            const authId = admin ? admin.id : user.id;
    
            const response = await axios.delete(`/search-history/delete-search-history/${userType}/${authId}/${searchHistoryId}`);
    
            if(response.status === 200){
                const updatedSearchHistory = searchHistory.filter(item => item._id !== searchHistoryId);
                setSearchHistory(updatedSearchHistory);
                console.log('Search history item deleted successfully');
            } else{
                console.error('Failed to delete search history item');
            }
        } catch (error) {
            console.error(error);
        }
    };
    

    //to be clickable the seach history
    const handleSearchHistoryClick = (query) => {
        setSearchQuery(query);
        handleSearch({preventDefault: () => {}});
    };
    const handleClickOutside = (event) => {
        if(searchContainerRef.current && !searchContainerRef.current.contains(event.target)){
            setShowAutocomplete(false);
        }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    

    //to display the search history
    useEffect(() => {
        const fetchSearchHistory = async() => {
            try {
                let response;
                if(admin){
                    response = await axios.get('/search-history/get-search-history/admin');
                } else if(user){
                    response = await axios.get('/search-history/get-search-history/user');
                } else{
                    console.error('No user or admin logged in');
                    return;
                }
    
                setSearchHistory(response.data);
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchSearchHistory();
    }, [admin, user]);
    

    const handleSearch = async(e) => {
        e.preventDefault();
        try {
            if(!searchQuery.trim()){
                console.log('No query in input');
                return;
            }

            const response = await axios.get(`/post/search?q=${searchQuery}`);
            if(response.data.length === 0){
                toast.error('No search results found.');
            } else{
                navigate(`/home?q=${searchQuery}`);
            }
          
            setShowAutocomplete(false);
            navigate(`/home?q=${searchQuery}`);

            let userType;
            if(admin){
                userType = 'Admin';
            } else if(user){
                userType = 'User';
            } else{
                console.error('No user or admin logged in');
                return;
            }
    
            const url = userType === 'Admin' ? '/search-history/add-search-history/admin' : '/search-history/add-search-history/user';
            await axios.post(url, {
                query: searchQuery,
                userType: userType,
            });

            setSearchHistory([]);
        } catch (error) {
            console.error(error);
        }
    };

    //for auto complete function
    const handleAutocomplete = async(suggestion) => {
        setSearchQuery(suggestion);
        setShowAutocomplete(false); 

        let userType;
            if(admin){
                userType = 'Admin';
            } else if(user){
                userType = 'User';
            } else{
                console.error('No user or admin logged in');
                return;
            }
    
            const url = userType === 'Admin' ? '/search-history/add-search-history/admin' : '/search-history/add-search-history/user';
            await axios.post(url, {
                query: suggestion,
                userType: userType,
            });

        handleSearch({preventDefault: () => {}});
    };

    useEffect(() => {
        const fetchSuggestions = async() => {
            try {
                if(searchQuery.trim() === ''){
                    setAutocompleteSuggestions([]);
                    return;
                }
                const response = await axios.get(`/post/search-suggests?q=${searchQuery}`);
                setAutocompleteSuggestions(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchSuggestions();
    }, [searchQuery]);




    
    useEffect(() => {
        const fetchNotificationsAndCounts = async () => {
            try {
                const response = await axios.get(admin ? '/notification/get-notifications-admin' : '/notification/get-notifications');
    
                if (response.status === 200) {
                    setNotifications(response.data.notifications);
    
                    // Calculate initial notification count based on unread notifications
                    const initialNotificationCount = response.data.notifications.filter(notification => !notification.read).length;
    
                    // Update notification count
                    setNotificationCount(initialNotificationCount);
                } else {
                    throw new Error('Failed to fetch notifications');
                }
            } catch (error) {
                console.error(error);
            }
        }
    
        fetchNotificationsAndCounts();
    }, [admin]);
    
    

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        if (!showNotifications) {
            setNotificationCount(0);
        }
    };

    const handleNotificationClick = async(notificationId) => {
        try {
            await axios.put(`/notification/mark-as-read/${notificationId}`);
            const updatedNotifications = notifications.map(notification =>
                notification._id === notificationId ? { ...notification, read: true } : notification
            );
            setNotifications(updatedNotifications);
            const newNotificationCount = updatedNotifications.filter(notification => !notification.read).length;
            setNotificationCount(newNotificationCount);

            setShowNotifications(false);
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
    <nav className='navbar navbar-expand-lg custom-navbar'>
        <div className='container-fluid d-flex align-items-center justify-content-between'>

            {/* logo and menu  */}
            <div className='d-flex align-items-center'>
                <div className='menu-icon-lg'>
                    <button className='navbar-toggler' type='button' id='navbar-toggler' onClick={toggleSidebar}>
                        <span className='bars'></span>
                        <span className='bars'></span>
                        <span className='bars'></span>
                    </button>
                </div>
                &nbsp;&nbsp;
                <a className='navbar-brand' href='/home'>
                    <div className={`brand-wrapper ${darkMode ? 'dark-mode' : ''}`}>
                        <img src={iconMcm} className='custom-logo' alt='Your logo' />
                        {' '}
                        <span className='system-title-1' style={{ color: 'red' }}>Projen</span>
                        <span className='system-title-2' style={{ color: '#004AAD' }}>Compass</span>
                    </div>
                </a>
            </div>


            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {/* search form */}
            <div className='col-md-6 col-lg-4 position-fixed top-0 start-50 translate-middle-x mt-2'>
                <div ref={searchContainerRef} className={`search-wrapper form-control flex-grow-1 ${darkMode ? 'dark-mode' : ''} `}style={{ textDecoration: 'none' }}>
                    <form onSubmit={handleSearch}>
                        <div className='search-wrapper'>
                            <input
                                type='text'
                                placeholder='Search Posts'
                                className={`search-post-input rounded-pill w-100 ${darkMode ? 'dark-mode' : ''}`}
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowAutocomplete(true);
                                    if(e.target.value.trim() !== ''){
                                        setShowAutocomplete(true);
                                    } else{
                                        setShowAutocomplete(false);
                                    }
                                }}
                                onFocus={() => setShowAutocomplete(true)}
                            />

                            {/* autocomplete */}
                            {
                                showAutocomplete && (
                                    <div className='autocomplete-container'>
                                        <Autocomplete
                                            searchQuery={searchQuery}
                                            suggestions={autocompleteSuggestions}
                                            handleAutocomplete={handleAutocomplete}
                                        />
                                    </div>
                                )
                            }

                            {/* search history */}
                            {
                                showAutocomplete && (
                                    <div className='autocomplete-container mt-3'>
                                        <h6>Search history</h6>
                                        {
                                            searchHistory.length > 0 ? (
                                                <div>
                                                    {
                                                        searchHistory.slice(0).reverse().map((item, index) => (
                                                            <div key={index} 
                                                            className={`d-flex justify-content-between search-history-item ${darkMode ? 'search-history-item-darkmode' : ''}`}
                                                            onClick={() => handleSearchHistoryClick(item.query)}
                                                            >
                                                                <div className='search-history-icons'>
                                                                    <FontAwesomeIcon icon={faHistory} color='grey' className='history-icon' />
                                                                    &nbsp;&nbsp;&nbsp;
                                                                    <span className='query-text'>{item.query}</span>
                                                                </div>
                                                                <div className='search-history-icons'>
                                                                    <FontAwesomeIcon
                                                                        icon={faTimes}
                                                                        color='grey' 
                                                                        className='delete-icon'
                                                                        onClick={(e) => {
                                                                            //top the click event from bubbling up to the parent item
                                                                            e.stopPropagation();
                                                                            handleDeleteSearchHistory(item._id);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            ) : (
                                                <div>
                                                    <p>No search history</p>
                                                </div>
                                            )
                                        }
                                    </div>
                                )
                            }

                        </div>
                    </form>
                </div>
            </div>



            &nbsp;&nbsp;&nbsp;
            {/* profile info */}
            <div className={`profile-info ${darkMode ? 'dark-mode' : ''}`}>
                &nbsp;&nbsp;
                <div className='notification-icon-container' onClick={toggleNotifications}>
                    <div className='notification-icon'>
                        <FontAwesomeIcon icon={faBell} size='lg' color='grey' />
                    </div>
                    {notificationCount > 0 && <div className='notification-badge'>{notificationCount}</div>}
                </div>
                &nbsp;&nbsp;

                {
                    user && !admin ? (
                        <>
                            {
                                user.image && (
                                    <img
                                        src={user.image}
                                        width='30'
                                        height='30'
                                        className='rounded-circle'
                                        alt='Your profile picture'
                                    />
                                )
                            }
                            <span className='navbar-user-name'>{user.name}</span>
                        </>
                    ) : (
                        <>
                            {
                                admin && (
                                    <img
                                        src={adminProfile}
                                        width='30'
                                        height='30'
                                        className='rounded-circle'
                                        alt='Your profile picture'
                                    />
                                )
                            }
                            <span className='navbar-user-name'>ADMIN</span>
                        </>
                    )
                }
            </div>



            {
                showNotifications && (
                    <div className={`notification-dropdown ${darkMode ? 'dark-mode' : ''}`}>
                        <h5 style={{ padding: '10px' }}>{notifications.length <= 1? 'Notification' : 'Notifications'}</h5>
                        {
                            notifications && notifications.length > 0 ? (
                                notifications.map((notification, index) => (
                                    <Link to={
                                        notification.notificationType === 'reply'
                                            ? `/home/post/comment/detail/${notification.content.postId}/${notification.content.commentId}`
                                            : `/home/post/detail/${notification.content.postId}`} 
                                            key={index} 
                                            className={`notification-item ${darkMode ? 'dark-mode' : ''} ${notification.read ? '' : `unread ${darkMode ? 'dark-mode-unread' : ''}`}`}
                                            style={{ textDecoration: 'none', backgroundColor: notification.read ? 'white' : 'lightgray' }}
                                            onClick={() => handleNotificationClick(notification._id)}>
                                        {
                                            notification.sender && (
                                                <>
                                                    <img src={notification.senderType === 'Admin' ? adminProfile : notification.sender.image} className='notification-sender-image' alt='Sender' />
                                                    <div className='notification-content'>
                                                        <div className='notification-text'>
                                                            {
                                                                notification.notificationType === 'reply' && (
                                                                    <div className={`${darkMode ? 'dark-mode' : ''} ${notification.read ? '' : `unread ${darkMode ? 'dark-mode-unread' : ''}`}`}
                                                                    style={{ textDecoration: 'none', color: 'black' }}>
                                                                        <span className='notification-sender'>
                                                                        {notification.senderType === 'Admin' ? notification.sender.username : notification.sender.name}
                                                                        </span> replied to your comment.
                                                                    </div>
                                                                )
                                                            }
                                                            {
                                                                notification.notificationType === 'comment' && (
                                                                    <div className={`${darkMode ? 'dark-mode' : ''} ${notification.read ? '' : `unread ${darkMode ? 'dark-mode-unread' : ''}`}`}
                                                                    style={{ textDecoration: 'none', color: 'black' }}
                                                                    >
                                                                        <span className='notification-sender'>
                                                                        {notification.senderType === 'Admin' ? notification.sender.username : notification.sender.name}
                                                                        </span> commented on your post.
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                        <div className='notification-time'>{formatRelativeTime(notification.createdAt)}</div>
                                                    </div>
                                                </>
                                            )
                                        }
                                    </Link>
                                ))
                            ) : (
                                <p className='mt-3 text-center justify-content-center align-content-center'>No notifications.</p>
                            )
                        }
                    </div>
                )
            }
        </div>
    </nav>
  );
}


const Autocomplete = ({ searchQuery, suggestions, handleAutocomplete }) => {
    Autocomplete.propTypes = {
        searchQuery: PropTypes.string.isRequired,
        handleAutocomplete: PropTypes.func.isRequired,
        suggestions: PropTypes.array.isRequired,
    };

 
    const [setSuggestions] = useState([]);
    const {darkMode} = useAuth();

    useEffect(() => {
        //to fetch suggestions from backend when searchQuery changes
        const fetchSuggestions = async() => {
            try {
                if(searchQuery.trim() === ''){
                     //to reset suggestions if searchQuery is empty
                    setSuggestions([]);
                    return;
                }

                const response = await axios.get(`/post/search-suggests?q=${searchQuery}`);
                setSuggestions(response.data);
            } catch (error){
                console.error('Error fetching suggestions:', error);
            }
        };

        fetchSuggestions();
    }, [searchQuery]);

    return (
        <ul className={`autocomplete mt-3 ${darkMode ? 'dark-mode' : ''}`} style={{ listStyle: 'none', padding: 0 }}>
            {
                Array.isArray(suggestions) && suggestions.map((suggestion, index) => {
                    const startIndex = suggestion.toLowerCase().indexOf(searchQuery.toLowerCase());
                    const boldPart = suggestion.slice(0, startIndex);
                    const restOfSuggestion = suggestion.slice(startIndex + searchQuery.length);
                    return (
                        <li key={index} onClick={() => handleAutocomplete(suggestion)} className={`list-suggestions ${darkMode ? 'list-suggestions-darkmode' : ''}`}>
                            <FontAwesomeIcon icon={faSearch} style={{ marginLeft: '5px', color: '#919191' }} />
                            &nbsp;&nbsp;&nbsp;
                            {boldPart}
                            {searchQuery}
                            <strong>{restOfSuggestion}</strong>
                        </li>
                    );
                })
            }
        </ul>
    );
};