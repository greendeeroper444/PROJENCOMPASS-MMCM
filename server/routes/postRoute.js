const express = require('express');
const { 
    createPost, 
    getPost, 
    getPostDetails, 
    deletePost, 
    updatePost, 
    searchPosts, 
    createPostAdmin, 
    getOwnPost, 
    getOwnPostAdmin, 
    searchPostSuggests, 
    savePost, 
    getSavedPosts, 
    deletePostAdmin, 
    updatePostAdmin, 
    savePostAdmin, 
    getProfilePosts
} = require('../controllers/postController');
const router = express.Router();


//user
router.post('/create-post', createPost);
router.delete('/delete-post/:postId', deletePost);
router.put('/update-post/:postId', updatePost);
router.get('/get-own-post', getOwnPost);
router.post('/save-post', savePost);


//admin
router.post('/create-post-admin', createPostAdmin);
router.delete('/delete-post-admin/:postId', deletePostAdmin);
router.put('/update-post-admin/:postId', updatePostAdmin);
router.get('/get-own-post-admin', getOwnPostAdmin);
router.post('/save-post-admin', savePostAdmin);


router.get('/get-post', getPost);
router.get('/get-post/:postId', getPostDetails);
router.get('/search', searchPosts);
router.get('/search-suggests', searchPostSuggests);
router.get('/get-saved-posts', getSavedPosts);
router.get('/get-profile-posts/:authId', getProfilePosts);

module.exports = router;