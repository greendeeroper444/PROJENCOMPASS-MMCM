import React, { useEffect, useState } from 'react'
import HouseIcon from '@mui/icons-material/House';
import InfoIcon from '@mui/icons-material/Info';
import HelpIcon from '@mui/icons-material/Help';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useLocation, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';


export default function Sidebar({ showModal, handleLogoutConfirmation, handleCloseModal, handleConfirmLogout, closeSidebar }) {
    const {user, admin, darkMode} = useAuth();
    const location = useLocation();
    const [activeLink, setActiveLink] = useState('');

    useEffect(() => {
        
        setActiveLink(location.pathname);
    }, [location]);


    const handleLinkClick = () => {
        closeSidebar(); 
    };
  return (
    <div className='pt-3'>
        <ul className='nav flex-column'>
            <li className='nav-item'>
                <NavLink
                to='/home'
                activeClassName='active'
                className={`nav-link d-flex align-items-center ${darkMode ? 'dark-mode-sidebar-text' : ''}`}
                style={{ color: 'black' }}
                onClick={handleLinkClick}
                >
                    <HouseIcon className='mr-2' />
                    <span style={{ marginLeft: '20px', fontSize: '19px' }}>Home</span>
                </NavLink>
            </li>
            {
                user && !admin ? (
                    <>
                       {
                            user && (
                                <li className='nav-item'>
                                    <NavLink
                                    to='/dashboard'
                                    activeClassName='active'
                                    className={`nav-link d-flex align-items-center ${darkMode ? 'dark-mode-sidebar-text' : ''}`}
                                    style={{ color: 'black' }}
                                    onClick={handleLinkClick}
                                    >
                                        <DashboardIcon className='mr-2' />
                                        <span style={{ marginLeft: '20px', fontSize: '19px' }}>Dashboard</span>
                                    </NavLink>
                                </li>
                            )
                       }
                    </>
                ) : (
                    <>
                        {
                            admin && (
                                <li className='nav-item'>
                                    <NavLink
                                    to='/admin/dashboard'
                                    activeClassName='active'
                                    className={`nav-link d-flex align-items-center ${darkMode ? 'dark-mode-sidebar-text' : ''}`}
                                    style={{ color: 'black' }}
                                    onClick={handleLinkClick}
                                    >
                                        <DashboardIcon className='mr-2' />
                                        <span style={{ marginLeft: '20px', fontSize: '19px' }}>Dashboard</span>
                                    </NavLink>
                                </li>
                            )
                        }
                    </>
                )
            }
            <li className='nav-item'>
                <NavLink
                to='/darkmode'
                activeClassName='active'
                className={`nav-link d-flex align-items-center ${darkMode ? 'dark-mode-sidebar-text' : ''}`}
                style={{ color: 'black' }}
                onClick={handleLinkClick}
                >
                    <DarkModeIcon className='mr-2' />
                    <span style={{ marginLeft: '20px', fontSize: '19px' }}>Dark Mode</span>
                </NavLink>
            </li>
            <li className='nav-item'>
                <NavLink
                to='/about'
                activeClassName='active'
                className={`nav-link d-flex align-items-center ${darkMode ? 'dark-mode-sidebar-text' : ''}`}
                style={{ color: 'black' }}
                onClick={handleLinkClick}
                >
                    <InfoIcon className='mr-2' />
                    <span style={{ marginLeft: '20px', fontSize: '19px' }}>About</span>
                </NavLink>
            </li>
            <li className='nav-item'>
                <NavLink
                to='/faqs'
                activeClassName='active'
                className={`nav-link d-flex align-items-center ${darkMode ? 'dark-mode-sidebar-text' : ''}`}
                style={{ color: 'black' }}
                onClick={handleLinkClick}
                >
                    <HelpIcon className='mr-2' />
                    <span style={{ marginLeft: '20px', fontSize: '19px' }}>FAQs</span>
                </NavLink>
            </li>
        </ul>
        <div className='mt-3'>
            <hr style={{ borderTop: '1px solid black' }} /> 
            <button onClick={handleLogoutConfirmation} style={{ color: 'black' }} className={`nav-link d-flex align-items-center ${darkMode ? 'dark-mode-sidebar-text' : ''}`}>
                <ExitToAppIcon className='mr-2' />
                <span style={{ marginLeft: '20px', fontSize: '19px' }}>Logout</span>
            </button>
        </div>
    </div>
  )
}
