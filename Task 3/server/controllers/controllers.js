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
