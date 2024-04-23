const jwt = require('jsonwebtoken');

const verifyToken = (token, callback) => {
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, decoded) => {
        if(err){
            callback(err, null);
        } else{
            callback(null, decoded);
        }
    });
};

module.exports = verifyToken;
