import express from 'express';
import { processSalesFile } from '../controllers/basket.controller.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload/sales', upload.single('file'), processSalesFile);

export default router;
