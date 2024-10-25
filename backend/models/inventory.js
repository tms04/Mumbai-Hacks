import mongoose from "mongoose";
const inventorySchema = new mongoose.Schema({
    itemId: String,
    itemName: String,
    quantity: Number
});

export const Inventory = mongoose.model('Inventory', inventorySchema);