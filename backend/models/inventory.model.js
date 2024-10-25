// inventory.model.js
import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
    itemId: {
        type: String,
        required: true,
        unique: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 100
    },
    name: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export const Inventory = mongoose.model('Inventory', inventorySchema);