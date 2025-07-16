const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: false },
    image: { type: String, required: false }, // Will store base64 string
    imageType: { type: String, required: false }, // Will store MIME type (image/jpeg, image/png, etc.)
    category: { type: String, required: false, default: 'Main Course' },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
