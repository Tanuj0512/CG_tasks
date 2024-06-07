<template>
  <div class="tableInfo">
    <h3>Users Data</h3>
    <div class="table-header">
      <div class="range-setter">
        <label for="range">Select range:</label>
        <select name="range" id="cars">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
      <div class="search-bar">search bar</div>
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
        <tbody>
          <tr v-for="(user, index) in users" :key="index">
            <td>
              <span v-if="editIndex !== index">{{ user.firstName }}</span>
              <input v-else v-model="editableUser.firstName" />
            </td>
            <td>
              <span v-if="editIndex !== index">{{ user.lastName }}</span>
              <input v-else v-model="editableUser.lastName" />
            </td>
            <td>
              <span v-if="editIndex !== index">{{ user.mobile }}</span>
              <input v-else v-model="editableUser.mobile" />
            </td>
            <td>
              <span v-if="editIndex !== index">{{ user.address }}</span>
              <input v-else v-model="editableUser.address" />
            </td>
            <td>
              <span v-if="editIndex !== index">{{ user.dob }}</span>
              <input v-else v-model="editableUser.dob" type="date" />
            </td>
            <td class="buttons-align">
              <button
                v-if="editIndex !== index"
                class="Edit-button"
                @click="startEditing(index, user)"
              >
                Edit
              </button>
              <button v-else class="Edit-button" @click="saveEdit">
                Update
              </button>
              <button
                v-if="editIndex === index"
                class="Delete-button"
                @click="cancelEdit"
              >
                Cancel
              </button>
              <button
                v-if="editIndex !== index"
                class="Delete-button"
                @click="confirmDelete(user.id)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

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
    };
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
        } catch (error) {
          console.error("Error deleting user:", error);
        }
      }
    },
  },
};
</script>

<style scoped>
.tableInfo {
  width: 100%;
  max-width: 950px;
  margin: 0 auto;
}

table.table {
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

.table input {
  width: 100%;
  padding: 8px;
  margin: 4px 0;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.table input:focus {
  border-color: #4caf50;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
}

.buttons-align {
  display: flex;
  gap: 10px;
}

.Delete-button,
.Edit-button,
.Cancel-button {
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.Delete-button {
  background-color: #f44336;
  color: white;
}

.Delete-button:hover {
  background-color: #e53935;
}

.Edit-button {
  background-color: #4caf50;
  color: white;
}

.Edit-button:hover {
  background-color: #45a049;
}

.Cancel-button {
  background-color: #ff9800;
  color: white;
}

.Cancel-button:hover {
  background-color: #fb8c00;
}
</style>
