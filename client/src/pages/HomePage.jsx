import React, { useEffect, useState } from 'react';
import logoImage from '../assets/nobg.png';
import { useAuth } from '../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import ContentPost from '../components/ContentPost';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import adminProfile from '../assets/admin.png';

export default function HomePage() {
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('Add-Question');
    const {user, admin, darkMode} = useAuth();
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        question: '',
        title: '',
        description: '',
        author: '',
        pdf: null
    });


    const searchQuery = new URLSearchParams(location.search).get('q');
    useEffect(() => {
        const fetchLists = async() => {
            try {
            const response = await axios.get(`/post/search?q=${searchQuery}`);
            setPosts(response.data);
            } catch (error) {
            console.error(error);
            }
        };
    
        fetchLists();
    }, [searchQuery]);



    const handleChange = (e, fieldName) => {
        const { value } = e.target;
        setFormData((prevFormData) => ({
          ...prevFormData,
          [fieldName]: value,
        }));
      };
    const handleFileChange = (e) => {
        setFormData({ ...formData, pdf: e.target.files[0] });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('question', formData.question);
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('author', formData.author);
            formDataToSend.append('pdf', formData.pdf);

            const response = await axios.post(admin ? '/post/create-post-admin' : '/post/create-post', formDataToSend, {
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

                    //refresh the content post to display the new post
                    fetchPosts();

                    navigate('/home'); 

                    setShowModal(false)
            }
        } catch (error) {
            console.error('Error uploading data:', error);
            toast.error('Error uploading data. Please try again later.');
        }
    };


    const fetchPosts = async() => {
        try {
            const response = await axios.get('/post/get-post');
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

    useEffect(() => {
        fetchPosts();
    }, []);



    const handleInputClick = () => {
        setShowModal(true);
        setModalType('Add-Question');
    };

    const handleModalTypeChange = (type) => {
        setModalType(type);
    };

  return (
    <>
      
        <div className='container-fluid home--content'>
            <div className='row'>
                {/* content */}
                <div>
                    <div className='container'>
                        <div className='logo--content'>
                            <img src={logoImage} style={{ width: 350, height: 350, objectFit: 'scale-down' }} alt='Logo' />
                        </div>
                        <div className='row row--content'>
                            <div className='col'>
                                <div className='d-flex align-items-center justify-content-center mb-3'>
                                    {
                                        user && !admin ? (
                                            <>
                                                {
                                                    user.image && (
                                                        <img
                                                            src={user.image}
                                                            style={{ width: 40, height: 40, borderRadius: '50%' }}
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
                                                            style={{ width: 40, height: 40, borderRadius: '50%' }}
                                                            className='mr-2'
                                                            alt='Your profile picture'
                                                        />
                                                    )
                                                }
                                            </>
                                        )
                                    }
                                    <div className='flex-grow-1'>
                                        <input
                                            type='text'
                                            className={`form-control ${darkMode ? 'dark-mode' : ''}`}
                                            style={{ borderRadius: '10px', width: 'calc(100% - 80px)', marginLeft: '10px' }}
                                            placeholder='What do you want to ask or share?'
                                            onClick={handleInputClick}
                                            readOnly
                                        />
                                    </div>
                                </div>


                                {/* Modal */}
                                {
                                    showModal && (
                                        <div className='modal' tabIndex='-1' role='dialog' style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                            <div className='modal-dialog' role='document'>
                                                <div className={`modal-content ${darkMode ? 'dark-mode' : ''}`}>
                                                    <div className='modal-header'>
                                                        <button 
                                                            className={`ask-share ${modalType === 'Add-Question' ? 'selected' : ''}`} 
                                                            onClick={() => handleModalTypeChange('Add-Question')}
                                                        >
                                                            Add Question
                                                        </button>
                                                        <button 
                                                            className={`ask-share ${modalType === 'Create-Post' ? 'selected' : ''}`} 
                                                            onClick={() => handleModalTypeChange('Create-Post')}
                                                        >
                                                            Create Post
                                                        </button>
                                                    </div>
                                                    <form onSubmit={handleSubmit}>
                                                        <div className='modal-body'>
                                                            {
                                                                modalType === 'Add-Question' ? (
                                                                    <textarea 
                                                                    className={`form-control ${darkMode ? 'dark-mode' : ''}`}
                                                                    rows='5' 
                                                                    placeholder='Type your question here...'
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
                                                                        <span className={`form-control mt-2 ${darkMode ? 'dark-mode' : ''}`}>{formData.pdf && <p>Selected File: {formData.pdf.name}</p>}</span>
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
    
                                {/* capstone post */}
                                <ContentPost posts={posts} />

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </>
  );
}
