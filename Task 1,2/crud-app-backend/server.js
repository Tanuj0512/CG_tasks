const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const app = express();
const port = 3000;

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

//database configuration
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "T@nuj123",
  database: "crud_users",
});

//database connection
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("MySQL connected");
});

//route to add a new user
app.post("/users", (req, res) => {
  const { firstName, lastName, dob, address, mobile } = req.body;
  const sql =
    //sql query
    "INSERT INTO users (firstName, lastName, dob, address, mobile) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [firstName, lastName, dob, address, mobile], (err, result) => {
    //error handeling
    if (err) {
      console.error("Error adding user:", err);
      res.status(422).json({ error: "Failed to add user" });
      return;
    }
    res.status(201).json({
      id: result.insertId,
      firstName,
      lastName,
      dob,
      address,
      mobile,
    });
    //If the query is successful, it sends a JSON response back to the client
    //containing the inserted user's details, including the id of the new user (result.insertId).
  });
});

//get allusers
app.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching users:", err);
      res.status(424).json({ error: "Failed to fetch users" });
      return;
    }
    res.status(200).json(result);
  });
});


//update user
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, dob, address, mobile } = req.body;

  const sql =
    "UPDATE users SET firstName = ?, lastName = ?, dob = ?, address = ?, mobile = ? WHERE id = ?";

  db.query(sql, [firstName, lastName, dob, address, mobile, id], (err, result) => {
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
  });
});


//route to delete a user
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM users WHERE id = ?";

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
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
