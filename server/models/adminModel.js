const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: String,
    date: {
        type: Date,
        default: Date.now
    },
})


// jwt token
AdminSchema.methods.getJwtToken = function (){
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });
};

const AdminModel = mongoose.model('Admin', AdminSchema);
module.exports = AdminModel;