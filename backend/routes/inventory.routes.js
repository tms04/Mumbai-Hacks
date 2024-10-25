import express from 'express';
import multer from 'multer';
import { processPurchaseFile } from '../controllers/inventory.controllers.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload/purchase', upload.single('file'), processPurchaseFile);

export default router;
