const passport = require('passport');
const jwt = require('jsonwebtoken');


// const getProfile = (req, res) => {
//     const token = req.cookies.token;

//     if(req.isAuthenticated()){
//         const { id, name, email, image } = req.user;
//         const tokenPayload = { id, name, email, image };
//         const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);
//         return res.json({ token, ...tokenPayload });
//     } else if(token){
//         jwt.verify(token, process.env.JWT_SECRET, {}, (err, decodedToken) => {
//             if(err){
//                 console.error(err);
//                 return res.status(401).json({ 
//                     error: 'Unauthorized - Invalid token' 
//                 });
//             }
//             return res.json(decodedToken);
//         });
//     } else{
//         return res.status(401).json({ 
//             error: 'Unauthorized - Missing token' 
//         });
//     }
// };


const getProfile = (req, res) => {
    if(req.isAuthenticated()){
        const {id, name, email, image} = req.user;
        return res.json({ id, name, email, image });
    } else {
        res.json(null);
    }
};


const logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if(err){
          console.error(err);
          res.status(500).json({ 
            message: 'Internal Server Error' 
        });
        } else{
          res.clearCookie('token').json({ 
            message: 'Logout successfully!' 
        });
        }
    });
}



module.exports = {
    getProfile,
    logoutUser
}