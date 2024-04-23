const express = require('express');
const { loginAdmin, getAdminProfile, getAllUsers, deleteUser } = require('../controllers/adminController');
const router = express.Router();

router.post('/login', loginAdmin);
router.get('/profile', getAdminProfile);
router.get('/get-all-users', getAllUsers)
router.delete('/delete-user/:userId', deleteUser);

module.exports = router;