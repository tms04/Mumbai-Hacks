import { Inventory } from "../models/inventory.model.js";
import fs from 'fs';
import { parseCsv } from "../utils/parseCsv.utils.js";

export const processPurchaseFile = async (req, res) => {
    try {
        const data = parseCsv(req.file.path);
        for (const row of data) {
            const { ItemID, ItemName, QuantityPurchased } = row;

            let inventoryItem = await Inventory.findOne({ itemId: ItemID });
            if (inventoryItem) {
                inventoryItem.quantity += QuantityPurchased;
            } else {
                inventoryItem = new Inventory({
                    itemId: ItemID,
                    itemName: ItemName,
                    quantity: QuantityPurchased
                });
            }
            await inventoryItem.save();
        }

        fs.unlinkSync(req.file.path); // Delete file after processing
        res.send("Purchase data processed and inventory updated.");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error processing purchase file.");
    }
};
