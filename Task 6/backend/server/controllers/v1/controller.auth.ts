// import db from "../config/db";
// import { Request, Response } from "express";
// import queries from "../query/query.crud";
// import authQueries from "../query/query.auth";
// import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
// import path from "path";
// import bcrypt from "bcrypt";
// import { createTokens } from "../middleware/jwt";

// interface user extends RowDataPacket {
//   id: number; // Make id non-optional to match createTokens
//   username: string;
//   password: string; // Include password as it's used in login
// }

// interface UserRequest extends Request {
//   body: {
//     username: string;
//     password: string;
//     id: number;
//   };
// }

// interface Image extends RowDataPacket {
//   id: number;
//   images: string;
// }



// //new user register
// export const registerUser = async (
//   req: UserRequest,
//   res: Response
// ): Promise<void> => {
//   const { username, password } = req.body;

//   try {
//     const hash = await bcrypt.hash(password, 10);
//     const connection = await db.getConnection();
//     const insertUserSql = authQueries.registerUserQuery.registerUser;
//     const insertUserValues = [username, hash];

//     await connection.query(insertUserSql, insertUserValues);

//     connection.release();

//     res.json("User Registered");
//   } catch (err) {
//     console.error("Error registering user:", err);
//     if (err === "ER_DUP_ENTRY") {
//       res.status(409).json({ error: "Username already exists" });
//     } else {
//       res.status(500).json({ error: "Failed to register user" });
//     }
//   }
// };

// //user login
// export const userLogin = async (
//   req: UserRequest,
//   res: Response
// ): Promise<void> => {
//   const { username, password } = req.body;
//   try {
//     const connection = await db.getConnection();
//     try {
//       //query user by userName
//       const [rows] = await connection.execute<RowDataPacket[]>(
//         authQueries.userLoginQuery.userLogin,
//         [username]
//       );
//       if (!rows || rows.length === 0) {
//         res.status(404).json({ error: "User not found" });
//         return;
//       }
//       const user = rows[0] as user;

//       const isPasswordValid = await bcrypt.compare(
//         password,
//         user.password as string
//       );

//       if (!isPasswordValid) {
//         res.status(401).json({ error: "Invalid password" });
//         return;
//       } else {
//         const accessToken = createTokens({
//           id: user.id,
//           username: user.username,
//           // isAdmin: user.isAdmin,
//         });
//         console.log("Generated Access Token:", accessToken);
//         res.cookie("access-token", accessToken, {
//           httpOnly: true,
//           maxAge: 60 * 60 * 24 * 30 * 1000,
//         });
//         res.json({ message: "Login successful" });
//       }
//     } finally {
//       // Release the connection back to the pool
//       connection.release();
//     }
//   } catch (err) {
//     console.error("Error logging in:", err);
//     res.status(500).json({ error: "Failed to log in" });
//   }
// };

// export const logoutUser = (req: Request, res: Response) => {
//   // Clear the access token cookie
//   res.clearCookie("access-token");
//   res.json({ message: "Logout successful" });
// };

// export default {
//   registerUser,
//   userLogin,
//   logoutUser,
// };
