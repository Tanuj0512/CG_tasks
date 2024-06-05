//add user
make database and connect it

onmount function

the post functionin server.js


//delete user
Ensure the backend handles DELETE requests to remove a user from the database.

Update the frontend to send DELETE requests when deleting a user.

Update the frontend's state to reflect the removal of the user after a successful deletion.


//update user
Route Definition:

The route is defined using the HTTP PUT method and the path /users/:id, where :id is a route parameter representing the unique identifier of the user to be updated.

Request Handling:

When a PUT request is sent to this route, Express.js parses the request parameters (req.params) to extract the user ID and the request body (req.body) to obtain updated user data such as firstName, lastName, dob, address, and mobile.

SQL Query Execution:

A SQL query string is constructed to update the corresponding user entry in the database table users. The UPDATE statement sets new values for the specified fields (firstName, lastName, dob, address, mobile) based on the provided user ID (id).
Prepared statements with placeholders (?) are used to prevent SQL injection attacks. The actual values are passed separately as an array in the db.query() method.

Database Query:

The db.query() method executes the SQL query asynchronously. It takes the SQL query string, an array of parameter values, and a callback function as arguments.
The callback function handles the result of the database operation. If an error occurs during the query execution, it logs the error and sends a 500 Internal Server Error response to the client with an error message indicating the failure to update the user.
If the query is successful but no rows are affected (i.e., the user with the specified ID does not exist), it logs a message indicating the absence of the user and sends a 404 Not Found response to the client with an error message indicating that the user was not found.
If the update operation is successful and at least one row is affected, it logs a success message and sends a JSON response containing the updated user data to the client.