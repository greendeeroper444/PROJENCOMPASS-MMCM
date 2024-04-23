const AdminModel = require("../models/adminModel");
const SearchHistoryModel = require("../models/searchHistoryModel");
const UserModel = require("../models/userModel");
const verifyToken = require("../utils/verifyToken");

const addSearchHistoryAdmin = async(req, res) => {
    try {
        const {query} = req.body;

        if(typeof query !== 'string' || query.trim() === ''){
            return res.status(400).json({ 
                error: 'Query must be a non-empty string' 
            });
        }
        // Authenticate user based on JWT token
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                error: 'Unauthorized - Missing token'
            });
        }
        
        verifyToken(token, async(err, decodedToken) => {
            if(err){
                return res.status(401).json({ 
                    error: 'Unauthorized - Invalid token' 
                });
            }
            const adminId = decodedToken.id;

            const adminExists = await AdminModel.findById(adminId);
            if(!adminExists){
                return res.status(401).json({ 
                    error: 'Unauthorized - Admin does not exist' 
                });
            }

            const searchHistory = new SearchHistoryModel({
                query,
                userType: 'Admin',
                authId: adminId
            });

            await searchHistory.save();
            return res.status(201).json({ 
                message: 'Search history added successfully' 
            });

        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
}

const addSearchHistoryUser = async(req, res) => {
    try {
        const {query} = req.body;

        //authenticate user based on JWT token or session
        if(!req.isAuthenticated()){
            return res.status(401).json({ 
                error: 'Unauthorized - User not authenticated' 
            });
        }

        const userId = req.user._id;
        const userExists = await UserModel.findById(userId);
        if(!userExists){
            return res.status(401).json({ 
                error: 'Unauthorized - User does not exist' 
            });
        }

        const searchHistory = new SearchHistoryModel({
            query,
            userType: 'User',
            authId: userId
        });

        await searchHistory.save();
        return res.status(201).json({
            message: 'Search history added successfully' 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
}


const getSearchHistoryAdmin = async(req, res) => {
    try {

        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                error: 'Unauthorized - Missing token'
            });
        }

        verifyToken(token, async(err, decodedToken) => {
            if(err){
                return res.status(401).json({ 
                    error: 'Unauthorized - Invalid token' 
                });
            }
            const adminId = decodedToken.id;

            const adminExists = await AdminModel.findById(adminId);
            if(!adminExists){
                return res.status(401).json({ 
                    error: 'Unauthorized - Admin does not exist' 
                });
            }

            const searchHistory = await SearchHistoryModel.find({authId: adminId});

            return res.status(200).json(searchHistory);
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal Server Error'
        });
    }
}


const getSearchHistoryUser = async(req, res) => {
    try {
        if(!req.isAuthenticated()){
            return res.status(401).json({ 
                error: 'Unauthorized - User not authenticated' 
            });
        }

        const userId = req.user._id;
        const userExists = await UserModel.findById(userId);
        if(!userExists){
            return res.status(401).json({ 
                error: 'Unauthorized - User does not exist' 
            });
        }

        const searchHistory = await SearchHistoryModel.find({authId: userId});

        return res.status(200).json(searchHistory);
            
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal Server Error'
        });
    }
}


const deleteSearchHistoryItemAdmin = async(req, res) => {
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({ 
                error: 'Unauthorized - Missing token' 
            });
        }

        verifyToken(token, async(err, decodedToken) => {
            if(err){
                return res.status(401).json({ 
                    error: 'Unauthorized - Invalid token' 
                });
            }
            const adminId = decodedToken.id;

            const adminExists = await AdminModel.findById(adminId);
            if(!adminExists){
                return res.status(401).json({ 
                    error: 'Unauthorized - Admin does not exist' 
                });
            }

            const searchHistoryId = req.params.searchHistoryId;
    
            const searchHistory = await SearchHistoryModel.findById(searchHistoryId);
            
            if(!searchHistory || searchHistory.authId.toString() !== adminId.toString()){
                return res.status(404).json({ 
                    error: 'Search history item not found' 
                });
            }

            await SearchHistoryModel.deleteOne({_id: searchHistoryId});
            return res.status(200).json({ 
                message: 'Search history item deleted successfully!' 
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
}

const deleteSearchHistoryItemUser = async(req, res) => {
    try {
        if(!req.isAuthenticated()){
            return res.status(401).json({ 
                error: 'Unauthorized - User not authenticated' 
            });
        }

        const userId = req.user._id;
        const userExists = await UserModel.findById(userId);
        if(!userExists){
            return res.status(401).json({ 
                error: 'Unauthorized - User does not exist' 
            });
        }

        const searchHistoryId = req.params.searchHistoryId;
        
        const searchHistory = await SearchHistoryModel.findById(searchHistoryId);
        
        if(!searchHistory || searchHistory.authId.toString() !== userId.toString()){
            return res.status(404).json({ 
                error: 'Search history item not found' 
            });
        }

        await SearchHistoryModel.deleteOne({_id: searchHistoryId});
        return res.status(200).json({ 
            message: 'Search history item deleted successfully!' 
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
}



module.exports = {
    addSearchHistoryAdmin,
    addSearchHistoryUser,
    getSearchHistoryAdmin,
    getSearchHistoryUser,
    deleteSearchHistoryItemAdmin,
    deleteSearchHistoryItemUser
};