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
          @input="searchUsers"
          class="search-input"
        />
      </div>
      <div class="sortingBar">
        <label for="sortField">Sort By:</label>
        <select v-model="sortField" @change="sortUsers" class="select-input">
          <option value="firstName">First Name</option>
          <option value="lastName">Last Name</option>
          <option value="mobile">Mobile</option>
          <option value="address">Address</option>
          <option value="dob">DOB</option>
        </select>
        <label for="sortOrder">Order:</label>
        <select v-model="sortOrder" @change="sortUsers" class="select-input">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
    <div>
      <div v-if="showSuccessMessage" class="success-message">
        Data updated successfully!
      </div>
      <table class="table" v-if="filteredUsers.length > 0">
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
        <tbody class="tableBody">
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
      </table>
      <div v-else class="no-users-message">No user found</div>
      <div class="pagination-controls">
        <button @click="prevPage" :disabled="currentPage === 1">
          Previous
        </button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref } from "vue";

export default {
  name: "UserTable",
  props: {
    users: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      editIndex: null,
      editableUser: {},
      showSuccessMessage: false,
      searchTerm: "", //search
      filteredUsers: this.users, //sort
      sortField: "firstName", //sort
      sortOrder: "asc", //sort
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 0,
    };
  },

  watch: {
    users(newUsers) {
      this.filteredUsers = newUsers;
    },
  }, // Ensure that filteredUsers is updated whenever the users prop changes.

  computed: {
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredUsers.slice(start, end);
    },
  },

  methods: {
    // Start editing a user
    startEditing(index, user) {
      this.editIndex = index;
      this.editableUser = { ...user };
    },

    // Save edited user
    saveEdit() {
      axios
        .put(`/api/users/${this.editableUser.id}`, this.editableUser)
        .then(() => {
          this.$emit("update-user", { ...this.editableUser });
          this.editIndex = null;
          this.showSuccessMessage = true;
          setTimeout(() => {
            this.showSuccessMessage = false;
          }, 2000);
        })
        .catch((error) => {
          console.error("Error updating user:", error);
        });
    },

    // Cancel editing
    cancelEdit() {
      this.editIndex = null;
      this.editableUser = {};
    },

    // Delete user
    async confirmDelete(userId) {
      if (confirm("Are you sure you want to delete this user?")) {
        try {
          await axios.delete(`/api/users/${userId}`);
          this.$emit("delete-user", userId);
          this.filteredUsers = this.filteredUsers.filter(
            (user) => user.id !== userId
          );
          this.fetchUsers();
        } catch (error) {
          console.error("Error deleting user:", error);
        }
      }
    },
    // Search users
    async searchUsers() {
      if (this.searchTerm) {
        try {
          const response = await axios.get(`/api/users/search`, {
            params: { term: this.searchTerm },
          });
          this.filteredUsers = response.data;
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      } else {
        this.fetchUsers(); //whdn no search term
      }
    },

    // Sort users
    async sortUsers() {
      try {
        const response = await axios.get(`/api/users/sort`, {
          params: { sortBy: this.sortField, order: this.sortOrder },
        });
        this.filteredUsers = response.data;
      } catch (error) {
        console.error("Error fetching sorted results:", error);
      }
    },

    //pagenation
    async fetchUsers() {
      try {
        const response = await axios.get("/api/users/items", {
          params: {
            //which page and how many itemsperpage
            page: this.currentPage,
            itemsPerPage: this.itemsPerPage,
          },
        });
        this.filteredUsers = response.data;
        this.totalItems = parseInt(response.headers["x-total-count"]);
        //total no. of items available from server and store in var
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchUsers();
      }
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchUsers();
      }
    },
  },
  mounted() {
    const currentPage = parseInt(this.$route.query.page) || 1;
    this.currentPage = currentPage;
    this.fetchUsers();
  },
  created() {
    this.fetchUsers();
  },
};
</script>

<style scoped>
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar,
.sortingBar {
  display: flex;
  align-items: center;
}

.search-bar input,
.select-input {
  margin-left: 10px;
  padding: 5px;
}

.success-message {
  color: green;
  font-weight: bold;
  margin-bottom: 20px;
}
.pagination-controls {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination-controls button {
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.pagination-controls button:hover {
  background-color: #4caf50;
  color: white;
}

.pagination-controls button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination-controls span {
  margin: 0 10px;
}

.tableBody {
  background-color: ghostwhite;
}
.tableInfo {
  width: 100%;
  max-width: 950px;
  margin: 0 auto;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  border-radius: 8px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.range-setter,
.search-bar,
.sortingBar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.select-input,
.search-input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

.select-input:focus,
.search-input:focus {
  border-color: #4caf50;
  outline: none;
}

.success-message {
  background-color: #dff0d8;
  color: #3c763d;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #d6e9c6;
  border-radius: 4px;
  text-align: center;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.table th,
.table td {
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
  text-align: left;
}

.table th {
  background-color: #4caf50;
  color: white;
  font-weight: bold;
}

.table tr:hover {
  background-color: #f2f2f2;
}

.input-field {
  width: 100%;
  padding: 8px;
  margin: 4px 0;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.input-field:focus {
  border-color: #4caf50;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
}

.buttons-align {
  display: flex;
  gap: 10px;
}

.delete-button,
.edit-button,
.cancel-button,
.update-button {
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.delete-button {
  background-color: #f44336;
  color: white;
}

.delete-button:hover {
  background-color: #e53935;
}

.edit-button {
  background-color: #4caf50;
  color: white;
}

.edit-button:hover {
  background-color: #45a049;
}

.update-button {
  background-color: #4caf50;
  color: white;
}

.update-button:hover {
  background-color: #45a049;
}

.cancel-button {
  background-color: #ff9800;
  color: white;
}

.cancel-button:hover {
  background-color: #fb8c00;
}

.buttons-align {
  display: flex;
  align-items: center;
  gap: 10px;
}

.buttons-align button {
  flex-grow: 1;
}
</style>



