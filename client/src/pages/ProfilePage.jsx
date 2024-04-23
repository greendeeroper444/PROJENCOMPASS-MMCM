import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faComment, faEnvelope, faFilePdf, faHeart, faListAlt, faShare, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import adminProfile from '../assets/admin.png';


export default function ProfilePage() {
    const [posts, setPosts] = useState([]);
    const {darkMode, user, setUser, admin, setAdmin} = useAuth();
    const {authId} = useParams();


    const [savedPosts, setSavedPosts] = useState([]);
    useEffect(() => {
        //initialize the savedPosts state based on the 'isSaved' property of each post
        const initialSavedPosts = posts.map(post => post.isSaved);
        setSavedPosts(initialSavedPosts);
    }, [posts]);

    const savePost = async(postId, index) => {
        try {
            //toggle the state for the clicked post
            const newSavedPosts = [...savedPosts];
            newSavedPosts[index] = !savedPosts[index];
            setSavedPosts(newSavedPosts);

            await axios.post(admin? '/post/save-post-admin' : '/post/save-post', {postId});
            const message = newSavedPosts[index] ? 'Post saved successfully!' : 'Post unsaved successfully!';
            toast.success(message);
        } catch (error) {
            console.error(error);
            toast.error('Failed to save post');
        }
    };

    const handleShare = (post) => {
      
        const postUrl = `${window.location.origin}/home/post/detail/${post._id}`;
        
        navigator.clipboard.writeText(postUrl)
            .then(() => {
                alert('URL copied to clipboard!');
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const showPdf = (pdf) => {
        window.open(`${pdf}`, '_blank', 'noreferrer');
    }
    
    const isLongDescription = (description) => {
        const wordCount = description.split(/\s+/).length;
        return wordCount > 30;
    };


    //get posts each
    useEffect(() => {
        const fetchUserPosts = async() => {
            try {
                const response = await axios.get(`/post/get-profile-posts/${authId}`);
                setPosts(response.data.posts);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserPosts();
    }, [authId]);

    
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
                                <div className={`row justify-content-center ${darkMode ? 'dark-mode-text' : ''}`}>
                                    <div className='col-md-8'>
                                        {
                                            posts.length > 0 && (
                                                <div className='text-center'>
                                                    {
                                                        posts[0].user && !posts[0].admin && (
                                                            <div key={posts[0]._id}>
                                                                {posts[0].user.image && (
                                                                    <img
                                                                        src={posts[0].user.image}
                                                                        alt='User Avatar'
                                                                        className='rounded-circle mb-3'
                                                                        style={{ width: '150px', height: '150px' }}
                                                                    />
                                                                )}
                                                                <h2>
                                                                    <FontAwesomeIcon icon={faUser} style={{ marginRight: '5px' }} />
                                                                    {posts[0].user.name}
                                                                </h2>
                                                                <p>
                                                                    <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '5px' }} />
                                                                    <a href={`mailto:${posts[0].user.email}`}>{posts[0].user.email}</a>
                                                                </p>

                                                            </div>
                                                        )
                                                    }
                                                    {
                                                        posts[0].admin && (
                                                            <div key={posts[0]._id}>
                                                                <img
                                                                    src={adminProfile}
                                                                    alt='Admin Avatar'
                                                                    className='rounded-circle mb-3'
                                                                    style={{ width: '150px', height: '150px' }}
                                                                />
                                                                <h2>
                                                                    <FontAwesomeIcon icon={faUser} style={{ marginRight: '5px' }} />
                                                                    {posts[0].admin.username}
                                                                </h2>
                                                                <p>
                                                                    @mapuamalayancollegemindanao@mcm.edu.ph
                                                                </p>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            )
                                        }
                                        {
                                            !posts.length && (
                                                <div className='text-center'>
                                                    <p>No posts available.</p>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>


                                <div className='mt-5'>

                                    <h5 className={`d-flex ${darkMode ? 'dark-mode-text' : ''}`}>
                                        <FontAwesomeIcon icon={faListAlt} /> 
                                        &nbsp;
                                        {
                                            posts.length > 0 && (
                                                <div key={posts[0]._id}>
                                                    {
                                                        posts[0].admin ? (
                                                            <p><strong><FontAwesomeIcon icon={faCheckCircle} style={{ color: 'blue', marginLeft: '5px' }} /> {posts[0].admin.username}'s</strong> post.</p>
                                                        ) : (
                                                            posts[0].user && (
                                                                <p><span>{posts[0].user.name}'s</span> {posts.length <= 1 ? 'post' : 'posts'}</p>
                                                            )
                                                        )
                                                    }
                                                    <p>{posts[0].post}</p>
                                                </div>
                                            )
                                        }
                                    </h5>


                                    {
                                        posts && posts.map((post, index) => (
                                            <div key={post._id} className={`card ${darkMode ? ' dark-mode' : ''}`}>

                                                <div className='card-body'>
                                                    <div className='d-flex align-items-center mb-2'>

                                                        {/* post profile */}
                                                        {
                                                            post.admin ? (
                                                                <Link to={`/home/post/profile/${post.admin._id}`}
                                                                className={`d-flex ${darkMode ? ' dark-mode' : ''}`} style={{ textDecoration: 'none', color: 'black' }}>
                                                                    <img
                                                                        src={adminProfile}
                                                                        style={{ width: 30, height: 30, borderRadius: '50%' }}
                                                                        className='mr-2'
                                                                        alt='Admin Profile'
                                                                    />
                                                                    &nbsp;
                                                                    <h6 className='card-subtitle mb-0 m-lg-1'>{post.admin.username}</h6>
                                                                    &nbsp;
                                                                    <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'blue' }} />
                                                                </Link>
                                                            ) : (
                                                                post.user && (
                                                                    <Link to={`/home/post/profile/${post.user._id}`}
                                                                    className={`d-flex ${darkMode ? ' dark-mode' : ''}`} style={{ textDecoration: 'none', color: 'black' }}
                                                                    >
                                                                        <img
                                                                            src={post.user.image}
                                                                            style={{ width: 30, height: 30, borderRadius: '50%' }}
                                                                            className='mr-2'
                                                                            alt='User Profile'
                                                                        />
                                                                        &nbsp;
                                                                        <h6 className='card-subtitle mb-0 m-lg-1'>{post.user.name}</h6>
                                                                    </Link>
                                                                )
                                                            )
                                                        }

                                                        &nbsp;&nbsp;&nbsp;
                                                        {
                                                            post.user && post.user.email && (
                                                                <a href={`mailto:${post.user.email}`} >
                                                                    <FontAwesomeIcon icon={faEnvelope} color='grey' />
                                                                </a>
                                                            )
                                                        }
                                                    </div>
                                                    <div style={{ marginLeft: '30px' }}>
                                                        <p className='card-date'>{formatRelativeTime(post.date)}</p>
                                                        <br />
                                                        <p className='card-text'>
                                                        {
                                                            post.question.split('\n').map((line, lineIndex) => (
                                                                <React.Fragment key={lineIndex}>
                                                                    &nbsp;{line}
                                                                    <br />
                                                                </React.Fragment>
                                                            ))
                                                        }
                                                        </p>
                                                        <h5 className='card-title'>{post.title}</h5>
                                                        <p className='card-text'>
                                                            {
                                                                isLongDescription(post.description) ? (
                                                                    <>
                                                                        {post.description.split(/\s+/).slice(0, 300).join(' ')}...
                                                                        <Link to={`/home/post/detail/${post._id}`} style={{ textDecoration: 'none' }}><span>See More</span></Link>
                                                                    </>
                                                                ) : (
                                                                    post.description
                                                                )
                                                            }
                                                        </p>
                                                        <p className='card-author' >{post.author ? `- ${post.author}`: ''}</p>
                                                        <br />
                                                        <br />
                                                        {
                                                            post.pdf && (
                                                                <button className={`pdf--button ${darkMode ? 'dark-mode-buttonpdf' : ''}`}
                                                                onClick={() => showPdf(post.pdf)}
                                                                    >
                                                                    <FontAwesomeIcon icon={faFilePdf} className='mr-2' style={{ color: 'red' }} /> {post.pdf.split('/').pop()}
                                                                </button>
                                                            )
                                                        }
                                                    </div>

                                                    <br />

                                                    
                                                    
                                                    <div className='d-flex mt-4 flex-grow-1 justify-content-center'>
                                                        {
                                                            user && !admin ? (
                                                                <>
                                                                    {
                                                                        user.image && (
                                                                            <img src={user.image} style={{ width: 30, height: 30, borderRadius: '50%' }} 
                                                                            className='mr-2' alt='Your profile picture' />
                                                                        )
                                                                    }
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {
                                                                        admin && (
                                                                            <img src={adminProfile} style={{ width: 30, height: 30, borderRadius: '50%' }} 
                                                                            className='mr-2' alt='Your profile picture' />
                                                                        )
                                                                    }
                                                                </>
                                                            )
                                                        }
                                                        &nbsp;
                                                        <div className='d-flex'>
                                                            <Link to={`/home/post/detail/${post._id}`} style={{ textDecoration: 'none' }}>
                                                                <input
                                                                type='text'
                                                                className={`form-control ${darkMode ? 'dark-mode' : ''}`}
                                                                placeholder='Comment something...'
                                                                readOnly
                                                                />
                                                            </Link>
                                                            &nbsp;
                                                            <Link to={`/home/post/detail/${post._id}`} className={`btn btn-light comment-count ${darkMode ? 'dark-mode' : ''}`}> 
                                                                <FontAwesomeIcon icon={faComment} color='grey' className='mr-2'/>
                                                                &nbsp;{
                                                                    post.comments.length > 0 ? (
                                                                        <span>{post.comments.length} <span className='comment-post'>{post.comments.length === 1 ? 'comment' : 'comments'}</span></span>
                                                                    ) : (
                                                                        <span className='comment-post'>No comments yet.</span>
                                                                    )
                                                                }
                                                            </Link>
                                                            &nbsp;
                                                            <button
                                                                className={`btn mr-2 ${darkMode ? 'dark-mode' : ''} ${savedPosts[index] ? `btn-danger ${darkMode ? 'dark-mode-save' : ''}` : 'btn-light'}`}
                                                                onClick={() => savePost(post._id, index)}>
                                                                <FontAwesomeIcon icon={faHeart} color={`${savedPosts[index] ? 'white' : (darkMode ? 'white' : 'grey')}`} />
                                                                <span className={`${savedPosts[index] ? 'save-post-saved' : 'save-post'}`}> {savedPosts[index] ? 'Saved' : 'Save'}</span>
                                                            </button>
                                                            &nbsp;
                                                            <button className={`btn btn-light ${darkMode ? 'dark-mode' : ''}`} onClick={() => handleShare(post)}>
                                                                <FontAwesomeIcon icon={faShare} color={`${darkMode? 'white': 'grey'}`}/>
                                                                <span className='share-post'> Share</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                        
                                                </div>
                                            </div>
                                        ))
                                    }
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
