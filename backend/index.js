import express from 'express';
import multer from 'multer';
import { connectDb } from "./data/database.js";
import { config } from "dotenv";
import cors from "cors";
import basketRoutes from "./routes/basket.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import morgan from 'morgan';

config({
    path: "./data/config.env"
});

connectDb();

const app = express();
app.use(express.json());
app.use(cors({
    origin: {'http://localhost:5173/':'http://localhost:5173'},
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use(morgan('dev'));
const upload = multer({ dest: 'uploads/' });

//Routes
app.use('/basket', basketRoutes);
app.use('/inventory', inventoryRoutes);

//Testing the route
app.listen(process.env.PORT, () => console.log(`Server running on http://localhost:${process.env.PORT}`));


