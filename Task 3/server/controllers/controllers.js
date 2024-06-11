const { error } = require("console");
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
  db.query(sql, values,(err, result) => {
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

//search item -//term - value
const search = (req, res) => {
  const searchTerm = req.query.term; //gets the value of key-value pair at the end of URL
  if (!searchTerm) {
    return res.status(400).json({
      error: "Search term is required",
    });
  }

  const sql = setSearchQuery.searchQuery;
  const searchValue = `%${searchTerm}%`;

  db.query(
    sql,
    [searchValue, searchValue, searchValue, searchValue, searchValue],
    (err, results) => {
      if (err) {
        console.error("Executin search query", err);
        return res.status(500).json({ error: "Internal sever error" });
      }
      res.json(results);
    }
  );
};

//sorting - sortBy-...., order -.....
const sorting = (req, res) => {
  const sortBy = req.query.sortBy;
  const order = req.query.order === "desc" ? "DESC" : "ASC";

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

  if (order !== "ASC" && order !== "DESC") {
    return res.status(400).send("Invalid order parameter");
  }

  setSortQuery(sortBy, order, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
};

//pagenation page, items
const pagenation = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = parseInt(req.query.itemsPerPage) || 10; //parseInt - to convert string to number, in URL "?page=2&items=10" 2 and 10 will be considered as string with parseInt
  const offset = (page - 1) * itemsPerPage; //skip the no. of entries before starting to new page

  const sql = setPagenation.pagegenation;
  const countSql = setPagenation.countPagenation;

  //countSql
  db.query(countSql, (err, countResults) => {
    if (err) {
      res.status(500).json({ error: "count query failed" });
      console.log(err);
    } else {
      const totalItems = countResults[0].total;
      //pgenation
      db.query(sql, [itemsPerPage, offset], (err, results) => {
        if (err) {
          res.status(500).json({ error: "Items not found" });
          console.log(err);
        } else {
          res.setHeader("X-Total-Count", totalItems);//to understand frontend total no. of items available
          res.json(results);
        }
      });
    }
  });
};

module.exports = {
  addUser,
  getAllUsers,
  updateUser,
  deleteUser,
  search,
  pagenation,
  sorting,
};
