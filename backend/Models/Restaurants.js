const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    menuItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }] // Reference to menu items
}, {
    timestamps: true // This will add createdAt and updatedAt fields
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
