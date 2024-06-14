const { error, count } = require("console");
const db = require("../config/db");
const {
  addUserQuery,
  getUserQuery,
  updateUserQuery,
  deleteUserQuery,
  queryPagenation,
  // setSearchQuery,
  // setPagenation,
  // setSortQuery,
} = require("../services/queries");
const { query } = require("express");
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
// const search = (req, res) => {
//   //extracting query paramaters from URL
//   const searchTerm = req.query.term || "";
//   const sortBy = req.query.sortBy || "firstName";
//   const order = req.query.order === "desc" ? "DESC" : "ASC";
//   const page = parseInt(req.query.page) || 1;
//   const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
//   const offset = (page - 1) * itemsPerPage;

//   if (isNaN(page) || page < 1) {
//     return res.status(400).json({ error: "Invalid page parameter" });
//   }

//   if (isNaN(itemsPerPage) || itemsPerPage < 1) {
//     return res.status(400).json({ error: "Invalid itemsPerPage parameter" });
//   }

//   const validSortBy = ["firstName", "lastName", "dob", "address", "mobile"];
//   if (!validSortBy.includes(sortBy)) {
//     return res.status(400).send("Invalid sortBy parameter");
//   }
//   const validOrder = ["ASC", "DESC"];
//   if (!validOrder.includes(order)) {
//     return res.status(400).json({ error: "Invalid order parameter" });
//   }

//   // console.log(`Search Term: ${searchTerm}`);
//   // console.log(`Sort By: ${sortBy}`);
//   // console.log(`Order: ${order}`);
//   // console.log(`Page: ${page}`);
//   // console.log(`Items Per Page: ${itemsPerPage}`);

//   //checks if there is a search term or not
//   const searchCondition = queryPagenation.searchCondition(searchTerm);
//   //creates an array of parameters that will be used to replace the placeholders (?) in the SQL query
//   const searchParams = searchTerm
//     ? [
//         `%${searchTerm}%`,
//         `%${searchTerm}%`,
//         `%${searchTerm}%`,
//         `%${searchTerm}%`,
//         `%${searchTerm}%`,
//       ]
//     : [];

//   //main query
//   const tableQuery = queryPagenation.tableQuery(searchCondition, sortBy, order);

//   //for out of total items display
//   const countSql = queryPagenation.countQuery(searchCondition);

//   // to execute SQL queries against database
//   db.query(
//     tableQuery, //retrieve filtered, sorted, and paginated user records.
//     [...searchParams, itemsPerPage, offset],
//     (err, results) => {
//       if (err) {
//         console.error("Executing search query", err);
//         return res.status(500).json({ error: "Search query failed" });
//       }

//       db.query(countSql, searchParams, (err, countResults) => {
//         if (err) {
//           console.error("Executing count query", err);
//           return res.status(500).json({ error: "Count query failed" });
//         }

//         const totalItems = countResults[0].total;
//         res.setHeader("X-Total-Count", totalItems); //total number of matching records and sents in json f
//         res.json(results);
//       });
//     }
//   );
// };

const search = (req, res) => {
  try {
    // Extracting query parameters from URL
    const searchTerm = req.query.term || "";
    const sortBy = req.query.sortBy || "firstName";
    const order = req.query.order === "desc" ? "DESC" : "ASC";
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
    const offset = (page - 1) * itemsPerPage;

    // Validate page parameter
    if (isNaN(page) || page < 1) {
      return res.status(400).json({ error: "Invalid page parameter" });
    }

    // Validate itemsPerPage parameter
    if (isNaN(itemsPerPage) || itemsPerPage < 1) {
      return res.status(400).json({ error: "Invalid itemsPerPage parameter" });
    }

    // Validate sortBy parameter
    const validSortBy = ["firstName", "lastName", "dob", "address", "mobile"];
    if (!validSortBy.includes(sortBy)) {
      return res.status(400).json({ error: "Invalid sortBy parameter" });
    }

    // Validate order parameter
    const validOrder = ["ASC", "DESC"];
    if (!validOrder.includes(order)) {
      return res.status(400).json({ error: "Invalid order parameter" });
    }

    // Build search condition and parameters based on the search term
    const searchCondition = queryPagenation.searchCondition(searchTerm);
    const searchParams = searchTerm
      ? [
          `%${searchTerm}%`,
          `%${searchTerm}%`,
          `%${searchTerm}%`,
          `%${searchTerm}%`,
          `%${searchTerm}%`,
        ]
      : [];

    //main query
    const tableQuery = queryPagenation.tableQuery(searchCondition,  sortBy, order );
    

    //for out of total items display
    const countSql = queryPagenation.countQuery(searchCondition);

    //exceutes table query with paramaters
    db.query(
      tableQuery,
      [...searchParams, itemsPerPage, offset],
      (err, results) => {
        if (err) {
          console.error("Executing search query", err);
          return res.status(500).json({ error: "Search query failed" });
        }
        //executing coun t function matching searchTerm
        db.query(countSql, searchParams, (err, countResults) => {
          if (err) {
            console.error("Executing count query", err);
            return res.status(500).json({ error: "Count query failed" });
          }

          const totalItems = countResults[0].total;

          //sends pagented user dasta in json format, set header in response to total matching records
          res.setHeader("X-Total-Count", totalItems);
          res.json(results);
        });
      }
    );
  } catch (error) {
    console.error("Unexpected error", error);
    res.status(500).json({ error: "Unexpected error occurred" });
  }
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
