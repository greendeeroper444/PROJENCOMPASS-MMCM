import React, { useState } from 'react'
import logo from '../assets/logo-mcm.png';
import googleImage from '../assets/google.png';
import backgroundImage from '../assets/background-image.jpg';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginPage() {
    const {setAdmin,darkMode} = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState({
        username: '',
        password: '',
        showPassword: false
    });
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const {username, password} = data;
            const response = await axios.post('/admin/login', {
                username,
                password
            });
            if(response.data.error){
                toast.error(response.data.error);
            } else{
                //Reset form fields individually
                setData({
                    username: '',
                    password: ''
                });
                setAdmin(response.data.admin);
                navigate('/home');
                toast.success(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('An error occurred during login. Please try again later.');
        }
    };

    const handleTogglePassword = () => {
        setData({ ...data, showPassword: !data.showPassword });
    };

    const googleAuth = () => {
        window.open(
            'http://localhost:8080/auth/google',
            '_self'
        );
    };
  return (
    <div className='container-fluid'>
        <div className='row login-page'>
            <div className='col-md-6'>
                <div className='logo-container'>
                    <img src={logo} alt='Mapúa Malayan Colleges Mindanao' className='logo' />
                    <div className='welcome-heading'>
                        <h2 className='text-center'>Welcome to</h2>
                        <h1 className='text-center'>Mapúa Malayan Colleges Mindanao</h1>
                        {/* <h7 className='text-center'>ProjenCompass: Mapua Malayan Collegs Mindanao Student Discussion Hub </h7> */}
                    </div>
                </div>
            </div>
            <div className='col-md-6 login-page-container' style={{ backgroundImage: `url(${backgroundImage})`}}>
                <div className='login-card mt-5'>
                    <div>
                        <h2>Sign in</h2>
                    </div>
                    <form onSubmit={handleLogin}>
                        <div className='form-group mt-4'>
                            <label htmlFor='username'>Username</label>
                            <input
                            type='text'
                            className='form-control mt-2 orange-hover'
                            id='username'
                            value={data.username}
                            onChange={(e) => setData({ ...data, username: e.target.value })}
                            autoComplete='off'
                            />
                        </div>
                        <div className='form-group mt-4'>
                            <label htmlFor='password'>Password</label>
                            <div className='password-input-container'>
                                <input
                                type={data.showPassword ? 'text' : 'password'}
                                className='form-control mt-2 orange-hover'
                                id='password'
                                value={data.password}
                                onChange={(e) => setData({ ...data, password: e.target.value })}
                                />

                                <label className='password-toggle-label mt-4'>
                                    <input
                                    type='checkbox'
                                    className='password-toggle-checkbox'
                                    checked={data.showPassword}
                                    onChange={handleTogglePassword}
                                    />
                                    Show Password
                                </label>
                            </div>
                        </div>
                        <button type='submit' className='orange-button mt-4'>Login</button>
                    </form>
                    <div className='mt-3 text-center'>
                        <hr className='divider' />
                        <span className='divider-text'>Sign in using one of your MCM Account</span>
                        <hr className='divider' />
                    </div>
                    <div className='mt-3'>
                        <button className='mmcm--account' onClick={googleAuth}>
                            <img src={googleImage} alt='Google' className='google-icon' /> MCM Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
