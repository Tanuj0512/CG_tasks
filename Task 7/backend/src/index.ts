import express from  "express";
import path from 'path';
import fs from 'fs';
import userRoutes from "./Routes/routes"


const app = express();
const PORT = 3001;

app.use(express.json());
app.use("/api", userRoutes);

app.listen(PORT, ()  => {
  console.log(`Server running on  ${PORT}`)
})