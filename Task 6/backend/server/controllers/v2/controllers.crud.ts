import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import path from "path";

const prisma = new PrismaClient();

// Get all users
export const getUser = async (req: Request, res: Response) => {
  try {
    const users = await prisma.users.findMany();
    res.status(200).json(users);
  } catch (err) {
    console.log("Error fetching users: ", err);
    res.status(424).json({ error: "Failed to fetch users" });
  }
};

// Add Users
export const addUser = async (req: Request, res: Response) => {
  const { firstName, lastName, dob, address, mobile } = req.body;

  try {
    const newUser = await prisma.users.create({
      data: {
        firstName,
        lastName,
        dob: new Date(dob),
        address,
        mobile,
      },
    });
    res.status(200).json({ message: "User added successfully", user: newUser });
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(422).json({ error: "Failed to add user" });
  }
};

// Update Users
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, dob, address, mobile } = req.body;

    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { id: Number(id) },
    });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user
    const updatedUser = await prisma.users.update({
      where: { id: Number(id) },
      data: {
        firstName,
        lastName,
        dob: new Date(dob), // Ensure dob is correctly formatted as Date
        address,
        mobile,
      },
    });

    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(424).json({ error: "Failed to update user" });
  }
};

// Delete User
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userExist = await prisma.users.findUnique({
      where: { id: Number(id) },
    });

    if (!userExist) {
      return res.status(404).json({ error: "User not found" });
    }

    const deletedUser = await prisma.users.delete({
      where: { id: Number(id) },
    });
    res.json({ deletedUser });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(424).json({ error: "Failed to delete user" });
  }
};

export const pagination = async (req: Request, res: Response) => {
  try {
    const searchTerm = (req.query.term as string) || "";
    const sortBy = (req.query.sortBy as string) || "firstName";
    const order = req.query.order === "desc" ? "desc" : "asc";
    const page = parseInt(req.query.page as string) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage as string) || 10;
    const offset = (page - 1) * itemsPerPage;

    if (isNaN(page) || page < 1 || isNaN(itemsPerPage) || itemsPerPage < 1) {
      return res.status(400).json({ error: "Invalid pagination parameters" });
    }

    const validSortBy = ["firstName", "lastName", "dob", "address", "mobile"];
    if (!validSortBy.includes(sortBy) || !["asc", "desc"].includes(order)) {
      return res.status(400).json({ error: "Invalid sort parameters" });
    }

    const searchCondition = searchTerm ? {
      OR: [
        { firstName: { contains: searchTerm, mode: 'insensitive' } },
        { lastName: { contains: searchTerm, mode: 'insensitive' } },
        { address: { contains: searchTerm, mode: 'insensitive' } }
      ]
    } : {};

    const [results, count] = await Promise.all([
      prisma.users.findMany({
        where: searchCondition,
        orderBy: { [sortBy]: order },
        skip: offset,
        take: itemsPerPage,
      }),
      prisma.users.count({
        where: searchCondition,
      }),
    ]);

    res.setHeader("X-Total-Count", count.toString());
    res.json(results);
  } catch (error) {
    console.error("Unexpected error", error);
    res.status(500).json({ error: "Unexpected error occurred" });
  }
};

// Upload multiple images
export const uploadFiles = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }
  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const uploadFiles = files.map(async (file) => {
      await prisma.images.create({
        data: {
          image_path: file.path,
          users: { connect: { id: userId } }, // Connect the image to the user
        },
      });
    });

    await Promise.all(uploadFiles);

    res.status(200).json({ message: "Files uploaded successfully" });
  } catch (err) {
    console.error("Error uploading files:", err);
    res.status(500).json({ error: "Failed to upload files" });
  }
};


// Show images path
export const showImages = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const userName = req.user?.username;

  try {
    const images = await prisma.images.findMany({
      where: { user_id : userId},
      select: { id: true, image_path: true },
    });

    // Check if images exist for the authenticated user
    if (!images || images.length === 0) {
      return res.status(404).json({ error: "No images found for the user" });
    }

    const apiRoute = "http://localhost:3010/uploads/";

    // Return images associated with the logged-in user
    const imagePaths = images.map((image) => ({
      fileId: image.id,
      filePath:  image.image_path ? apiRoute + path.basename(image.image_path) : null,
    }));

    // Return the user_id with the associated image paths
    res.json({
      user_id: userId,
      userName: userName,
      files: { imagePaths },
    });
  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
};