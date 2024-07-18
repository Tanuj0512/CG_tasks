import { Request, Response } from "express";
import path from "path";
import bcrypt from "bcrypt";
import { createTokens } from "../../middleware/jwt";
import { PrismaClient } from "@prisma/client";




const prisma = new PrismaClient();

//new user register
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, password } = req.body;

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const registerUser = await prisma.auth_users.create({
      data: {   
        username,
        password: hashPassword,
      },
    });

    res.json({ message: "User Registered", user: registerUser });
  } catch (err) {
    console.error("Error registering user:", err);
    if (err === "ER_DUP_ENTRY") {
      res.status(409).json({ error: "Username already exists" });
    } else {
      res.status(500).json({ error: "Failed to register user" });
    }
  }
};

// User login using Prisma
export const userLogin = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const user = await prisma.auth_users.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password as string
    );

    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }

    // Create JWT token
    const accessToken = createTokens({
      id: user.id,
      username: user.username as string,
    });

    console.log("Generated Access Token:", accessToken);

    // Set cookie with JWT token
    res.cookie("access-token", accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30 * 1000, // 30 days
    });

    res.json({ message: "Login successful" });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: "Failed to log in" });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  // Clear the access token cookie
  res.clearCookie("access-token");
  res.json({ message: "Logout successful" });
};
