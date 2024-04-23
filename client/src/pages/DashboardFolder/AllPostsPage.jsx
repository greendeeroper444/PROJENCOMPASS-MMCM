import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faEllipsisVertical, faFilePdf, faListAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { MenuItem } from '@mui/material';
import toast from 'react-hot-toast';


export default function AllPostsPage() {
    const [posts, setPosts] = useState([]);
    const {darkMode} = useAuth();
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

    const showPdf = (pdf) => {
        window.open(`${pdf}`, '_blank', 'noreferrer');
    }
    
    //submit
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
                setPosts(posts.filter(post => post._id !== postId));
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


    const isLongDescription = (description) => {
        const wordCount = description.split(/\s+/).length;
        return wordCount > 30;
    };

    useEffect(() => {
        const fetchPosts = async() => {
            try {
                const response = await axios.get('/post/get-own-post');
                if(response.status === 200){
                    const sortedPosts = response.data.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
                    setPosts(sortedPosts);
                } else{
                    throw new Error('Failed to fetch posts');
                }
            } catch (error) {
                console.error(error);
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
                            <div className='col mt-5'>
                                
                                <div className='mt-4'>
                                    <h5 className={`${darkMode ? 'dark-mode-text' : ''}`}><FontAwesomeIcon icon={faListAlt} /> 
                                    &nbsp; {posts.length <= 1 ? 'Your Post' : 'Your Posts'}
                                    </h5>
                                    <span className='small-text'>You can update and delete your post</span>
                                    {
                                        posts.length === 0 ? (
                                            <ul className='list-group'>
                                                <li className={`list-group-item text-center ${darkMode ? 'dark-mode' : ''}`}>No posts yet.</li>
                                            </ul>
                                        ) : ( 
                                                posts && posts.map((post, index) => (
                                                    <div key={post._id} className={`card ${darkMode ? ' dark-mode' : ''}`}>
                                                        
                                                        <button className='menu-button' onClick={() => handleClick(post._id)} aria-expanded={Boolean(openMenus[post._id])}>
                                                            <FontAwesomeIcon icon={faEllipsisVertical} color={`${darkMode? 'white' : 'dark'}`} />
                                                        </button>
                                                        
                                                        {
                                                            openMenus[post._id] &&
                                                                <div className={`menu-list mt-4 ${darkMode ? 'dark-mode' : ''}`} >
                                                                    <MenuItem className='menu-item' 
                                                                    onClick={() => handleUpdate(post._id)}
                                                                    >Update</MenuItem>
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

                                                        <Link to={`/home/post/detail/${post._id}`} style={{ textDecoration: 'none' }} className='card-body'>
                                                            <div className='d-flex align-items-center mb-2'>

                                                                {/* post profile */}
                                                                {
                                                                    post.user && (
                                                                        <>
                                                                            <img
                                                                                src={post.user.image}
                                                                                style={{ width: 30, height: 30, borderRadius: '50%' }}
                                                                                className='mr-2'
                                                                                alt='User Profile'
                                                                            />
                                                                            &nbsp;
                                                                            <h6 className='card-subtitle mb-0 m-lg-1'>{post.user.name}</h6>
                                                                        </>
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
