const AdminModel = require("../models/adminModel");
const CommentModel = require("../models/commentModel");
const NotificationModel = require("../models/notificationModel");
const PostModel = require("../models/postModel");
const ReplyModel = require("../models/replyModel");
const UserModel = require("../models/userModel");
const SearchHistoryModel = require("../models/searchHistoryModel");
const sendTokenAdmin = require("../utils/jwtTokenAdmin");
const { comparePassword } = require("../utils/passwordHashed");
const verifyToken = require("../utils/verifyToken");


const loginAdmin = async(req, res) => {
    try {
        const {username, password} = req.body;

        const admin = await AdminModel.findOne({username});
        if(!admin){
            return res.status(404).json({
                error: 'No admin exist'
            })
        }


        const correctPassword = await comparePassword(password, admin.password);
        if(correctPassword){
            sendTokenAdmin(admin, 200, res, 
                {message: 'Login Successfully!'}
            );
        } else{
            return res.status(404).json({
                error: 'Password don\'t match'
            })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: 'Interval error'
        })
    }
}

const getAdminProfile = (req, res) => {
    const token = req.cookies.token;

    if(token){
        verifyToken(token, (err, admin) => {
            if(err){
                throw err;
            } else{
                res.json(admin);
            }
        });
    } else {
        res.json(null);
    }
};


const getAllUsers = async(req, res) => {
    try {
        
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({ 
                error: 'Unauthorized - Missing token' 
            });
        }
        
        verifyToken(token, async(err, decodedToken) => {
            if(err) throw err;

            try {
                const users = await UserModel.find();
                res.json(users);
            } catch (error) {
                res.status(500).json({ 
                    error: 'Internal server error' 
                });
            }
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
}


const deleteUser = async(req, res) => {
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({ 
                error: 'Unauthorized - Missing token' 
            });
        }

        verifyToken(token, async(err, decodedToken) => {
            if(err){
                return res.json({ 
                    error: 'Unauthorized - Invalid token' 
                });
            }

            const userId = req.params.userId;

            const deletedUser = await UserModel.findByIdAndDelete(userId);
            if(!deletedUser){
                return res.json({ 
                    error: 'User not found' 
                });
            }

            
            await SearchHistoryModel.deleteMany({user: userId});

            await PostModel.deleteMany({user: userId});

            await CommentModel.deleteMany({user: userId});

            await ReplyModel.deleteMany({user: userId});

            //deleting notifications related to the user
            await NotificationModel.deleteMany({
                $or: [
                    {recipient: userId},
                    {sender: userId },
                    {'content.userId': userId}
                ]
            });

            return res.json({ 
                message: 'User and associated data deleted successfully!' 
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
};


module.exports = {
    loginAdmin,
    getAdminProfile,
    getAllUsers,
    deleteUser
}