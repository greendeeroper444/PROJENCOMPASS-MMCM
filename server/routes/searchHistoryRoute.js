const express = require('express');
const { addSearchHistoryAdmin, addSearchHistoryUser, getSearchHistoryAdmin, getSearchHistoryUser, deleteSearchHistoryItemAdmin, deleteSearchHistoryItemUser } = require('../controllers/searchHistoryController');
const router = express.Router();


//user
router.post('/add-search-history/user', addSearchHistoryUser);
router.get('/get-search-history/user', getSearchHistoryUser);
router.delete('/delete-search-history/user/:userId/:searchHistoryId', deleteSearchHistoryItemUser);

//admin
router.post('/add-search-history/admin', addSearchHistoryAdmin);
router.get('/get-search-history/admin', getSearchHistoryAdmin);
router.delete('/delete-search-history/admin/:adminId/:searchHistoryId', deleteSearchHistoryItemAdmin);

module.exports = router;