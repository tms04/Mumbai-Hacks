import { Inventory } from "../models/inventory.model.js";
import { Basket } from "../models/basket.model.js";
import fs from 'fs';
import { parseCsv } from "../utils/parseCsv.utils.js";  // Import the CSV parser

export const getAllBaskets= async (req,res) =>{
    try {
        const baskets = await Basket.find().populate('saleId items saleDate');
        res.status(200).json({
        success:true,
        data:baskets
    })
    }
    catch (err) {
        console.error("Error: ", err.message); // Log the error message
        res.status(500).send("Error processing sales file: " + err.message);
    }
}

export const processSalesFile = async (req, res) => {
    try {
        const data = await parseCsv(req.file.path);  // Use the CSV parser
        console.log("Parsed Data: ", data); // Check the data being parsed

        const salesByBasket = {};
        for (const row of data) {
            const { SaleID, ItemID, QuantitySold, SaleDate } = row;

            if (!SaleID || !ItemID || !QuantitySold || !SaleDate) {
                console.error("Missing fields in row: ", row);
                throw new Error("Invalid data format");
            }

            // Group items by SaleID to form baskets
            if (!salesByBasket[SaleID]) {
                salesByBasket[SaleID] = {
                    saleId: SaleID,
                    items: [],
                    saleDate: new Date(SaleDate)
                };
            }
            salesByBasket[SaleID].items.push({ itemId: ItemID, quantity: QuantitySold });

            // Update inventory
            const inventoryItem = await Inventory.findOne({ itemId: ItemID });
            if (!inventoryItem) {
                console.error(`Inventory item with ID ${ItemID} not found`);
                throw new Error(`Item with ID ${ItemID} not found in inventory`);
            }

            inventoryItem.quantity -= QuantitySold;
            if (inventoryItem.quantity < 0) inventoryItem.quantity = 0; // Avoid negative inventory
            await inventoryItem.save();
        }

        // Save each basket to the database
        for (const saleId in salesByBasket) {
            const basket = new Basket(salesByBasket[saleId]);
            await basket.save();
        }

        fs.unlinkSync(req.file.path); // Delete file after processing
        res.send("Sales data processed and baskets created.");
    } catch (err) {
        console.error("Error: ", err.message); // Log the error message
        res.status(500).send("Error processing sales file: " + err.message);
    }
};
