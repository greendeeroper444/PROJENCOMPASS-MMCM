import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function DarkmodePage() {
    const {darkMode, toggleMode} = useAuth();
    const [showModal, setShowModal] = useState(false);

  return (
    <>
        <div className='container-fluid'>
            <div className='row'>

                {/* Content */}
                <div className='d-flex justify-content-center align-items-center vh-100'>
                    <div className='container p-4'>
                        <div className='row row--content'>
                            <div className='col'>
                                <div className={`card text-center p-4 ${darkMode ? 'dark-mode' : ''}`}>
                                    <h1>Dark Mode</h1>
                                    <div className='card-body'>
                                        <p className="card-description">Toggle between light and dark modes for a personalized viewing experience.</p>
                                        <button className={`orange-button ${darkMode ? 'dark-mode-button' : ''}`} onClick={() => setShowModal(true)}>
                                            Toggle Mode
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                
            </div>
        </div>

        {/* Modal */}
        {
            showModal && (
                <div className='modal' tabIndex='-1' role='dialog' style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className='modal-dialog' role='document'>
                        <div className={`modal-content ${darkMode ? 'dark-mode' : ''}`}>
                            <div className='modal-header'>
                                <h5 className='modal-title' style={{ marginRight: 'auto' }}>Modes</h5>
                                <button type='button' className='close' style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0',
                                    fontSize: '1.5rem',
                                    color: '#000'
                                    }} onClick={() => setShowModal(false)}>
                                    <FontAwesomeIcon icon={faTimes} color={`${darkMode? 'white' : 'dark'}`} />
                                </button>
                            </div>
                            <div className='modal-body'>
                                <button className={`btn ${darkMode ? 'btn-light' : 'btn-dark'}`} onClick={() => { toggleMode(); setShowModal(false) }}>
                                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    </>
  );
}
