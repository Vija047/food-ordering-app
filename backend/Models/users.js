const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['customer', 'admin', 'restaurant_owner'], 
        default: 'customer', 
    },
    profile: {
        type: Object, 
        default: {},
    }
}, { timestamps: true }); 

module.exports = mongoose.model('User', userSchema);
