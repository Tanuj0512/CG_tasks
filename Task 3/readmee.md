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


//VALIDATE USER

The provided code defines a middleware function validateUser for validating the request body against a Joi schema (userSchema). This function is designed to be used in an Express.js application to ensure that incoming requests meet the expected validation criteria before processing them further.

Here's a detailed breakdown of how the validateUser middleware works:

validateUser Middleware Function
Import userSchema:

The userSchema is imported from a separate module located at ../validation/validation.
This schema defines the validation rules for the user data (as shown in the earlier examples).
Validation Logic:

The validateUser function receives req, res, and next as arguments. These represent the request, response, and the next middleware function in the Express.js route handling chain, respectively.
The request body (req.body) is validated against userSchema using the validate method.
Handling Validation Errors:

The second argument { abortEarly: false } ensures that Joi will continue validating all fields and collect all errors rather than stopping at the first encountered error.
If there are validation errors, the error object will contain details about the validation failures.
The error details are mapped to extract the error messages.
Sending Error Response:

If validation errors are present, a 400 status code response is sent back to the client, containing a JSON object with the extracted error messages.
The return statement ensures that the request handling stops here if there are errors.
Proceeding to the Next Middleware:

If there are no validation errors, the next() function is called, passing control to the next middleware function or route handler.




//search

The fetchUsers method allows the component to dynamically update the displayed list of users based on the search term entered by the user. Here's a summarized step-by-step explanation:

Check if there is a search term.
If there is a search term:
    Make an API request to fetch the users that match the search term.
    Update filteredUsers with the search results.
If there is no search term:
    Reset filteredUsers to the original list of users.
Log any errors that occur during the API request.


//pagenation 
The backend code implements a paginated API endpoint to fetch users from a database.
It processes query parameters to determine the current page and the number of items per page.
It performs a count query to determine the total number of items and uses this to set a response header.
It fetches the appropriate subset of user data for the current page using SQL LIMIT and OFFSET.
It returns the user data along with a header indicating the total number of items available.




//search,sort,pagenation -http://localhost:3000/users/search?term=jo&page=1&itemsPerPage=10&sortBy=lastName&order=asc
//sort, pagenation - http://localhost:3000/users/sort?sortBy=firstName&order=asc&page=2&itemsPerPage=10


//emit the data from fetchUser and pass as a function


<template>
  <div class="tableInfo">
    <h3>Users Data</h3>
    <div class="table-header">
      <div class="search-bar">
        <label>Search Bar</label>
        <input
          type="text"
          placeholder="...search"
          v-model="searchTerm"
          @input="fetchUsers"
          class="search-input"
        />
      </div>
      <div class="sortingBar">
        <label for="dropdown"> Items: </label>
        <select
          v-model="dropDownField"
          @change="itemsDropdown"
          class="select-input"
        >
          <option v-for="option in itemOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>

      <div class="sortingBar">
        <label for="sortField">Sort By:</label>
        <select v-model="sortField" @change="fetchUsers" class="select-input">
          <option
            v-for="option in sortingOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.text }}
          </option>
        </select>
        <label for="sortOrder">Order:</label>
        <select v-model="sortOrder" @change="fetchUsers" class="select-input">
          <option
            v-for="option in orderingOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.text }}
          </option>
        </select>
      </div>
    </div>
    <div>
      <div v-if="showSuccessMessage" class="success-message">
        Data updated successfully!
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Mobile</th>
            <th>Address</th>
            <th>DOB</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody class="tableBody" v-if="filteredUsers.length > 0">
          <tr v-for="(user, index) in filteredUsers" :key="index">
            <td>
              <span v-if="editIndex !== index">{{ user.firstName }}</span>
              <input
                v-else
                v-model="editableUser.firstName"
                class="input-field"
              />
            </td>
            <td>
              <span v-if="editIndex !== index">{{ user.lastName }}</span>
              <input
                v-else
                v-model="editableUser.lastName"
                class="input-field"
              />
            </td>
            <td>
              <span v-if="editIndex !== index">{{ user.mobile }}</span>
              <input v-else v-model="editableUser.mobile" class="input-field" />
            </td>
            <td>
              <span v-if="editIndex !== index">{{ user.address }}</span>
              <input
                v-else
                v-model="editableUser.address"
                class="input-field"
              />
            </td>
            <td>
              <span v-if="editIndex !== index">{{ user.dob }}</span>
              <input
                v-else
                v-model="editableUser.dob"
                type="date"
                class="input-field"
              />
            </td>
            <td class="buttons-align">
              <button
                v-if="editIndex !== index"
                class="edit-button"
                @click="startEditing(index, user)"
              >
                Edit
              </button>
              <button v-else class="update-button" @click="saveEdit">
                Update
              </button>
              <button
                v-if="editIndex === index"
                class="cancel-button"
                @click="cancelEdit"
              >
                Cancel
              </button>
              <button
                v-if="editIndex !== index"
                class="delete-button"
                @click="confirmDelete(user.id)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
        <div v-else class="no-users-message"><h2>No user found</h2></div>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import axios from "axios";

const props = defineProps({
  users: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update-user", "delete-user"]);

const editIndex = ref(null);
const editableUser = reactive({});
const showSuccessMessage = ref(false);
const searchTerm = ref("");
const filteredUsers = ref([]);
const sortField = ref("firstName");
const sortOrder = ref("asc");
const dropDownField = ref(10);
const itemOptions = [5, 10, 25];
const sortingOptions = [
  { value: "firstName", text: "First Name" },
  { value: "lastName", text: "Last Name" },
  { value: "mobile", text: "Mobile" },
  { value: "address", text: "Address" },
  { value: "dob", text: "DOB" },
];
const orderingOptions = [
  { value: "asc", text: "Ascending" },
  { value: "desc", text: "Descending" },
];

watch(
  () => props.users,
  (newUsers) => {
    filteredUsers.value = newUsers;
  },
  { immediate: true }
);

const startEditing = (index, user) => {
  editIndex.value = index;
  Object.assign(editableUser, { ...user });
};

const saveEdit = () => {
  axios
    .put(`/api/users/${editableUser.id}`, editableUser)
    .then(() => {
      emit("update-user", { ...editableUser });
      editIndex.value = null;
      showSuccessMessage.value = true;
      setTimeout(() => {
        showSuccessMessage.value = false;
      }, 2000);
    })
    .catch((error) => {
      console.error("Error updating user:", error);
    });
};

const cancelEdit = () => {
  editIndex.value = null;
  Object.keys(editableUser).forEach((key) => {
    editableUser[key] = "";
  });
};

const confirmDelete = async (userId) => {
  if (confirm("Are you sure you want to delete this user?")) {
    try {
      await axios.delete(`/api/users/${userId}`);
      emit("delete-user", userId);
      filteredUsers.value = filteredUsers.value.filter(
        (user) => user.id !== userId
      );
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }
};

const fetchUsers = async () => {
  const params = {
    term: searchTerm.value,
    sortBy: sortField.value,
    order: sortOrder.value,
  };

  try {
    const response = await axios.get("/api/users/search", { params });
    filteredUsers.value = response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

const itemsDropdown = () => {
  fetchUsers();
};

onMounted(() => {
  fetchUsers();
});
</script>
