import express from "express";
import bodyParser from "body-parser";
import db from "./config/db";
// import cors from 'cors'
import userRoutes from './routes/routes';

const app = express();
const port = 3010;

// app.use(cors())
app.use(bodyParser.json());
app.use(express.json());
//use routes
app.use("/api", userRoutes);

//database connection
async function startServer() {
  try {
    await db;
    console.log('Connected to the database');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start the server:', err);
  }
}

startServer();