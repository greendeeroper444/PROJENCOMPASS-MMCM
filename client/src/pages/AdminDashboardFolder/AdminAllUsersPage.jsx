import React, { useEffect, useState } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUsers, faUsersRectangle } from '@fortawesome/free-solid-svg-icons';
import CustomNavbar from '../../components/CustomNavbar';
import SidebarNormalScreen from '../../components/SidebarNormalScreen';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom';


export default function AdminAllUsersPage() {
    const [users, setUsers] = useState([]);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const {darkMode} = useAuth();

    const confirmDelete = (id) => {
        setItemToDelete(id);
        setShowDeleteConfirmation(true);
    };
    //for user delete
    const handleDeleteUser = async(userId) => {
        try {
            const response = await axios.delete(`/admin/delete-user/${userId}`);
            if(response.data.error){
                console.error(response.data.error);
            } else{
                setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
                toast.success(response.data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    //display all users
    useEffect(() => {
        axios.get('/admin/get-all-users')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error(error);
            });
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
                                    <h5 className={`${darkMode ? 'dark-mode-text' : ''}`}><FontAwesomeIcon icon={faUsersRectangle} /> 
                                    &nbsp; {users.length <= 1 ? '1 User' : 'All Users'}
                                    </h5>
                                    {
                                    users.length === 0 ? (
                                        <div className='d-flex justify-content-center align-items-center' style={{ minHeight: '200px' }}>
                                            <p>No student found</p>
                                        </div>
                                    ) : (
                                        <div className='table-responsive' style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                                            <table className='table'>
                                                <thead>
                                                    <tr>
                                                        <th className={`${darkMode ? ' dark-mode' : ''}`}></th>
                                                        <th className={`${darkMode ? ' dark-mode' : ''}`}>Name</th>
                                                        <th className={`${darkMode ? ' dark-mode' : ''}`}>Email</th>
                                                        <th className={`${darkMode ? ' dark-mode' : ''}`}>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        users.map(user => (
                                                            <tr key={user._id}>
                                                                <td className={`${darkMode ? ' dark-mode' : ''}`}>
                                                                    {
                                                                        user.image && <img src={user.image} 
                                                                        alt="User Avatar" 
                                                                        className="rounded-circle mb-3" 
                                                                        style={{ width: '40px', height: '40px' }} />
                                                                    }
                                                                </td>
                                                                <td className={`${darkMode ? ' dark-mode' : ''}`}>{user.name}</td>
                                                                <td className={`${darkMode ? ' dark-mode' : ''}`}>{user.email}</td>
                                                                <td className={`${darkMode ? ' dark-mode' : ''}`}>
                                                                    <Link to={`/admin/dashboard/alluserdetailposts/${user._id}`} className='btn btn-success'>
                                                                        View
                                                                    </Link>
                                                                    {' '}
                                                                    <button className='btn btn-danger' 
                                                                    onClick={() => confirmDelete({ id: user._id, type: 'user' })}>
                                                                        Delete
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    )
                                }
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    {/* modal delete */}
                    {
                        showDeleteConfirmation && (
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
                                        <button type='button' className='btn btn-danger' onClick={() => {
                                            if (itemToDelete && itemToDelete.type === 'user') {
                                                handleDeleteUser(itemToDelete.id);
                                            }
                                            setShowDeleteConfirmation(false)
                                        }}>Yes</button>
                                    </div>
                                </div>
                                </div>
                            </div>
                        )
                    }
                    

                </div>
            </div>
        </div>
    </>
  );
}
