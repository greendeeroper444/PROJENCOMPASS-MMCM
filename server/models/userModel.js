const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


const UserSchema = new mongoose.Schema({
    googleId: {
        type: String
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    image: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
})

// jwt token
UserSchema.methods.getJwtToken = function (){
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });
};

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;