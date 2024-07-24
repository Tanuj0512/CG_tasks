import { Request, Response } from "express";
import path from "path";
import fs from 'fs/promises';


export const getLocation = async (req: Request, res: Response) => {
  try {
    // Correctly use fs/promises to read the file as a string
    const data: string = await fs.readFile(
        path.join(__dirname, '../data/locations.json'),
        'utf-8'
      );
    const locations = JSON.parse(data);
    res.json(locations);
  } catch (error) {
    console.error("Error reading locations data:", error);
    res.status(500).send("Error reading locations data");
  }
};
