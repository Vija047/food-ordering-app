const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    cuisine: { type: String }, // Cuisine type
    ownerEmail: { type: String, required: true }, // Owner email for notifications
    ownerPhone: { type: String },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to owner user
    description: { type: String },
    menuItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }] // Reference to menu items
}, {
    timestamps: true // This will add createdAt and updatedAt fields
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
