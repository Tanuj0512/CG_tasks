import db from "../config/db";
import { Request, Response } from "express";
import queries from "../query/schema";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  dob: string;
  address: string;
  mobile: string;
}

interface CountResult {
  affectedRows: number;
}

//get Users
export const getUser = async (req: Request, res: Response) => {
  const sql = queries.getUserQuery.getUser;
  try {
    const [result] = await db.query(sql);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(424).json({ error: "Failed to fetch users" });
  }
};

//add User
export const addUser = async (req: Request, res: Response) => {
  const { firstName, lastName, dob, address, mobile } = req.body;
  const sql = queries.addUserQuery.addUser;
  const values = [firstName, lastName, dob, address, mobile];

  try {
    const result = await db.query(sql, values);
    res.status(200).json({ message: "User added successfully" });
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(422).json({ error: "Failed to add user" });
  }
};

//update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, dob, address, mobile } = req.body;
    const sql = queries.updateUserQuery.updateUser;
    const values = [firstName, lastName, dob, address, mobile, id];
    const result = await db.query(sql, values);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ id, firstName, lastName, dob, address, mobile });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(424).json({ error: "Failed to update user" });
  }
};

//delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sql = queries.deleteUserQuery.deleteUser;
    const result = await db.query(sql, [id]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).send("User deleted");
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(424).json({ error: "Failed to delete user" });
  }
};


//search, sort, pagenation
// export const pagenation = async (req: Request, res: Response) => {
//   try {
//     const searchTerm = (req.query.term as string) || "";
//     const sortBy = (req.query.sortBy as string) || "firstName";
//     const order = req.query.order === "desc" ? "DESC" : "ASC";
//     const page = parseInt(req.query.page as string) || 1;
//     const itemsPerPage = parseInt(req.query.itemsPerPage as string) || 10;
//     const offset = (page - 1) * itemsPerPage;

//     if (isNaN(page) || page < 1) {
//       return res.status(400).json({ error: "Invalid page parameter" });
//     }

//     if (isNaN(itemsPerPage) || itemsPerPage < 1) {
//       return res.status(400).json({ error: "Invalid itemsPerPage parameter" });
//     }

//     const validSortBy = ["firstName", "lastName", "dob", "address", "mobile"];
//     if (!validSortBy.includes(sortBy)) {
//       return res.status(400).json({ error: "Invalid sortBy parameter" });
//     }

//     const validOrder = ["ASC", "DESC"];
//     if (!validOrder.includes(order)) {
//       return res.status(400).json({ error: "Invalid order parameter" });
//     }

//     const searchCondition = queries.pagenationQuery.searchCondition(searchTerm);
//     const searchParams = searchTerm
//       ? [
//           `%${searchTerm}%`,
//           `%${searchTerm}%`,
//           `%${searchTerm}%`,
//           `%${searchTerm}%`,
//           `%${searchTerm}%`,
//         ]
//       : [];

//     const tableQuery = queries.pagenationQuery.tableQuery(
//       searchCondition,
//       sortBy,
//       order
//     );

//     const countSql = queries.pagenationQuery.countQuery(searchCondition);

//     const [results] = await db.query<User[]>(tableQuery, [
//       ...searchParams,
//       itemsPerPage,
//       offset,
//     ]);

//     const [countResults] = await db.query<CountResult[]>(
//       countSql,
//       searchParams
//     );

//     const totalItems = countResults[0].total;

//     res.setHeader("X-Total-Count", totalItems.toString());
//     res.json(results);
//   } catch (error) {
//     console.error("Unexpected error", error);
//     res.status(500).json({ error: "Unexpected error occurred" });
//   }
// };

export default { getUser, addUser, updateUser, deleteUser };
