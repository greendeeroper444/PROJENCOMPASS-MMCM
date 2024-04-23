import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faEnvelope, faListAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';


export default function AdminAllUserDetailPosts() {
    const [posts, setPosts] = useState([]);
    const {darkMode} = useAuth();
    const {authId} = useParams();

    const isLongDescription = (description) => {
        const wordCount = description.split(/\s+/).length;
        return wordCount > 30;
    };


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
                                                            <div key={posts[0]._id} className='text-center'>
                                                                {
                                                                    posts[0].user && !posts[0].admin && (
                                                                        <>
                                                                            {
                                                                                posts[0].user.image && <img src={posts[0].user.image} alt='User Avatar' className='rounded-circle mb-3' style={{ width: '150px', height: '150px' }} />
                                                                            }
                                                                            <h2>
                                                                                <FontAwesomeIcon icon={faUser} style={{ marginRight: '5px' }} />
                                                                                {posts[0].user.name}
                                                                            </h2>
                                                                            <p>
                                                                                <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '5px' }} />
                                                                                Email: {posts[0].user.email}
                                                                            </p>

                                                                        </>
                                                                    )
                                                                }
                                                              
                                                            </div>
                                                        )
                                                    }
                                                    
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                                <div className='mt-4'>
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
                                    <ul className='list-group' style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        {
                                            posts && posts.length > 0 ? (
                                                posts.map((post, index) => (
                                                    <li key={post._id} className={`list-group-item py-3 ${darkMode ? 'dark-mode' : ''}`} style={{ display: index < 5 ? 'block' : 'none' }}>
                                                        <Link to={`/home/post/detail/${post._id}`} style={{ textDecoration: 'none' }}>
                                                        <p className={`post-detail ${darkMode ? 'dark-mode' : ''}`}>{post.question}</p>
                                                            <p className={`post-detail ${darkMode ? 'dark-mode' : ''}`}><b>{post.title}</b></p>
                                                            <p className={`post-detail ${darkMode ? 'dark-mode' : ''}`}>
                                                            {
                                                                isLongDescription(post.description) ? (
                                                                    <>
                                                                        {post.description.split(/\s+/).slice(0, 30).join(' ')}...
                                                                        <Link to={`/home/post/detail/${post._id}`} style={{ textDecoration: 'none' }}><span>See More</span></Link>
                                                                    </>
                                                                ) : (
                                                                    post.description
                                                                )
                                                            }
                                                            </p>
                                                            
                                                            <div className='d-flex justify-content-between align-items-center'>
                                                                <small className={`${darkMode ? 'dark-mode' : ''}`}>{post.author}</small>
                                                                <small className={`${darkMode ? 'dark-mode' : ''}`}>{formatRelativeTime(post.date)}</small>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                ))
                                            ) : (
                                                <li className={`list-group-item text-center ${darkMode ? 'dark-mode' : ''}`}>No posts</li>
                                            )
                                        }
                                    </ul>
                                </div>
                                <br />
                                <br />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
      </div>
    </>
  );
}
