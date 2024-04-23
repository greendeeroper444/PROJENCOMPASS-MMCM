import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';

export default function FaqsPage() {
    const {darkMode} = useAuth();
   
    const faqs = [
        {
            question: 'How do I search for topics or posts?',
            answer: 'To search for topics or posts, use the search bar located at the top of the page. Enter keywords related to the topic you are interested in and press Enter. The system will display relevant results based on your search query.'
        },
        {
            question: 'How do I create a new post?',
            answer: 'To create a new post, navigate to the relevant section (e.g., Discussion or Forum) and click on the "Create Post" button. Fill out the required fields, including the post title, description, and any additional information, then click "Submit" to publish your post.'
        },
        {
            question: 'How do I ask a question?',
            answer: 'To ask a question, navigate to the Discussion or Forum section and click on the "Add Question" button. Then, write your question in the post content area, provide any necessary details or context, and click "Submit" to post your question.'
        },
        {
            question: 'How do I access the dashboard?',
            answer: 'To access the dashboard, click on the Dashboard link in the sidebar. It will show recent posts, notifications, and saved posts.'
        },
        {
            question: 'How do I enable Dark Mode?',
            answer: 'To enable Dark Mode, click on the Dark Mode toggle in the sidebar. It will change the interface to a dark color scheme for better visibility in low-light environments.'
        },
        {
            question: 'Where can I find my profile?',
            answer: 'You can find your profile by clicking on the user name in the post. It will display your user information as well as all your posts.'
        },
        {
            question: 'How do I navigate to the About page?',
            answer: 'To navigate to the About page, click on the About link in the sidebar. It will provide information about the system and its purpose.'
        },
        {
            question: 'How do I access the FAQ section?',
            answer: 'To access the FAQ section, click on the FAQ link in the sidebar. It will display frequently asked questions and their answers.'
        },
        {
            question: 'Where can I find the Logout option?',
            answer: 'You can find the Logout option by clicking on the Logout link in the sidebar. It will log you out of your current session.'
        },
        {
            question: 'How do I view recent posts?',
            answer: 'To view recent posts, click on the Dashboard link in the sidebar. It will display a list of posts sorted by their timestamp.'
        },
        {
            question: 'How do I check notifications?',
            answer: 'To check notifications, click on the Notifications link in the navbarr. It will show any new notifications or alerts.'
        },
        {
            question: 'Where can I find my saved posts?',
            answer: 'You can find your saved posts by clicking on the Dashboard Saved Posts link in the sidebar. It will display a list of posts you have saved for later.'
        },
    ];


  return (
    <>
        <div className='container-fluid home--content'>
            <div className='row'>
                {/* content */}
                <div>
                    <div className='container'>
                        <div className='mt-5 row row--content'>
                            <div className={`col mt-5 ${darkMode ? 'dark-mode' : ''}`} style={{ backgroundColor: 'white' }}>
                                <h1 className='text-center mt-5'>FAQ</h1>
                                <p className='text-center'>Here are some of the MMCM frequenlty asked questions</p>
                                <div className='mt-5'>
                                {
                                    faqs.map((faq, index) => (
                                        <div key={index} className={`mb-4 p-3 ${darkMode ? 'dark-mode-faq' : ''}`} style={{ backgroundColor: '#f2f2f2', borderRadius: '8px' }}>
                                            <div className='d-flex align-items-center'>
                                                <FontAwesomeIcon icon={faBullseye} size='lg' color='red' className='mr-2' />
                                                &nbsp;
                                                <h5 className='mb-0'>{faq.question}</h5>
                                            </div>
                                            <p className='mt-2'>{faq.answer}</p>
                                        </div>
                                    ))
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
