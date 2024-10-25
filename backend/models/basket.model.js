import mongoose from "mongoose";

const basketSchema = new mongoose.Schema({
    saleId: String,
    items: [{ itemId: String, quantity: Number }],
    saleDate: Date
});

export const Basket = mongoose.model('Basket', basketSchema);