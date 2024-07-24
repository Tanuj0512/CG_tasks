import express from "express";

import { getLocation } from "../Controllers/controller";

const router = express.Router();

router.get("/getLocation", getLocation);

export default router;
