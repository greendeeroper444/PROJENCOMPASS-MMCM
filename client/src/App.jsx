
import { Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast'
import PostDetailPage from './pages/PostDetailPage';
import CommentDetailPage from './pages/CommentDetailPage';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import backgroundImage from './assets/background-image.jpg';
import backgroundImageDark from './assets/background-image-dark.jpg';
import AboutPage from './pages/AboutPage';
import FaqsPage from './pages/FaqsPage';
import DarkmodePage from './pages/DarkmodePage';
import AdminAllUsersPage from './pages/AdminDashboardFolder/AdminAllUsersPage';
import AdminAllNotificationsPage from './pages/AdminDashboardFolder/AdminAllNotificationsPage';
import AdminAllPostsPage from './pages/AdminDashboardFolder/AdminAllPostsPage';
import AllPostsPage from './pages/DashboardFolder/AllPostsPage';
import AllNotificationsPage from './pages/DashboardFolder/AllNotificationsPage';
import AllSavedPostsPage from './pages/DashboardFolder/AllSavedPostsPage';
import AdminAllSavedPostsPage from './pages/AdminDashboardFolder/AdminAllSavedPostsPage';
import CustomNavbar from './components/CustomNavbar';
import Sidebar from './components/Sidebar';
import SidebarNormalScreen from './components/SidebarNormalScreen';
import AdminAllUserDetailPosts from './pages/AdminDashboardFolder/AdminAllUserDetailPosts';
import ProfilePage from './pages/ProfilePage';

  axios.defaults.baseURL = 'http://localhost:8080';
  axios.defaults.withCredentials = true
function App() {
  const {user, admin, isLoading, darkMode} = useAuth();
  const navigate = useNavigate();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showModalLogout, setShowModalLogout] = useState(false);
  const {setUser, setAdmin} = useAuth();

  const handleLogoutConfirmation = () => {
    setShowModalLogout(true);
  };

  const handleCloseModal = () => {
    setShowModalLogout(false);
  };

  const handleConfirmLogout = () => {
    handleLogout()
    setShowModalLogout(false);
  };

  const handleLogout = async() => {
    try {
      const response = await axios.post('/logout', {}, {
        withCredentials: true
      });
      setUser(null);
      setAdmin(null);
      // setAdmin(null);
      localStorage.removeItem('currentResults');
      localStorage.removeItem('searchPerformed');
      navigate('/');
      toast.success(response.data.message);
    } catch (error) {
        console.log(error);
    }
  };
  


  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
  
  const closeSidebar = () => {
    setSidebarVisible(false);
  };


  useEffect(() => {
    if(!(user || admin)){
      navigate('/', { replace: true });
    }
  }, [user, admin, navigate]);


  useEffect(() => {
    document.body.style.backgroundImage = `url(${darkMode ? backgroundImageDark : backgroundImage})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed'; 

    return () => {
      document.body.style.backgroundImage = 'none';
      document.body.style.backgroundAttachment = 'scroll';
    };
  }, [backgroundImage, backgroundImageDark, darkMode]);




  if(isLoading){
    return <div>Loading...</div>;
  }


  return (
    <div>
      
      <Toaster position='center-top' toastOptions={{
        className: '',
        style: {
          border: '1px solid rgb(255, 8, 0)',
          boxShadow: '0 0 0.2rem rgba(255, 38, 0, 0.5)',
          padding: '10px',
          color: '#713200',
        },
      }}
        containerStyle={{
          top: 100,
        }}
      />
      {
        showModalLogout && (
          <div className='modal' tabIndex='-1' role='dialog' style={{ display: 'block' }}>
            <div className='modal-dialog modal-dialog-centered' role='document'>
              <div className={`modal-content ${darkMode ? 'dark-mode' : ''}`}>
                <div className='modal-body'>
                  <h5>Log out of your account?</h5>
                </div>
                  <div className='modal-footer justify-content-between'>
                    <button type='button' className={`btn ${darkMode? 'dark-mode-text' : ''}`} onClick={handleCloseModal}>
                      CANCEL
                    </button>
                    <button type='button' className='btn' onClick={handleConfirmLogout}>
                      <span className='text-danger'>LOG OUT</span>
                    </button>
                  </div>
              </div>
            </div>
          </div>
        )
        }
        <div className={`modal-backdrop fade ${showModalLogout ? 'show' : ''}`} style={{ display: showModalLogout ? 'block' : 'none' }} onClick={handleCloseModal}></div>
      {
        (user || admin) && <CustomNavbar toggleSidebar={toggleSidebar} />
      }
      {
        (user || admin) && (
          <>
            <div className={`col-sm-3 sidebar ${darkMode ? ' dark-mode-sidebar' : ''} ${sidebarVisible ? 'show' : 'hide'}`}>
              <Sidebar
              showModal={showModalLogout}
              handleLogoutConfirmation={handleLogoutConfirmation}
              handleCloseModal={handleCloseModal}
              handleConfirmLogout={handleConfirmLogout}
              closeSidebar={closeSidebar}
              />
            </div>
            
            <div className={`col-sm-3 sidebar-normal-screen ${darkMode ? ' dark-mode-sidebar' : ''}`}>
              <SidebarNormalScreen 
              showModal={showModalLogout}
              handleLogoutConfirmation={handleLogoutConfirmation}
              handleCloseModal={handleCloseModal}
              handleConfirmLogout={handleConfirmLogout} />
            </div>
          </>
        )
      }
      <Routes>
        <Route path='/' element={<LoginPage />}/>
        {
          (user || admin) && (
            <>
              <Route path='/home' element={<HomePage />}/>
              <Route path='/home/post/detail/:postId' element={<PostDetailPage />}/>
              <Route path='/home/post/comment/detail/:postId/:commentId' element={<CommentDetailPage />}/>
              <Route path='/admin/dashboard' element={<AdminDashboardPage />}/>

              {/* admin */}
              <Route path='/admin/dashboard' element={<AdminDashboardPage />}/>
              <Route path='/admin/dashboard/allusers' element={<AdminAllUsersPage />}/>
              <Route path='/admin/dashboard/allnotifications' element={<AdminAllNotificationsPage />}/>
              <Route path='/admin/dashboard/allposts' element={<AdminAllPostsPage/>}/>
              <Route path='/admin/dashboard/allsaveposts' element={<AdminAllSavedPostsPage />}/>
              <Route path='/admin/dashboard/alluserdetailposts/:authId' element={<AdminAllUserDetailPosts/>}/>

              {/* Users */}
              <Route path='/dashboard' element={<DashboardPage />}/>
              <Route path='/dashboard/allnotifications' element={<AllNotificationsPage />}/>
              <Route path='/dashboard/allposts' element={<AllPostsPage />}/>
              <Route path='/dashboard/allsaveposts' element={<AllSavedPostsPage />}/>

              <Route path='/darkmode' element={<DarkmodePage />}/>
              <Route path='/about' element={<AboutPage />}/>
              <Route path='/faqs' element={<FaqsPage />}/>
              <Route path='/home/post/profile/:authId' element={<ProfilePage/>}/>
            </>
          )
        }
      </Routes>
    </div>
  )
}

export default App
