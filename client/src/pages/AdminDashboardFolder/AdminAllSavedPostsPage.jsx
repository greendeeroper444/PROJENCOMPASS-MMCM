import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faHeart, faSave } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function AdminAllSavedPostsPage() {
    const [savedPosts, setSavedPosts] = useState([]);
    const {darkMode} = useAuth();

    const showPdf = (pdf) => {
        window.open(`${pdf}`, '_blank', 'noreferrer');
    }

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

    const savePost = async(postId, index) => {
        try {
            const newSavedPosts = [...savedPosts];
            newSavedPosts[index].isSaved = !newSavedPosts[index].isSaved;
            setSavedPosts(newSavedPosts);

            await axios.post('/post/save-post-admin', {postId});
            const message = newSavedPosts[index].isSaved ? 'Post saved successfully!' : 'Post unsaved successfully!';
            toast.success(message);
        } catch (error) {
            console.error(error);
            toast.error('Failed to save post');
        }
    };


    const isLongDescription = (description) => {
        const wordCount = description.split(/\s+/).length;
        return wordCount > 30;
    };

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
                                    <h5 className={`${darkMode ? 'dark-mode-text' : ''}`}><FontAwesomeIcon icon={faSave} />
                                    &nbsp; {savedPosts.length <= 1 ? 'Your Saved Post' : 'Your Saved Posts'}
                                    </h5>
                                    { 
                                        savedPosts.length === 0 ? (
                                            <ul className='list-group'>
                                                <li className={`list-group-item text-center ${darkMode ? 'dark-mode' : ''}`}>No saved posts yet.</li>
                                            </ul>
                                        ) : (
                                                savedPosts && savedPosts.map((post, index) => (
                                                    <div key={post._id} className={`card ${darkMode ? ' dark-mode' : ''}`}>

                                                        <button className={`btn mr-2 ${darkMode ? 'dark-mode' : ''} ${
                                                        post.isSaved ? `btn-danger ${darkMode ? 'dark-mode-save' : ''}` : 'btn-light'}`}
                                                            onClick={() => savePost(post._id, index)}>
                                                            <FontAwesomeIcon
                                                            icon={faHeart}
                                                            color={`${post.isSaved ? 'white' : darkMode ? 'white' : 'grey'}`}
                                                            />
                                                            <span className={`${post.isSaved ? 'save-post-saved' : 'save-post'}`}>
                                                                {' '}
                                                                {post.isSaved ? 'Saved' : 'Save'}
                                                            </span>
                                                        </button>

                                                        <Link to={`/home/post/detail/${post._id}`} style={{ textDecoration: 'none' }} className='card-body'>
                                                            <div className='d-flex align-items-center mb-2'>

                                                                

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

                                                            
                                                            
                                                            
                                                        </Link>
                                                    </div>
                                                ))
                                        )
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
