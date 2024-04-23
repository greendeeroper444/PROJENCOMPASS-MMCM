const AdminModel = require("../models/adminModel");
const CommentModel = require("../models/commentModel");
const PostModel = require("../models/postModel");
const ReplyModel = require("../models/replyModel");
const verifyToken = require("../utils/verifyToken");


//user comment
const createComment = async(req, res) => {
    try {
        const {postId, comment} = req.body;
        const userId = req.user._id;

         if(!req.user){
            return res.status(401).json({ 
                error: 'Unauthorized - User not authenticated' 
            });
        }

        const post = await PostModel.findById(postId);
        if(!post){
            return res.status(404).json({ 
                error: 'Post not found' 
            });
        }

        const newComment = await CommentModel.create({
            user: userId,
            post: postId,
            userType: 'user',
            comment
        });

        res.status(201).json({ 
            success: true, 
            comment: newComment 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
}


//admin comment
const createCommentAdmin = async(req, res) => {
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
            const {postId, comment} = req.body;
            const post = await PostModel.findById(postId);
            if(!post){
                return res.status(404).json({ 
                    error: 'Post not found' 
                });
            }

            const newComment = await CommentModel.create({
                admin: adminId,
                post: postId,
                userType: 'admin',
                comment
            });

            res.status(201).json({ 
                success: true, 
                comment: newComment 
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
}

const getCommentsByPost = async(req, res) => {
    try {
        const postId = req.params.postId;

        const comments = await CommentModel.find({ 
            post: postId 
        }).populate('user').populate('admin');

        //to get the replies
        for(const comment of comments){
            comment.replies = await ReplyModel.find({ 
                comment: comment._id 
            });
        }

        res.json({comments});
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
}


const getCommentDetailsByPost = async(req, res) => {
    try {
        const postId = req.params.postId;
        const commentId = req.params.commentId;

        const post = await PostModel.findById(postId);
        if(!post){
            return res.status(404).json({
                error: 'Post not found'
            });
        }

        const comment = await CommentModel.findById(commentId).populate('user').populate('admin');
        if(!comment){
            return res.status(404).json({ 
                error: 'Comment not found' 
            });
        }

        res.json({post, comment});
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
}



const deleteComment = async(req, res) => {
    try {
        if(!req.isAuthenticated()){
            return res.status(401).json({ 
                error: 'Unauthorized - User not authenticated' 
            });
        }

        const userId = req.user._id;
        const commentId = req.params.commentId;

        const comment = await CommentModel.findById(commentId);

        if(!comment){
            return res.status(404).json({ 
                error: 'Comment not found' 
            });
        }

        if(comment.user.toString() !== userId.toString()){
            return res.json({ 
                error: 'Only the owner can delete this comment.' 
            });
        }

        await ReplyModel.deleteMany({comment: commentId});
        await comment.deleteOne(); 

        return res.json({
            message: 'Comment deleted successfully!',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
};

const deleteCommentAdmin = async(req, res) => {
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

            const commentId = req.params.commentId;

            const comment = await CommentModel.findById(commentId);

            if(!comment){
                return res.status(404).json({ 
                    error: 'Comment not found' 
                });
            }
    
            await ReplyModel.deleteMany({comment: commentId});
            await comment.deleteOne(); 

            return res.json({
                message: 'Comment deleted successfully!',
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
    createComment,
    getCommentsByPost,
    getCommentDetailsByPost,
    createCommentAdmin,
    deleteComment,
    deleteCommentAdmin
}