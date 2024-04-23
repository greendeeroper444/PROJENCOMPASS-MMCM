import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useParams } from 'react-router-dom';
import adminProfile from '../assets/admin.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

export default function ContentCommentDetail() {
    const {user, admin, darkMode} = useAuth();
    const [post, setPost] = useState(null);
    const { postId, commentId } = useParams();
    const [comment, setComment] = useState(null);
    const [replies, setReplies] = useState([]);
    const [replyText, setReplyText] = useState('');
    const [showDeleteConfirmationReply, setShowDeleteConfirmationReply] = useState(false);
    const [replyIdToDelete, setReplyIdToDelete] = useState(null);

    //delete reply
    const handleDeleteReply = async(replyId) => {
        try {
            const response = await axios.delete(admin? `/reply/delete-reply-admin/${replyId}` : `/reply/delete-reply/${replyId}`);
            if(response.data.error){
                toast.error(response.data.error);
            }else{
                toast.success(response.data.message);
                setReplies((prevReplies) => prevReplies.filter((reply) => reply._id !== replyId));
            }
        } catch (error) {
            console.error(error);
        }
    };
    const buttonDeleteReply = (id) => {
        setReplyIdToDelete(id);
        setShowDeleteConfirmationReply(true);
    };


    //to focus on the textarea when the "Reply" link is clicked
    const textareaRef = useRef(null);
    const handleReplyClick = (username) => {
        setReplyText(`@${username} `);
        textareaRef.current.focus();
    };

    const parseReply = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
    
        const withUrls = text.replace(urlRegex, (url) => `<a href='${url}' target='_blank'>${url}</a>`);
        
        const withLineBreaks = withUrls.replace(/\n/g, '<br />');
      
        return <div dangerouslySetInnerHTML={{ __html: withLineBreaks }} />;
    };
    const parseComment = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        //replace URLs with anchor tags
        const withUrls = text.replace(urlRegex, (url) => `<a href='${url}' target='_blank'>${url}</a>`);
        //replace new lines with <br /> tags
        const withLineBreaks = withUrls.replace(/\n/g, '<br />');
        //return parsed HTML
        return <div dangerouslySetInnerHTML={{ __html: withLineBreaks }} />;
    };


    useEffect(() => {
        const fetchPostAndComments = async() => {
            try {

                //Fetch post details
                const postResponse = await axios.get(`/post/get-post/${postId}`);
                if(postResponse.status === 200){
                    setPost(postResponse.data.post);
                } else{
                    throw new Error('Failed to fetch post');
                }

                //Fetch comment details
                const commentResponse = await axios.get(`/comment/get-comment-detail/${postId}/${commentId}`);
                if(commentResponse.status === 200){
                    setComment(commentResponse.data.comment);
                } else{
                    throw new Error('Failed to fetch comment');
                }

                //Fetch replies for the comment
                const replyResponse = await axios.get(`/reply/get-reply/${postId}/${commentId}`);
                if(replyResponse.status === 200){
                    setReplies(replyResponse.data.replies);
                } else{
                    throw new Error('Failed to fetch replies');
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchPostAndComments();
    }, [postId, commentId]);


    const handleReply = async() => {
        try {
            
            let response;
            if(admin){
                response = await axios.post('/reply/create-reply-admin', {
                    postId,
                    commentId,
                    reply: replyText
                });
            } else{
                response = await axios.post('/reply/create-reply', {
                    postId,
                    commentId,
                    reply: replyText
                });
            }

        
            if(response.status === 201){
            
                const replyResponse = await axios.get(`/reply/get-reply/${postId}/${commentId}`);
                if(replyResponse.status === 200){
                    setReplies(replyResponse.data.replies);
                } else{
                    throw new Error('Failed to fetch replies');
                }
                
                setReplyText('');
            } else{
                throw new Error('Failed to create reply');
            }

            //create notifications for reply
            await axios.post(admin ? '/notification/create-notification-admin' : '/notification/create-notification', {
                postId,
                commentId,
                notificationType: 'reply',
                content: {postId, commentId, replyText}
            });
    
        } catch (error) {
            console.error(error);
        }
    };


    const handleKeyDown = (e) => {
        if(e.key === 'Enter' && !e.shiftKey){
            e.preventDefault();
            handleReply();
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
    <div className={`card ${darkMode ? 'dark-mode' : ''}`}>
        <div className='card-body'>
            
            {/* posts */}
            {
                post && (
                    <div>
                        {
                            post.admin ? (
                                <p><strong><FontAwesomeIcon icon={faCheckCircle} style={{ color: 'blue', marginLeft: '5px' }} /> {post.admin.username}'s</strong> post.</p>
                            ) : (
                                post.user && (
                                    <p><strong>{post.user.name}'s</strong> post.</p>
                                )
                            )
                        }
                        <p>{post.post}</p>
                    </div>
                )
            }

            {/* comments */}
            <div className='mt-5 m-lg-5'>
                {
                    comment && (
                        <div className='comment-container'>

                            <div className='d-flex'>
                                <div className='ml-2'>
                                    {
                                        comment.admin ? (
                                            <img src={adminProfile} 
                                            style={{ width: 25, height: 25, borderRadius: '50%' }}
                                            alt='Profile' />
                                        ) : (
                                            comment.user && (
                                                <img src={comment.user.image} 
                                                style={{ width: 25, height: 25, borderRadius: '50%' }}
                                                alt='Profile' />
                                            )
                                        )
                                    }
                                </div>
                                &nbsp;
                                <div className={`comment-wrapper ${darkMode ? 'dark-mode-comment' : ''}`}>
                                    {
                                        comment.admin ? (
                                            <Link to={`/home/post/profile/${comment.admin._id}`}
                                            className={`d-flex ${darkMode ? 'dark-mode-text' : ''}`} style={{ textDecoration: 'none', color: 'black' }}>
                                            <h6>&nbsp;{comment.admin.username}
                                                <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'blue', marginLeft: '5px' }} />
                                            </h6>
                                            </Link>
                                        ) : (
                                            comment.user && (
                                                <Link to={`/home/post/profile/${comment.user._id}`}
                                                className={`d-flex ${darkMode ? 'dark-mode-text' : ''}`} style={{ textDecoration: 'none', color: 'black' }}>
                                                <h6>&nbsp;{comment.user.name}</h6>
                                                </Link>
                                            )
                                        )
                                    }
                                    
                                    <p className='comment-comment'>
                                        {parseComment(comment.comment)}
                                    </p>
                                </div>
                            </div>
                            <div className='d-flex mt-2'>
                                <p className='comment-date'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{formatRelativeTime(comment.date)}</p>

                                <Link
                                style={{ textDecoration: 'none', color: 'grey' }}
                                onClick={() => handleReplyClick(comment.admin ? comment.admin.username : comment.user.name)}
                                >
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Reply
                                </Link>
                            </div>



                            {/* replies */}
                            {
                                replies.length > 0 && (
                                    <>
                                        <div className='reply-container'>
                                            
                                            {
                                                replies.map((reply, index) => (
                                                    <div key={index}>

                                                        <div className='d-flex'>

                                                            &nbsp;&nbsp;&nbsp;<div className='ml-2'>
                                                                {
                                                                    reply.admin ? (
                                                                        <img src={adminProfile} 
                                                                        style={{ width: 25, height: 25, borderRadius: '50%' }} 
                                                                        alt='Profile' />
                                                                    ) : (
                                                                        reply.user && (
                                                                            <img src={reply.user.image} 
                                                                            style={{ width: 25, height: 25, borderRadius: '50%' }} 
                                                                            alt='Profile' />
                                                                        )
                                                                    )
                                                                }
                                                                </div>
                                                                &nbsp;
                                                                <div className={`reply-wrapper ${darkMode ? 'dark-mode-comment' : ''}`}>
                                                                    {
                                                                        reply.admin ? (
                                                                            <Link to={`/home/post/profile/${reply.admin._id}`}
                                                                            className={`d-flex ${darkMode ? 'dark-mode-text' : ''}`} style={{ textDecoration: 'none', color: 'black' }}>
                                                                            <h6>&nbsp;{reply.admin.username}
                                                                                <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'blue', marginLeft: '5px' }} />
                                                                            </h6>
                                                                            </Link>
                                                                        ) : (
                                                                            reply.user && (
                                                                                <Link to={`/home/post/profile/${reply.user._id}`}
                                                                                className={`d-flex ${darkMode ? 'dark-mode-text' : ''}`} style={{ textDecoration: 'none', color: 'black' }}>
                                                                                <h6>&nbsp;{reply.user.name}</h6>
                                                                                </Link>
                                                                            )
                                                                        )
                                                                    }
                                                                    <p className='reply-reply'>
                                                                        {parseReply(reply.reply)}
                                                                    </p>
                                                                </div>
                                                            
                                                        </div>
                                                        <div className='d-flex mt-2'>
                                                            <p className='reply-date'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{formatRelativeTime(reply.date)}</p>

                                                            <Link
                                                            style={{ textDecoration: 'none', color: 'grey' }}
                                                            onClick={() => handleReplyClick(reply.admin ? reply.admin.username : reply.user.name)}
                                                            >
                                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Reply
                                                            </Link>

                                                            <Link
                                                            style={{ textDecoration: 'none', color: 'grey' }}
                                                            onClick={() => buttonDeleteReply(reply._id)}
                                                            >
                                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Delete
                                                            </Link>
                                                            
                                                        </div>

                                                        {/* modal delete reply */}
                                                        {
                                                            showDeleteConfirmationReply && replyIdToDelete === reply._id &&(
                                                            <div className='modal' tabIndex='-1' role='dialog' style={{ display: 'block' }}>
                                                                <div className='modal-dialog modal-dialog-centered' role='document'>
                                                                <div className={`modal-content ${darkMode ? 'dark-mode' : ''}`}>
                                                                    <div className='modal-body'>
                                                                    <h6>Are you sure you want to delete?</h6>
                                                                    </div>
                                                                    <div className='modal-footer justify-content-between'>
                                                                        <button type='button' className={`btn ${darkMode? 'dark-mode-text' : ''}`} 
                                                                        onClick={() => setShowDeleteConfirmationReply(false)}
                                                                        >
                                                                        NO
                                                                        </button>
                                                                        <button type='button' className='btn'
                                                                        onClick={() => { handleDeleteReply(reply._id); setShowDeleteConfirmationReply(false) }}
                                                                        >
                                                                        <span className='text-primary'>YES</span>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                </div>
                                                            </div>
                                                            )
                                                        }
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    )
                }
            </div>


            <div className='d-flex mt-4 flex-grow-1' style={{ marginLeft: '100px' }}>
                {
                    user && !admin ? (
                        <>
                            {
                                user.image && (
                                    <img
                                    src={user.image}
                                    style={{ width: 30, height: 30, borderRadius: '50%' }}
                                    className='mr-2'
                                    alt='Your profile picture'
                                    />
                                )
                            }
                        </>
                    ) : (
                        <>
                            {
                                admin && (
                                    <img
                                    src={adminProfile}
                                    style={{ width: 30, height: 30, borderRadius: '50%' }}
                                    className='mr-2'
                                    alt='Your profile picture'
                                    />
                                )
                            }
                        </>
                    )
                }
                &nbsp;
                <div className='d-flex align-items-center flex-grow-1'>   
                    <textarea
                    ref={textareaRef}
                    type='text'
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className={`form-control ${darkMode ? 'dark-mode' : ''}`}
                    placeholder='Write a reply...'
                    onKeyDown={handleKeyDown}
                    ></textarea>
                </div>
            </div>
        </div>
        <br />
    </div>
  );
}
