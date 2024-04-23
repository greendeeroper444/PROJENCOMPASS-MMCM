import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBriefcase, faLock, faComments, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import logoImage from '../assets/nobg.png';
import { useAuth } from '../../contexts/AuthContext';

export default function AboutPage() {
    const {darkMode} = useAuth();

    return (
        <>
            <div className='container-fluid home--content'>
                <div className='row'>

                    {/* Content */}
                    <div className='col'>
                        <div className='container'>
                            <div className='mt-5 row row--content'>
                                <div className={`col mt-5 ${darkMode ? 'dark-mode' : ''}`} style={{ backgroundColor: 'white' }}>
                                        <h1 className='text-center mt-5'>ABOUT</h1>
                                    <div className='mt-5'>
                        
                                        <div className='icon-text'>
                                            <FontAwesomeIcon icon={faUser} color='red' className='icon' />
                                            <p>MMCMate is a user-friendly discussion hub designed specifically for SHS Capstone Research developers at Mapúa Malayan Colleges Mindanao. It serves as a dynamic platform where students can seamlessly engage in discussions, access educational resources, and collaborate with peers in a secure setting.</p>
                                        </div>
                                        <div className='icon-text'>
                                            <FontAwesomeIcon icon={faBriefcase} color='red' className='icon' />
                                            <p>The goal of MMCMate is to streamline research processes by providing advanced search functionalities, user-friendly interfaces, and personalized user experiences. It aims to facilitate knowledge exchange and networking within the academic community, promoting academic success and research productivity.</p>
                                        </div>
                                        <div className='icon-text'>
                                            <FontAwesomeIcon icon={faLock} color='red' className='icon' />
                                            <p>MMCMate is developed with a focus on academic integrity and data privacy. Content moderation is implemented to ensure compliance with academic standards, and ethical considerations are followed regarding user data privacy and transparency.</p>
                                        </div>
                                        <div className='icon-text'>
                                            <FontAwesomeIcon icon={faComments} color='red' className='icon' />
                                            <p>Through MMCMate, students, educators, researchers, and future developers can benefit from enhanced collaboration, access to relevant resources, and a supportive academic environment.</p>
                                        </div>
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
