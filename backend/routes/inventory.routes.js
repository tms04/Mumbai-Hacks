import express from 'express';
import multer from 'multer';
import { processPurchaseFile,getMyInventory } from '../controllers/inventory.controllers.js';
// backend/routes/inventory.routes.js
import { getPrediction } from '../controllers/inventory.controllers.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload/purchase', upload.single('file'), processPurchaseFile);
router.get('/get/allItems',getMyInventory);
router.get('/predict', getPrediction);

export default router;
