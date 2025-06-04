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
        enum: ['customer', 'admin'],
        default: 'customer', // Fixed: Changed 'user' to 'customer' to match enum
    }
}, { timestamps: true }); // ✅ Fixed: timestamps should be outside the field definitions

module.exports = mongoose.model('User', userSchema);
