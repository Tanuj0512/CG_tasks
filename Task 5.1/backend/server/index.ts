import express from "express";
import bodyParser from "body-parser";
import db from "./config/db";
// import cors from 'cors';
import userRoutes from './routes/routes';
import cookieParser from 'cookie-parser';
import path from 'path';
const app = express();
const port = 3010;

// app.use(cors())  
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
//use routes
app.use("/api", userRoutes);

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

//database connection
async function startServer() {
  try {
    await db.getConnection;
    console.log('Connected to the database');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start the server:', err);
  }
}

startServer();

//http://localhost:3010/api/users/pagination?term =jo&sortBy=firstName&order=asc&page=1&itemsPerPage=2