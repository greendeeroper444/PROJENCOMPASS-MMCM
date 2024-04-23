import React, { useEffect, useRef, useState } from 'react'
import { MenuItem } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCloudUploadAlt, faComment, faEllipsisVertical, faEnvelope, faExpand, faFilePdf, faHeart, faShare, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import adminProfile from '../assets/admin.png';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function ContentPostDetail() {
    const navigate = useNavigate();
    const {user, admin, darkMode} = useAuth();
    const [post, setPost] = useState(null);
    const {postId} = useParams();
    const [commentText, setCommentText] = useState('');
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('Update-Post');
    const [formData, setFormData] = useState({
        question: '',
        title: '',
        description: '',
        author: '',
        pdf: ' '
    });
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [showDeleteConfirmationComment, setShowDeleteConfirmationComment] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState(null);

    //delete reply
    const handleDeleteComment = async(commentId) => {
        try {
            const response = await axios.delete(admin? `/comment/delete-comment-admin/${commentId}` : `/comment/delete-comment/${commentId}`);
            if(response.data.error){
                toast.error(response.data.error);
            }else{
                toast.success(response.data.message);
                setPost((prevPost) => ({
                    ...prevPost,
                    comments: prevPost.comments.filter((comment) => comment._id !== commentId),
                }));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const buttonDeleteComment = (id) => {
        setCommentIdToDelete(id);
        setShowDeleteConfirmationComment(true);
    };




    //to focus on the textarea when the "Comment" link is clicked
    const textareaRef = useRef(null);
    const handleCommentClick = () => {
        textareaRef.current.focus();
    };

    
    const [showDropdown, setShowDropdown] = useState(false);
    const handleMouseEnter = (postId) => {
        setShowDropdown(postId);
    };
    const handleMouseLeave = () => {
        setShowDropdown(null);
    };

    const [savedPost, setSavedPost] = useState(false);
    useEffect(() => {
        if (post && post.isSaved !== undefined) {
            setSavedPost(post.isSaved);
        }
    }, [post]);

    const savePost = async(postId) => {
        try {
            setSavedPost(!savedPost);

            await axios.post(admin? '/post/save-post-admin' : '/post/save-post', { postId });
            const message = savedPost ? 'Post unsaved successfully!' : 'Post saved successfully!';
            toast.success(message);
        } catch (error) {
            console.error(error);
            toast.error('Failed to save post');
        }
    };


    
    const parseComment = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        //replace URLs with anchor tags
        const withUrls = text.replace(urlRegex, (url) => `<a href='${url}' target='_SELF'>${url}</a>`);
        //replace new lines with <br /> tags
        const withLineBreaks = withUrls.replace(/\n/g, '<br />');
        //return parsed HTML
        return <div dangerouslySetInnerHTML={{ __html: withLineBreaks }} />;
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






    const handleUpdateSubmit = async(e) => {
        e.preventDefault();
    
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('question', formData.question);
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('author', formData.author);
            formDataToSend.append('pdf', formData.pdf);
    
            const response = await axios.put(`/post/update-post/${selectedPostId}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            if(response.data.error){
                toast.error(response.data.error);
            } else {
                setFormData({
                    question: '',
                    title: '',
                    description: '',
                    author: '',
                    pdf: null,
                });
                toast.success(response.data.message);
                setShowModal(false);
                location.reload(true);
            }
        } catch (error) {
            console.error(error);
            toast.error('Error updating data. Please try again later.');
        }
    };
    
    const handleChange = (e, fieldName) => {
        const {value} = e.target;
        setFormData((prevFormData) => ({
          ...prevFormData,
          [fieldName]: value,
        }));
      };
    const handleFileChange = (e) => {
        setFormData({...formData, pdf: e.target.files[0]});
    };


    const handleModalTypeChange = (type) => {
        setModalType(type);
    };

    const handleUpdate = (postId) => {
        setShowModal(true);
        setModalType('Update-Post');
        setSelectedPostId(postId);
    };
    
    useEffect(() => {
        const fetchPostData = async() =>{
            try {
                const response = await axios.get(`/post/get-post/${selectedPostId}`);
                const {question, title, description, author, pdf} = response.data.post;
                setFormData({
                    question: question || '',
                    title: title || '',
                    description: description || '',
                    author: author || '',
                    pdf: pdf ? pdf.split('/').pop() : ''
                });
            } catch (error) {
                console.error(error);
            }
        };

        if(selectedPostId){
            fetchPostData();
        }
    }, [selectedPostId]);
    





    //delete 
    const handleDeletePost = async(postId) => {
        try {
            const response = await axios.delete(`/post/delete-post/${postId}`);
            if(response.data.error){
                toast.error(response.data.error);
            }else{
                toast.success(response.data.message);
                navigate('/home')
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = (id) => {
        setPostIdToDelete(id);
        setShowDeleteConfirmation(true);
    };


    const [openMenus, setOpenMenus] = useState({});
    const handleClick = (postId) => {
        setOpenMenus(prevState => ({
            ...prevState,
            [postId]: !prevState[postId]
        }));
    };




    //comment
    const handleComment = async() => {
        try {

            //create coomment for both user and admin
            await axios.post(admin ? `/comment/create-comment-admin` : `/comment/create-comment`, {
                postId,
                comment: commentText
            });
    
            //get comment both user and amdin
            const commentResponse = await axios.get(`/comment/get-comment/${postId}`);
            if(commentResponse.status === 200){
                setPost((prevPost) => ({
                    ...prevPost,
                    comments: commentResponse.data.comments,
                }));
            } else{
                throw new Error('Failed to fetch comments');
            }


            //create notifications for comment
            await axios.post(admin ? '/notification/create-notification-admin' : '/notification/create-notification', {
                postId,
                notificationType: 'comment',
                content: {postId, commentText}
            });
    
    
    
            setCommentText('');
        } catch (error) {
            console.error(error);
        }
    };
    


    useEffect(() => {
        const fetchPostAndComments = async() => {
            try {
                const postResponse = await axios.get(`/post/get-post/${postId}`);
                if(postResponse.status === 200){
                    setPost(postResponse.data.post);
                } else{
                    throw new Error('Failed to fetch post');
                }

                const commentResponse = await axios.get(`/comment/get-comment/${postId}`);
                if(commentResponse.status === 200){
                    setPost((prevPost) => ({
                        ...prevPost,
                        comments: commentResponse.data.comments,
                    }));
                } else{
                    throw new Error('Failed to fetch comments');
                }

            } catch (error) {
                console.error(error);
            }
        };

        fetchPostAndComments();
    }, [postId]);

    const handleKeyDown = (e) => {
        if(e.key === 'Enter' && !e.shiftKey){
            e.preventDefault();
            handleComment();
        }
    };
    


    const showPdf = (pdf) => {
        window.open(`${pdf}`, '_blank', 'noreferrer');
    }


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
    <div>
        {
            post ? (
                <div className={`card ${darkMode ? 'dark-mode' : ''}`}>
                    {
                        admin && (
                            <button className='menu-button' onClick={() => handleClick(post._id)} aria-expanded={Boolean(openMenus[post._id])}>
                                <FontAwesomeIcon icon={faEllipsisVertical} color={`${darkMode? 'white' : 'dark'}`} />
                            </button>
                        )
                    }
                    {
                        openMenus[post._id] &&
                            <div className={`menu-list mt-4 ${darkMode ? 'dark-mode' : ''}`} >
                                <MenuItem className='menu-item' onClick={() => handleUpdate(post._id)}>Update</MenuItem>
                                <MenuItem className='menu-item' onClick={() => handleDelete(post._id)}>Delete</MenuItem>
                            </div>
                    }

                    {/* Modal update post */}
                    {
                        showModal && selectedPostId && (
                            <div className='modal' tabIndex='-1' role='dialog' style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                <div className='modal-dialog' role='document'>
                                    <div className={`modal-content ${darkMode ? 'dark-mode' : ''}`}>
                                        <div className='modal-header'>
                                            <button 
                                                className={`ask-share ${modalType === 'Update-Post' ? 'selected' : ''}`} 
                                                onClick={() => handleModalTypeChange('Update-Post')}
                                            >
                                                Update Question
                                            </button>
                                            <button 
                                                className={`ask-share ${modalType === 'Create-Post' ? 'selected' : ''}`} 
                                                onClick={() => handleModalTypeChange('Create-Post')}
                                            >
                                                Update Post
                                            </button>
                                        </div>
                                        <form 
                                        onSubmit={handleUpdateSubmit}
                                        >
                                            <div className='modal-body'>
                                                {
                                                    modalType === 'Update-Post' ? (
                                                        <textarea 
                                                        className={`form-control ${darkMode ? 'dark-mode' : ''}`} 
                                                        rows='5' 
                                                        placeholder='Update your question here...'
                                                        value={formData.question}
                                                        onChange={(e) => handleChange(e, 'question')}
                                                        ></textarea>
                                                    ) : (
                                                        <>
                                                            <input 
                                                            type='text' 
                                                            className={`form-control ${darkMode ? 'dark-mode' : ''}`} 
                                                            placeholder='Title' 
                                                            value={formData.title}
                                                            onChange={(e) => handleChange(e, 'title')}

                                                            />
                                                            <textarea 
                                                            className={`form-control mt-2 ${darkMode ? 'dark-mode' : ''}`} 
                                                            rows='5' 
                                                            placeholder='Description/Content'
                                                            value={formData.description}
                                                            onChange={(e) => handleChange(e, 'description')}
                                                            ></textarea>
                                                            <input 
                                                            type='text' 
                                                            className={`form-control mt-2 ${darkMode ? 'dark-mode' : ''}`} 
                                                            placeholder='Author'
                                                            value={formData.author}
                                                            onChange={(e) => handleChange(e, 'author')} 
                                                                />
                                                                
                                                            <input 
                                                            className={`form-control mt-2 ${darkMode ? 'dark-mode' : ''}`}
                                                            value={formData.pdf ? (typeof formData.pdf === 'string' ? formData.pdf : formData.pdf.name) : ''}
                                                            />
                                                        </>
                                                    )
                                                }
                                            </div>
                                            <div className='modal-footer'>
                                                <label className={`btn btn-light ${darkMode ? 'dark-mode' : ''}`}>
                                                    <FontAwesomeIcon icon={faCloudUploadAlt} className='mr-2' /> Browse File
                                                    <input type='file' style={{ display: 'none' }}  onChange={handleFileChange} name='pdf' accept='.pdf' />
                                                </label>
                                                <button type='submit' className='btn btn-primary'>Submit</button>
                                                <button type='button' className='btn btn-secondary' onClick={() => setShowModal(false)}>Close</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )
                    }


                    {/* modal delete */}
                    {
                        showDeleteConfirmation && postIdToDelete === post._id && (
                            <div className='modal' tabIndex='-1' role='dialog' style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                <div className='modal-dialog' role='document'>
                                <div className={`modal-content ${darkMode ? 'dark-mode' : ''}`}>
                                    <div className='modal-header'>
                                    <h5 className='modal-title' style={{ marginRight: 'auto' }}> Confirmation</h5>
                                    <button
                                    type='button'
                                    className='close'
                                    onClick={() => setShowDeleteConfirmation(false)}
                                    style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0',
                                    fontSize: '1.5rem',
                                    color: '#000'
                                    }}
                                    >
                                        <FontAwesomeIcon icon={faTimes} color={`${darkMode? 'white' : 'dark'}`} />
                                    </button>
                                    </div>
                                    <div className='modal-body'>
                                        <p>Are you sure you want to delete?</p>
                                    </div>
                                    <div className='modal-footer'>
                                        <button type='button' className='btn btn-secondary' onClick={() => setShowDeleteConfirmation(false)}>No</button>
                                        <button type='button' className='btn btn-danger' onClick={() => { handleDeletePost(post._id); setShowDeleteConfirmation(false) }}> Yes</button>
                                    </div>
                                </div>
                                </div>
                            </div>
                        )
                    }


                    <div className='card-body'>
                        
                        <div>
                            <div className='position-relative'>
                                {/* Post profile */}
                                {
                                    post.admin ? (
                                        <div className='d-flex'>
                                            <img
                                            src={adminProfile}
                                            style={{ width: 30, height: 30, borderRadius: '50%', cursor: 'pointer' }}
                                            className='mr-2'
                                            alt='Admin Profile'
                                            onMouseEnter={() => handleMouseEnter(post._id)}
                                            onMouseLeave={() => handleMouseLeave()}
                                            />
                                            <h6 className='card-subtitle mb-0 m-lg-1'
                                            style={{ cursor: 'pointer' }}
                                            onMouseEnter={() => handleMouseEnter(post._id)}
                                            onMouseLeave={() => handleMouseLeave()}
                                            >{post.admin.username}</h6>
                                            <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'blue' }} />
                                        </div>
                                    ) : (
                                        post.user && (
                                            <div className='d-flex'>
                                                <img
                                                src={post.user.image}
                                                style={{ width: 30, height: 30, borderRadius: '50%', cursor: 'pointer' }}
                                                className='mr-2'
                                                alt='User Profile'
                                                onMouseEnter={() => handleMouseEnter(post._id)}
                                                onMouseLeave={() => handleMouseLeave()} 
                                                />
                                                <h6 className='card-subtitle mb-0 m-lg-1'
                                                style={{ cursor: 'pointer' }}
                                                onMouseEnter={() => handleMouseEnter(post._id)}
                                                onMouseLeave={() => handleMouseLeave()} 
                                                >{post.user.name}</h6>
                                            </div>
                                        )
                                    )
                                }

                                {/* Dropdown */}
                                {
                                    showDropdown === post._id && (
                                        <div className='user-dropdown position-absolute'
                                            onMouseEnter={() => handleMouseEnter(post._id)}
                                            onMouseLeave={() => handleMouseLeave()} >
                                            
                                            <div className={`user-dropdown-content ${darkMode ? 'user-dropdown-darkmode' : ''}`}>

                                                {
                                                    post.admin ? (
                                                        <div className='d-flex'>
                                                            <img
                                                                src={adminProfile}
                                                                style={{ width: 50, height: 50, borderRadius: '50%' }}
                                                                className='mr-2'
                                                                alt='Admin Profile'
                                                            />
                                                            <div className='d-flex'>
                                                                <h5 style={{ cursor: 'context-menu' }} className='card-subtitle mb-0 m-lg-1'>{post.admin.username}</h5>
                                                                <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'blue' }} />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        post.user && (
                                                            <div className='d-flex'>
                                                                <img
                                                                    src={post.user.image}
                                                                    style={{ width: 50, height: 50, borderRadius: '50%' }}
                                                                    className='mr-2'
                                                                    alt='User Profile'
                                                                />
                                                                <h5 style={{ cursor: 'context-menu' }} className='card-subtitle mb-0 m-lg-1'>{post.user.name}</h5>
                                                            </div>
                                                        )
                                                    )
                                                }
                                                {
                                                    post.admin ? (
                                                        <Link className={`user-dropdown-item ${darkMode ? 'user-dropdown-text-darkmode' : ''}`} to={`/home/post/profile/${post.admin._id}`}>
                                                            <FontAwesomeIcon icon={faExpand} color='grey' /> &nbsp; View {post.admin.username}'s Profile
                                                        </Link>
                                                    ) : (
                                                        post.user && (
                                                            <Link className={`user-dropdown-item ${darkMode ? 'user-dropdown-text-darkmode' : ''}`} to={`/home/post/profile/${post.user._id}`}>
                                                                <FontAwesomeIcon icon={faExpand} color='grey' /> &nbsp; View {post.user.name}'s Profile
                                                            </Link>

                                                        )
                                                    )
                                                }
                                                {
                                                    post.user && post.user.email && (
                                                        <a className={`user-dropdown-item ${darkMode ? 'user-dropdown-text-darkmode' : ''}`} href={`mailto:${post.user.email}`}>
                                                            <FontAwesomeIcon icon={faEnvelope} color='grey' /> &nbsp; Contact {post.user.name} via Email
                                                        </a>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    )
                                }

                            </div>
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
                            <p className='card-text'>{post.description}</p>
                            <p className='card-author'>{post.author ? `- ${post.author}`: ''}</p>
                            <br />
                            <br />
                            {
                                post.pdf && (
                                    <button className={`pdf--button ${darkMode ? 'dark-mode-buttonpdf' : ''}`} onClick={() => showPdf(post.pdf)} >
                                        <FontAwesomeIcon icon={faFilePdf} className='mr-2' style={{ color: 'red' }} /> {post.pdf.split('/').pop()}
                                    </button>
                                )
                            }
                        </div>

                        <br />
                        &nbsp;&nbsp;
                        <div style={{ width: '100%', maxWidth: '400px' }} className='mx-auto'>
                            <div className='d-flex justify-content-between'>
                                <button className={`btn btn-light ${darkMode ? 'dark-mode' : ''}`}
                                onClick={handleCommentClick}
                                >
                                    <FontAwesomeIcon icon={faComment} color={`${darkMode? 'white': 'grey'}`}/>
                                    <span className='comment-post'> Comment</span>
                                </button>
                                <button
                                className={`btn mr-2 ${darkMode ? 'dark-mode' : ''} ${savedPost ? `btn-danger ${darkMode ? 'dark-mode-save' : ''}` : 'btn-light'}`}
                                onClick={() => savePost(post._id)}>
                                    <FontAwesomeIcon icon={faHeart} color={`${savedPost ? 'white' : (darkMode ? 'white' : 'grey')}`} />
                                    <span className={`${savedPost ? 'save-post-saved' : 'save-post'}`}> {savedPost ? 'Saved' : 'Save'}</span>
                                </button>
                                <button className={`btn btn-light ${darkMode ? 'dark-mode' : ''}`} onClick={() => handleShare(post)}>
                                    <FontAwesomeIcon icon={faShare} color={`${darkMode? 'white': 'grey'}`}/>
                                    <span className='share-post'> Share</span>
                                </button>
                            </div>
                        </div>



                        {/* comments */}
                        {
                            post.comments && post.comments.length > 0 ? (
                                <div className='mt-5 m-lg-5'>
                                    <p>{post.comments.length <= 1 ? 'Comment': 'Comments'}</p>
                                    {
                                        post.comments.map((comment, index) => (
                                            <div key={index} className='comment-container'>

                                                <div className='d-flex'>
                                                    <div className='ml-2'>

                                                        {/* comment profile */}
                                                        {
                                                            comment.admin ? (
                                                                <>
                                                                <img 
                                                                src={adminProfile} 
                                                                style={{ width: 25, height: 25, borderRadius: '50%' }} 
                                                                alt='Profile' />  
                                                                </>
                                                            ) : (
                                                                comment.user && (
                                                                    <img 
                                                                    src={comment.user.image} 
                                                                    style={{ width: 25, height: 25, borderRadius: '50%' }} 
                                                                    alt='Profile' />  
                                                                )
                                                            )
                                                        }
                                                        
                                                    </div>
                                                    &nbsp;
                                                    <div className={`comment-wrapper ${darkMode ? 'dark-mode-comment' : ''}`}>

                                                        {/* comment name */}
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
                                                                    className={`d-flex ${darkMode ? 'dark-mode-text' : ''}`} style={{ textDecoration: 'none', color: 'black' }}
                                                                    >
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
                                                
                                                <div className='d-flex'>

                                                    <p className='comment-date'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{formatRelativeTime(comment.date)}</p>

                                                    {/* reply button */}
                                                    <Link 
                                                    to={`/home/post/comment/detail/${post._id}/${comment._id}`} 
                                                    style={{ textDecoration: 'none', color: 'grey' }}
                                                    >
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Reply
                                                    </Link>

                                                    {/* reply counts */}
                                                    <Link
                                                    to={`/home/post/comment/detail/${post._id}/${comment._id}`} 
                                                    style={{ textDecoration: 'none', color: 'grey' }} >
                                                    
                                                    {
                                                        comment.replies.length > 0 &&
                                                            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}</p>
                                                    }
                                                    </Link>

                                                    <Link
                                                    style={{ textDecoration: 'none', color: 'grey' }}
                                                    onClick={() => buttonDeleteComment(comment._id)}
                                                    >
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Delete
                                                    </Link>

                                                </div>
                                                
                                                {/* modal delete comment */}
                                                {
                                                    showDeleteConfirmationComment && commentIdToDelete === comment._id &&(
                                                    <div className='modal' tabIndex='-1' role='dialog' style={{ display: 'block' }}>
                                                        <div className='modal-dialog modal-dialog-centered' role='document'>
                                                        <div className={`modal-content ${darkMode ? 'dark-mode' : ''}`}>
                                                            <div className='modal-body'>
                                                            <h6>Are you sure you want to delete?</h6>
                                                            </div>
                                                            <div className='modal-footer justify-content-between'>
                                                                <button type='button' className={`btn ${darkMode? 'dark-mode-text' : ''}`} 
                                                                onClick={() => setShowDeleteConfirmationComment(false)}
                                                                >
                                                                NO
                                                                </button>
                                                                <button type='button' className='btn'
                                                                onClick={() => { handleDeleteComment(comment._id); setShowDeleteConfirmationComment(false) }}
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
                            ) : (
                                <>
                                <br />
                                <br />
                                <br />
                                <div className='text-center'>
                                    <FontAwesomeIcon icon={faComment} color='grey' className='mr-2' style={{ fontSize: '2rem' }} />
                                    <p><b>No comments yet.</b></p>
                                </div>
                                </>
                            )
                        }

                        <br />
                        <br />



                        
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
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                className={`form-control ${darkMode ? 'dark-mode' : ''}`}
                                placeholder='Write a comment...'
                                onKeyDown={handleKeyDown}
                                ></textarea>
                            </div>
                        </div>

                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )
        }
    </div>
  )
}
