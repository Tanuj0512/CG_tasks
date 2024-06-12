const { error, count } = require("console");
const db = require("../config/db");
const {
  addUserQuery,
  getUserQuery,
  updateUserQuery,
  deleteUserQuery,
  setSearchQuery,
  setPagenation,
  setSortQuery,
} = require("../services/queries");
// const { db } = require("express");

//route to add a new user
const addUser = (req, res) => {
  const { firstName, lastName, dob, address, mobile } = req.body;
  const sql = addUserQuery.addUser;
  const values = [firstName, lastName, dob, address, mobile];
  db.query(sql, values, (err, result) => {
    //error handeling
    if (err) {
      console.error("Error adding user:", err);
      res.status(422).json({ error: "Failed to add user" });
      return;
    }
    // res.status(201).json({ message: 'User added successfully' });
  });
  //If the query is successful, it sends a JSON response back to the client
  //containing the inserted user's details, including the id of the new user (result.insertId).
};

//get allusers
const getAllUsers = (req, res) => {
  const sql = getUserQuery.getUser;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching users:", err);
      res.status(424).json({ error: "Failed to fetch users" });
      return;
    }
    res.status(200).json(result);
  });
};

//update user
const updateUser = (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, dob, address, mobile } = req.body;

  const sql = updateUserQuery.updateUser;

  db.query(
    sql,
    [firstName, lastName, dob, address, mobile, id],
    (err, result) => {
      if (err) {
        console.error("Error updating user:", err);
        return res.status(424).json({ error: "Failed to update user" });
      }
      if (result.affectedRows === 0) {
        console.error("User not found:", id);
        return res.status(404).json({ error: "User not found" });
      }
      console.log("User updated successfully:", result);
      res.json({ id, firstName, lastName, dob, address, mobile });
    }
  );
};

//route to delete a user
const deleteUser = (req, res) => {
  const { id } = req.params;
  const sql = deleteUserQuery.deleteUser;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      res.status(424).json({ error: "Failed to delete user" });
      return;
    }
    if (result.affectedRows === 0) {
      //if mentioned id not exist in db
      res.status(404).json({ error: "User not found" });
      return;
    }
    //success deletion
    res.status(200).send("User deleted");
  });
};

// //pagenation page, items
// const pagenation = (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
//   const offset = (page - 1) * itemsPerPage;

//   const paginationSql = setPagenation.pagegenation;
//   const countSql = setPagenation.countPagenation;

//   //count query
//   db.query(countSql, (err, countResults) => {
//     if (err) {
//       console.error("Executing count query", err);
//       return res.status(500).json({ error: "Count query failed" });
//     }
//     const totalItems = countResults[0].total;
//     //pagenation
//     db.query(paginationSql, [itemsPerPage, offset], (err, results) => {
//       if (err) {
//         console.error("Executing pagination query", err);
//         return res.status(500).json({ error: "Pagination query failed" });
//       }

//       res.setHeader("X-Total-Count", totalItems);
//       res.json(results);
//     });
//   });
// };

// //sorting and pagenation
// const sorting = (req, res) => {
//   const sortBy = req.query.sortBy;
//   const order = req.query.order === "desc" ? "DESC" : "ASC";
//   const page = parseInt(req.query.page) || 1;
//   const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
//   const offset = (page - 1) * itemsPerPage;

//   const validSortBy = [
//     "firstName",
//     "lastName",
//     "dob",
//     "address",
//     "mobile",
//     "id",
//   ];
//   if (!validSortBy.includes(sortBy)) {
//     return res.status(400).send("Invalid sortBy parameter");
//   }

//   const sortQuery = `
//     SELECT * FROM users
//     ORDER BY ${sortBy} ${order}
//     LIMIT ? OFFSET ?
//   `;

//   // Execute the sort query with pagination parameters
//   db.query(sortQuery, [itemsPerPage, offset], (err, results) => {
//     if (err) {
//       console.error("Executing sort query", err);
//       return res.status(500).json({ error: "Sort query failed" });
//     }

//     // Execute count query to get total count for pagination
//     const countSql = `SELECT COUNT(*) as total FROM users `;
//     db.query(countSql, (err, countResults) => {
//       if (err) {
//         console.error("Executing count query", err);
//         return res.status(500).json({ error: "Count query failed" });
//       }
//       const totalItems = countResults[0].total;
//       res.setHeader("X-Total-Count", totalItems);
//       res.json(results);
//     });
//   });
// };

//search sort pagenation -//term - value
const search = (req, res) => {
  const searchTerm = req.query.term;
  const sortBy = req.query.sortBy || "firstName";
  const order = req.query.order === "desc" ? "DESC" : "ASC";
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
  const offset = (page - 1) * itemsPerPage;

  if (!searchTerm) {
    return res.status(400).json({
      error: "Search term is required",
    });
  }

  const validSortBy = [
    "firstName",
    "lastName",
    "dob",
    "address",
    "mobile",
    "id",
  ];
  if (!validSortBy.includes(sortBy)) {
    return res.status(400).send("Invalid sortBy parameter");
  }

  const searchValue = `%${searchTerm}%`;
  const searchQuery = `
    SELECT * FROM users
    WHERE firstName LIKE ? OR lastName LIKE ? OR mobile LIKE ? OR address LIKE ? OR dob LIKE ?
    ORDER BY ${sortBy} ${order}
    LIMIT ? OFFSET ?
  `;
  const countSql = `
    SELECT COUNT(*) as total FROM users
    WHERE firstName LIKE ? OR lastName LIKE ? OR mobile LIKE ? OR address LIKE ? OR dob LIKE ?
  `;

  db.query(
    searchQuery,
    [
      searchValue,
      searchValue,
      searchValue,
      searchValue,
      searchValue,
      itemsPerPage,
      offset,
    ],
    (err, results) => {
      if (err) {
        console.error("Executing search query", err);
        return res.status(500).json({ error: "Search query failed" });
      }

      db.query(
        countSql,
        [searchValue, searchValue, searchValue, searchValue, searchValue],
        (err, countResults) => {
          if (err) {
            console.error("Executing count query", err);
            return res.status(500).json({ error: "Count query failed" });
          }

          const totalItems = countResults[0].total;
          res.setHeader("X-Total-Count", totalItems);
          res.json(results);
        }
      );
    }
  );
};

module.exports = {
  addUser,
  getAllUsers,
  updateUser,
  deleteUser,
  search,
  // pagenation,
  // sorting,
};
