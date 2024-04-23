const jwt = require('jsonwebtoken');
const multer = require('multer');
const UserModel = require('../models/userModel');
const PostModel = require('../models/postModel');
const sendTokenUser = require('../utils/jwtTokenUser');
const CommentModel = require('../models/commentModel');
const ReplyModel = require('../models/replyModel');
const AdminModel = require('../models/adminModel');
const verifyToken = require('../utils/verifyToken');
const sendTokenAdmin = require('../utils/jwtTokenAdmin');
const NotificationModel = require('../models/notificationModel');

//set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'files/');
    },
    filename: function (req, file, cb){
        cb(null, file.originalname);
    },
});
  
//init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
}).single('pdf');


//user post
const createPost = async(req, res) => {
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

        upload(req, res, async(err) => {
            if(err){
                console.error(err);
            } else{
                let pdfFileName = null;
                if(req.file){
                    pdfFileName = req.file.filename;
                }

                const {question, title, description, author} = req.body;

                let pdfPath = null;
                if(pdfFileName){
                    pdfPath = `${req.protocol}://${req.get('host')}/files/${pdfFileName}`;
                }
                const newPost = await PostModel.create({
                    question,
                    title,
                    description,
                    author,
                    pdf: pdfPath,
                    user: userId,
                    userType: 'user'
                });

                
                return res.json({
                    message: 'Post uploaded successfully!',
                    post: newPost,
                    pdfPath: pdfPath,
                    
                });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
}

const getOwnPost = async(req, res) => {
    try {
        if(!req.isAuthenticated()) {
            return res.status(401).json({
                error: 'Unauthorized - User not authenticated'
            });
        }

        const userId = req.user._id;

        const userPosts = await PostModel.find({user: userId}).populate('user').populate('admin');
        
        res.json({posts: userPosts});
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
}

const deletePost = async(req, res) => {
    try {
        if(!req.isAuthenticated()){
            return res.status(401).json({ 
                error: 'Unauthorized - User not authenticated' 
            });
        }

        const userId = req.user._id;
        const postId = req.params.postId;

        const post = await PostModel.findById(postId);

        if(!post){
            return res.status(404).json({ 
                error: 'Post not found' 
            });
        }

        //check if the authenticated user is the owner of the post
        if(post.user.toString() !== userId.toString()){
            return res.json({ 
                error: 'Only the owner can delete this post.' 
            });
        }

        await NotificationModel.deleteMany({ $or: [{ content: { $regex: postId } }, { 'content.postId': postId }] });
   
        await post.deleteOne(); 

        await CommentModel.deleteMany({post: postId});

        await ReplyModel.deleteMany({post: postId});


        return res.json({
            message: 'Post deleted successfully!',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
};


const updatePost = async(req, res) => {
    try {
        if(!req.isAuthenticated()){
            return res.status(401).json({ 
                error: 'Unauthorized - User not authenticated' 
            });
        }

        const userId = req.user._id;
        const postId = req.params.postId;
        const post = await PostModel.findById(postId);

        if(!post){
            return res.json({ 
                error: 'Post not found' 
            });
        }

        if(post.user.toString() !== userId.toString()){
            return res.json({ 
                error: 'Only the owner can update this post.' 
            });
        }

        upload(req, res, async(err) => {
            if(err){
                console.error(err);
                return res.status(500).json({ 
                    error: 'Error uploading file' 
                });
            } else {
                const {question, title, description, author} = req.body;

                post.question = question;
                post.title = title;
                post.description = description;
                post.author = author;

              
                if(req.file){
                    const pdfFileName = req.file.filename;
                    const pdfPath = `${req.protocol}://${req.get('host')}/files/${pdfFileName}`;
                    post.pdf = pdfPath;
                }

                await post.save();

                return res.json({
                    message: 'Post updated successfully!',
                    post,
                });
            }
        });
    } catch (error) {
        console.error(error);
        return res.json({ 
            error: 'Internal Server Error' 
        });
    }
};


const savePost = async(req, res) => {
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
        const postId = req.body.postId;
        
        
        const post = await PostModel.findById(postId);

        if(!post){
            return res.status(404).json({ 
                error: 'Post not found' 
            });
        }

        post.isSaved = !post.isSaved;

        await post.save();

        return res.json({ 
            message: 'Post saved successfully', post 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
};



//admin post
const createPostAdmin = async(req, res) =>{
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

            upload(req, res, async(err) => {
                if(err){
                    console.error(err);
                } else{
                    let pdfFileName = null;
                    if(req.file){
                        pdfFileName = req.file.filename;
                    }
    
                    const {question, title, description, author} = req.body;
    
                    let pdfPath = null;
                    if(pdfFileName){
                        pdfPath = `${req.protocol}://${req.get('host')}/files/${pdfFileName}`;
                    }
                    const newPost = await PostModel.create({
                        question,
                        title,
                        description,
                        author,
                        pdf: pdfPath,
                        admin: adminId,
                        userType: 'admin',
                    });
    
                    
                    sendTokenAdmin(adminExists, 200, res, {
                        message: 'Post uploaded successfully!',
                        post: newPost,
                        pdfPath: pdfPath,
                    });
                }
            });
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
}

const getOwnPostAdmin = async(req, res) => {
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

            const adminId = decodedToken.id;
            const adminPosts = await PostModel.find({admin: adminId}).populate('admin');
            
            res.json({posts: adminPosts});
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
}

const deletePostAdmin = async(req, res) => {
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

            const postId = req.params.postId;

            const post = await PostModel.findById(postId);

            if(!post){
                return res.status(404).json({ 
                    error: 'Post not found' 
                });
            }
    
            await NotificationModel.deleteMany({ $or: [{ content: { $regex: postId } }, { 'content.postId': postId }] });
            await post.deleteOne(); 
            await CommentModel.deleteMany({post: postId});
            await ReplyModel.deleteMany({post: postId});

            return res.json({
                message: 'Post deleted successfully!',
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
};


const updatePostAdmin = async(req, res) => {
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

            const postId = req.params.postId;
            const post = await PostModel.findById(postId);

            if(!post){
                return res.json({ 
                    error: 'Post not found' 
                });
            }

            if(post.admin.toString() !== adminId.toString()){
                return res.json({ 
                    error: 'Only the owner can delete this post.' 
                });
            }

            upload(req, res, async(err) => {
                if(err){
                    console.error(err);
                    return res.status(500).json({ 
                        error: 'Error uploading file' 
                    });
                } else {
                    const {question, title, description, author} = req.body;

                    post.question = question;
                    post.title = title;
                    post.description = description;
                    post.author = author;

                
                    if(req.file){
                        const pdfFileName = req.file.filename;
                        const pdfPath = `${req.protocol}://${req.get('host')}/files/${pdfFileName}`;
                        post.pdf = pdfPath;
                    }

                    await post.save();

                    return res.json({
                        message: 'Post updated successfully!',
                        post,
                    });
                }
            });
        })
        
    } catch (error) {
        console.error(error);
        return res.json({ 
            error: 'Internal Server Error' 
        });
    }
};


const savePostAdmin = async(req, res) => {
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

            const postId = req.body.postId;
            const post = await PostModel.findById(postId);

            if(!post){
                return res.status(404).json({ 
                    error: 'Post not found' 
                });
            }

            post.isSaved = !post.isSaved;

            await post.save();

            return res.json({ 
                message: 'Post saved successfully', post 
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
};




const getPost = async(req, res) => {
    try {
        const posts = await PostModel.find().populate('user').populate('admin');

        for(const post of posts){
            post.comments = await CommentModel.find({ 
                post: post._id 
            });
        }

        res.json({posts});
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
}

const getPostDetails = async(req, res) => {
    try {
        const postId = req.params.postId;
        const post = await PostModel.findById(postId).populate('user').populate('admin');

        if(!post){
            return res.status(404).json({ 
                error: 'Post not found' 
            });
        }

        res.json({post});
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
}

const searchPosts= async(req, res) => {
    try {
        const searchQuery = req.query.q;

        const publicPosts = await PostModel.find({
            $or: [
                {question: { $regex: new RegExp(searchQuery, 'i') }},
                {title: { $regex: new RegExp(searchQuery, 'i') }},
                {description: { $regex: new RegExp(searchQuery, 'i') }},
                {author: { $regex: new RegExp(searchQuery, 'i') }},
                {user: { $in: await UserModel.find({ name: { $regex: new RegExp(searchQuery, 'i') } }).distinct('_id') }},
                {admin: { $in: await AdminModel.find({ username: { $regex: new RegExp(searchQuery, 'i') } }).distinct('_id') }},
            ],
        }).populate('user', 'name image').populate('admin', 'username image');

        return res.json(publicPosts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            error: 'Internal server error'
         });
    }
}

const searchPostSuggests = async(req, res) => {
    try {
        const searchQuery = req.query.q;
        
        const regexPattern = new RegExp(searchQuery, 'i');

        const postResults = await PostModel.find({
            $or: [
                {question: { $regex: regexPattern }},
                {title: { $regex: regexPattern }},
                {author: { $regex: regexPattern }},
                
            ]
        }).select('question title author user');

        // const suggestions = results.map(post => `${post.title} by ${post.author}`);

        const userResults = await UserModel.find({ name: { $regex: regexPattern } }).select('name');
        const adminResults = await AdminModel.find({ username: { $regex: regexPattern } }).select('username');

        const postSuggestions = postResults.map(post => {
            let suggestion = '';
            if(post.question){
                suggestion += `${post.question}`;
            }
            if(post.title){
                suggestion += `${post.title}`;
            }
            if(post.author){
                suggestion += `${post.author}`;
            }
            if(post.user && post.user.name){
                suggestion += `${post.user.name} `;
            }
            if(post.admin && post.admin.username){
                suggestion += `${post.admin.username} `;
            }
            return suggestion.trim(); //trim to remove leading/trailing spaces
        });

        const userSuggestions = userResults.map(user => user.name);
        const adminSuggestions = adminResults.map(admin => admin.username);

        const suggestions = [...postSuggestions, ...userSuggestions, ...adminSuggestions];
        
        res.json(suggestions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Internal Server Error' 
        });
    }
}

const getSavedPosts = async(req, res) => {
    try {
        const savedPosts = await PostModel.find({ 
            isSaved: true, 
        }).sort({ date: -1 });

        return res.json({ 
            message: 'Saved posts retrieved successfully', 
            posts: savedPosts 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal Server Error' 
        });
    }
};

const getProfilePosts = async(req, res) => {
    const authId = req.params.authId;

    try {
        const posts = await PostModel.find({
            $or: [
                {user: authId},
                {admin: authId}
            ]
        }).populate('user').populate('admin').populate('comments');

        res.json({posts});
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};


module.exports = {
    createPost,
    getPost,
    getPostDetails,
    searchPosts,
    deletePost,
    updatePost,
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
}