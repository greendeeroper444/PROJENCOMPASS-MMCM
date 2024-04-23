const AdminModel = require("../models/adminModel");
const ReplyModel = require("../models/replyModel");
const verifyToken = require("../utils/verifyToken");



const createReplyOnCommentPost = async(req, res) => {
    try {
        const {postId, commentId, reply} = req.body;
        const userId = req.user._id;

        const newReply = await ReplyModel.create({
            user: userId,
            post: postId,
            comment: commentId,
            userType: 'user',
            reply
        });

        res.status(201).json({ 
            success: true, 
            reply: newReply 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
};

const createReplyOnCommentPostAdmin = async(req, res) => {
    try {

        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({ 
                error: 'Unauthorized - Missing token' 
            });
        }

        verifyToken(token, async(err, decodedToken) => {
            const {postId, commentId, reply} = req.body;
            const adminId = decodedToken.id;

            const newReply = await ReplyModel.create({
                admin: adminId,
                post: postId,
                comment: commentId,
                userType: 'admin',
                reply
            });

            res.status(201).json({ 
                success: true, 
                reply: newReply 
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
};

const getReplyOnCommentsByPost = async(req, res) => {
    try {
        const {postId, commentId} = req.params;

        const replies = await ReplyModel.find({post: postId, comment: commentId}).populate('user').populate('admin');
        res.json({replies});
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
};


const deleteReply = async(req, res) => {
    try {
        if(!req.isAuthenticated()){
            return res.status(401).json({ 
                error: 'Unauthorized - User not authenticated' 
            });
        }

        const userId = req.user._id;
        const replyId = req.params.replyId;

        const reply = await ReplyModel.findById(replyId);

        if(!reply){
            return res.status(404).json({ 
                error: 'Reply not found' 
            });
        }

        if(reply.user.toString() !== userId.toString()){
            return res.json({ 
                error: 'Only the owner can delete this reply.' 
            });
        }


        await reply.deleteOne(); 

        return res.json({
            message: 'Reply deleted successfully!',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
};

const deleteReplyAdmin = async(req, res) => {
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

            const replyId = req.params.replyId;

            const reply = await ReplyModel.findById(replyId);

            if(!reply){
                return res.status(404).json({ 
                    error: 'Reply not found' 
                });
            }
    
            await reply.deleteOne(); 

            return res.json({
                message: 'Reply deleted successfully!',
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
    createReplyOnCommentPost,
    getReplyOnCommentsByPost,
    createReplyOnCommentPostAdmin,
    deleteReply,
    deleteReplyAdmin
}