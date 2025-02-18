import { Inventory } from "../models/inventory.model.js";
import fs from 'fs';
import { parseCsv } from "../utils/parseCsv.utils.js";
// backend/controllers/inventory.controller.js
import { generatePrediction } from '../utils/predictor.js';

export const getPrediction = async (req, res) => {
  try {
    const prediction = await generatePrediction();
    res.status(200).json({ prediction });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate prediction" });
  }
};


export const getMyInventory=async(req,res)=>{
    try{
        const inventory=await Inventory.find({}).select('itemId name quantity');
        res.status(200).json({
        success:true,
        data:inventory
    })
    }
    catch(err){
        console.error("Detailed error:", err);
        res.status(500).send(`Error processing purchase file: ${err.message}`);
    }
};

export const processPurchaseFile = async (req, res) => {
    try {
        const data = await parseCsv(req.file.path);  // Make sure to await if parseCsv is async
        console.log("Parsed Data:", data); // Log the parsed data to see its structure

        for (const row of data) {
            // Log each row to see what we're processing
            console.log("Processing row:", row);

            // Parse the quantity as an integer
            const quantityPurchased = parseInt(row.QuantityPurchased);

            // Validate the data
            if (!row.ItemID || !row.ItemName || isNaN(quantityPurchased)) {
                throw new Error(`Invalid data in row: ${JSON.stringify(row)}`);
            }

            let inventoryItem = await Inventory.findOne({ itemId: row.ItemID });
            if (inventoryItem) {
                console.log(`Updating existing item ${row.ItemID}`);
                inventoryItem.quantity += quantityPurchased;
            } else {
                console.log(`Creating new item ${row.ItemID}`);
                inventoryItem = new Inventory({
                    itemId: row.ItemID,
                    name: row.ItemName,  // Make sure this matches your schema
                    quantity: quantityPurchased
                });
            }
            await inventoryItem.save();
            console.log(`Saved item ${row.ItemID} successfully`);
        }

        fs.unlinkSync(req.file.path);
        res.send({
            message: "Purchase data processed and inventory updated successfully",
            processedItems: data.length
        });
    } catch (err) {
        console.error("Detailed error:", err);
        res.status(500).send(`Error processing purchase file: ${err.message}`);
    }
};