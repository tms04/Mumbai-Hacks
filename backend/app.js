import express from "express";
import { config } from "dotenv";

// Initializing  express app
export const app = express();

config({
    path: "./data/config.env",
  });

//Using Middlewares
app.use(express.json());

//Routes

// Sample route
app.get('/', (req, res) => {
    res.send('Working');
  });