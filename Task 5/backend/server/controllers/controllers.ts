

import db from "../config/db";
import { Request, Response } from "express";
import queries from "../query/schema";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import multer from "multer";
import path from "path";
import bcrypt from "bcrypt";
import { createTokens } from "../middleware/jwt";

interface User extends RowDataPacket {
  // id?: number;
  firstName: string;
  lastName: string;
  dob: string;
  address: string;
  mobile: string;
}
interface user extends RowDataPacket {
  id: number; // Make id non-optional to match createTokens
  username: string;
  password: string; // Include password as it's used in login
}

interface CountResult extends RowDataPacket {
  affectedRows: number;
}

interface UserRequest extends Request {
  body: {
    username: string;
    password: string;
    id: number;
  };
}

//get Users
export const getUser = async (req: Request, res: Response) => {
  const sql = queries.getUserQuery.getUser;
  try {
    const [result] = await db.query(sql);
    console.log("Fetched users:", result);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(424).json({ error: "Failed to fetch users" });
  }
};

//add User
export const addUser = async (req: Request, res: Response) => {
  const { firstName, lastName, dob, address, mobile } = req.body as User;
  const file = req.file as Express.Multer.File;
  const sql = queries.addUserQuery.addUser;
  const values = [firstName, lastName, dob, address, mobile, file.path];

  try {
    const result = await db.query(sql, values);
    res.status(200).json({ message: "User added successfully", file: file });
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(422).json({ error: "Failed to add user" });
  }
};

//update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, dob, address, mobile } = req.body as User;
    const checkUserSql = queries.getUserQuery.getUser;
    const updateUserSql = queries.updateUserQuery.updateUser;
    const file = req.file as Express.Multer.File | undefined;
    const values = file
      ? [firstName, lastName, dob, address, mobile, file.path, id]
      : [firstName, lastName, dob, address, mobile, id];

    const [userResult] = await db.query<User[]>(checkUserSql, [id]);

    if (userResult.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const [updateResult] = await db.query<ResultSetHeader>(
      updateUserSql,
      values
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ id, firstName, lastName, dob, address, mobile });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(424).json({ error: "Failed to update user" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const checkUserSql = queries.getUserQuery.getUser;
    const deleteUserSql = queries.deleteUserQuery.deleteUser;

    // Check if the user exists
    const [userResult] = await db.query<User[]>(checkUserSql, [id]);

    if (userResult.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete the user
    const [deleteResult] = await db.query<ResultSetHeader>(deleteUserSql, [id]);

    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).send("User deleted");
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(424).json({ error: "Failed to delete user" });
  }
};

//search, sort, pagination
export const pagination = async (req: Request, res: Response) => {
  try {
    const searchTerm = (req.query.term as string) || "";
    const sortBy = (req.query.sortBy as string) || "firstName";
    const order = req.query.order === "desc" ? "DESC" : "ASC";
    const page = parseInt(req.query.page as string) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage as string) || 10;
    const offset = (page - 1) * itemsPerPage;

    if (isNaN(page) || page < 1 || isNaN(itemsPerPage) || itemsPerPage < 1) {
      return res.status(400).json({ error: "Invalid pagination parameters" });
    }

    const validSortBy = ["firstName", "lastName", "dob", "address", "mobile"];
    if (!validSortBy.includes(sortBy) || !["ASC", "DESC"].includes(order)) {
      return res.status(400).json({ error: "Invalid sort parameters" });
    }

    const searchCondition = queries.paginationQuery.searchCondition(searchTerm);
    const searchParams = searchTerm ? new Array(5).fill(`%${searchTerm}%`) : [];
    const tableQuery = queries.paginationQuery.tableQuery(
      searchCondition,
      sortBy,
      order
    );
    const countSql = queries.paginationQuery.countQuery(searchCondition);

    const [results] = await db.query<User[]>(tableQuery, [
      ...searchParams,
      itemsPerPage,
      offset,
    ]);
    const [[{ total }]] = await db.query<CountResult[]>(countSql, searchParams);

    res.setHeader("X-Total-Count", total.toString());
    res.json(results);
  } catch (error) {
    console.error("Unexpected error", error);
    res.status(500).json({ error: "Unexpected error occurred" });
  }
};

//new user register
export const registerUser = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  const { username, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const connection = await db.getConnection();
    const insertUserSql = queries.registerUserQuery.registerUser;
    const insertUserValues = [username, hash];

    await connection.query(insertUserSql, insertUserValues);

    connection.release();

    res.json("User Registered");
  } catch (err) {
    console.error("Error registering user:", err);
    if (err === "ER_DUP_ENTRY") {
      res.status(409).json({ error: "Username already exists" });
    } else {
      res.status(500).json({ error: "Failed to register user" });
    }
  }
};

//user login
export const userLogin = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  const { username, password } = req.body;
  try {
    const connection = await db.getConnection();
    try {
      //query user by userName
      const [rows] = await connection.execute<RowDataPacket[]>(
        queries.userLoginQuery.userLogin,
        [username]
      );
      if (!rows || rows.length === 0) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      const user = rows[0] as user;

      const isPasswordValid = await bcrypt.compare(
        password,
        user.password as string
      );

      if (!isPasswordValid) {
        res.status(401).json({ error: "Invalid password" });
        return;
      } else {
        const accessToken = createTokens({
          id: user.id,
          username: user.username,
          isAdmin: user.isAdmin,
        });
        console.log('Generated Access Token:', accessToken);
        res.cookie("access-token", accessToken, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 30 * 1000,
        });
        res.json({ message: "Login successful" });
      }
    } finally {
      // Release the connection back to the pool
      connection.release();
    }
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: "Failed to log in" });
  }
};

export const logoutUser = (req: Request, res: Response): void => {
  try {
    // Clear the access-token cookie
    res.clearCookie("access-token");
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Error logging out:", err);
    res.status(500).json({ error: "Failed to log out" });
  }
};

export default {
  getUser,
  addUser,
  updateUser,
  deleteUser,
  pagination,
  registerUser,
  userLogin,
};