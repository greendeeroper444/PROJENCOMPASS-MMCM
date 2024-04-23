const express = require('express');
const {getProfile, logoutUser} = require('../controllers/userController');
const router = express.Router();
const { googleAuth, googleCallback, setTokenCookie } = require('../passport')

// Google OAuth routes
router.get("/auth/google", googleAuth);
router.get("/auth/google/callback", googleCallback);
router.get('/profile', getProfile);
router.post('/logout', logoutUser);


module.exports = router;