const AdminModel = require("../models/adminModel");
const CommentModel = require("../models/commentModel");
const NotificationModel = require("../models/notificationModel");
const PostModel = require("../models/postModel");
const UserModel = require("../models/userModel");
const verifyToken = require("../utils/verifyToken");

const createNotification = async(req, res) => {
    try {
        if(!req.isAuthenticated()){
            return res.status(401).json({
                error: 'Unauthorized - User not authenticated'
            });
        }

        const {notificationType, content, postId, commentId} = req.body;

        //check if either postId or commentId is provided
        if(!postId && !commentId){
            return res.status(400).json({
                error: "At least postId or commentId is required"
            });
        }

        const post = postId ? await PostModel.findById(postId) : null;
        const comment = commentId ? await CommentModel.findById(commentId) : null;

        if(!post && !comment){
            return res.status(404).json({
                error: 'Post or Comment not found'
            });
        }

        const senderId = req.user._id;
        const isCommentingOnOwnPost = post && post.user && post.user.toString() === senderId.toString();
        const isCommentingOnOwnComment = comment && comment.user && comment.user.toString() === senderId.toString();

        if(isCommentingOnOwnPost || isCommentingOnOwnComment){
            //allow creating notification when replying to own post/comment
            //but block creating notification on own post/comment when directly commenting
            if(notificationType === 'reply' && comment && comment.user.toString() !== senderId.toString()){
                
                let recipientId;
                let recipientType;

                if(comment){
                    recipientId = comment.userType === 'user' ? comment.user : comment.admin;
                    recipientType = comment.userType === 'user' ? 'User' : 'Admin';
                } else if(post){
                    recipientId = post.userType === 'user' ? post.user : post.admin;
                    recipientType = post.userType === 'user' ? 'User' : 'Admin';
                }

                //create notification
                const notification = new NotificationModel({
                    recipient: recipientId,
                    sender: senderId,
                    recipientType,
                    senderType: 'User',
                    notificationType,
                    content,
                    postId,
                    commentId
                });

                await notification.save();

                return res.status(200).json({
                    message: 'Notification created successfully'
                });
            } else {
                return res.status(200).json({
                    message: "Unauthorized - Cannot create notification on your own post/comment"
                });
            }
        }

        //handle notification creation for other cases (e.g., commenting on other's post/comment)
        
        let recipientId;
        let recipientType;

        if(comment){
            recipientId = comment.userType === 'user' ? comment.user : comment.admin;
            recipientType = comment.userType === 'user' ? 'User' : 'Admin';
        } else if(post){
            recipientId = post.userType === 'user' ? post.user : post.admin;
            recipientType = post.userType === 'user' ? 'User' : 'Admin';
        }

        //create notification
        const notification = new NotificationModel({
            recipient: recipientId,
            sender: senderId,
            recipientType,
            senderType: 'User',
            notificationType,
            content,
            postId,
            commentId
        });

        await notification.save();

        return res.status(200).json({
            message: 'Notification created successfully'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};




//admin notification
const createNotificationAdmin = async(req, res) => {
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

            const {notificationType, content, postId, commentId} = req.body;

            //check if either postId or commentId is provided
            if(!postId && !commentId){
                return res.status(400).json({
                    error: "At least postId or commentId is required"
                });
            }
    
            const post = postId ? await PostModel.findById(postId) : null;
            const comment = commentId ? await CommentModel.findById(commentId) : null;
    
            if(!post && !comment){
                return res.status(404).json({
                    error: 'Post or Comment not found'
                });
            }
    
            const senderId = decodedToken.id;
            const isCommentingOnOwnPost = post && post.admin && post.admin.toString() === senderId.toString();
            const isCommentingOnOwnComment = comment && comment.admin && comment.admin.toString() === senderId.toString();
    
            if(isCommentingOnOwnPost || isCommentingOnOwnComment){
                //allow creating notification when replying to own post/comment
                //but block creating notification on own post/comment when directly commenting
                if(notificationType === 'reply' && comment && comment.user.toString() !== senderId.toString()){
                    
                    let recipientId;
                    let recipientType;
    
                    if(comment){
                        recipientId = comment.userType === 'admin' ? comment.admin : comment.user;
                        recipientType = comment.userType === 'admin' ? 'Admin' : 'Admin';
                    } else if(post){
                        recipientId = post.userType === 'admin' ? post.user : post.user;
                        recipientType = post.userType === 'admin' ? 'Admin' : 'Admin';
                    }
    
                    //create notification
                    const notification = new NotificationModel({
                        recipient: recipientId,
                        sender: senderId,
                        recipientType,
                        senderType: 'Admin',
                        notificationType,
                        content,
                        postId,
                        commentId
                    });
    
                    await notification.save();
    
                    return res.status(200).json({
                        message: 'Notification created successfully'
                    });
                } else{
                    return res.status(200).json({
                        message: "Unauthorized - Cannot create notification on your own post/comment"
                    });
                }
            }
    
            // Handle notification creation for other cases (e.g., commenting on other's post/comment)
            
            let recipientId;
            let recipientType;
    
            if(comment){
                recipientId = comment.userType === 'admin' ? comment.admin : comment.user;
                recipientType = comment.userType === 'admin' ? 'User' : 'Admin';
            } else if(post){
                recipientId = post.userType === 'admin' ? post.admin : post.user;
                recipientType = post.userType === 'admin' ? 'User' : 'Admin';
            }
    
            //create notification
            const notification = new NotificationModel({
                recipient: recipientId,
                sender: senderId,
                recipientType,
                senderType: 'Admin',
                notificationType,
                content,
                postId,
                commentId
            });
    
            await notification.save();
    
            return res.status(200).json({
                message: 'Notification created successfully'
            });    

        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};




const getNotifications = async(req, res) => {
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

        const notifications = await NotificationModel.find({recipient: userId})
            .populate('sender')
            .sort({createdAt: -1});

        res.status(200).json({notifications});
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
};



const getNotificationsAdmin = async(req, res) => {
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

            const notifications = await NotificationModel.find({recipient: adminId})
            .populate('sender')
                .sort({createdAt: -1});

            res.status(200).json({notifications});
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
};


const markNotificationAsRead = async(req, res) => {
    try {
      const {notificationId} = req.params;
  
      const notification = await NotificationModel.findById(notificationId);
      if(!notification){
        return res.status(404).json({ 
            error: 'Notification not found' 
        });
      }
  
      //update the notification as read
      notification.read = true;
      await notification.save();
  
      res.status(200).json({ 
        success: true, 
        message: 'Notification marked as read' 
    });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        error: 'Internal Server Error' 
    });
    }
};


module.exports = {
    createNotification,
    getNotifications,
    markNotificationAsRead,
    createNotificationAdmin,
    getNotificationsAdmin
};
