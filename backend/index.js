import express from 'express';
import multer from 'multer';
import XLSX from 'xlsx';
import mongoose from 'mongoose';
import fs from 'fs';

const app = express();
const upload = multer({ dest: 'uploads/' });

// MongoDB Schemas
const inventorySchema = new mongoose.Schema({
    itemId: String,
    itemName: String,
    quantity: Number
});

const basketSchema = new mongoose.Schema({
    saleId: String,
    items: [{ itemId: String, quantity: Number }],
    saleDate: Date
});

const Inventory = mongoose.model('Inventory', inventorySchema);
const Basket = mongoose.model('Basket', basketSchema);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/yourdbname', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"));

// Helper function to parse Excel files and convert to JSON
function parseExcel(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    return data;
}

// Route to upload and process purchase file
app.post('/upload/purchase', upload.single('file'), async (req, res) => {
    try {
        const data = parseExcel(req.file.path);
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
});

// Route to upload and process sales file
app.post('/upload/sales', upload.single('file'), async (req, res) => {
    try {
        const data = parseExcel(req.file.path);

        const salesByBasket = {};
        for (const row of data) {
            const { SaleID, ItemID, QuantitySold, SaleDate } = row;

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
            if (inventoryItem) {
                inventoryItem.quantity -= QuantitySold;
                if (inventoryItem.quantity < 0) inventoryItem.quantity = 0; // Avoid negative inventory
                await inventoryItem.save();
            }
        }

        // Save each basket to the database
        for (const saleId in salesByBasket) {
            const basket = new Basket(salesByBasket[saleId]);
            await basket.save();
        }

        fs.unlinkSync(req.file.path); // Delete file after processing
        res.send("Sales data processed and baskets created.");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error processing sales file.");
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
