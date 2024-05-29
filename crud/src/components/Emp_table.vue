<template>
  <div class="tableInfo">
    <h3>Users Data</h3>

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
            <td>
              <button
                v-if="editIndex !== index"
                class="Edit-button"
                @click="startEditing(index, user)"
              >
                Edit
              </button>
              <button v-else class="Edit-button" @click="saveEdit(index)">
                Update
              </button>

              <button class="Delete-button" @click="confirmDelete(user.id)">
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
export default {
  name: "User_table",
  props: {
    users: {
      type: Array,
      required: true, 
    },
  },


  
  data() {
    return {
      editIndex: null,
      editableUser: {
        firstName: "",
        lastName: "",
        dob: "",
        address: "",
        mobile: "",
      },
      // showAlert: false,
      // showSuccessMessage: false,
    };
  },
  methods: {
    startEditing(index, user) {
      this.editIndex = index;
      this.editableUser = { ...user };
    },
    saveEdit(index) {
      this.$emit("update-user", { ...this.editableUser });
      this.editIndex = null;
    },

    deleteUser(index) {
      this.$emit("delete-user", index);
    },

    // deleteItem() {
    //   if (confirm("Are you sure you want to delete this item?")) {
    //     this.showAlert = true;
    //   }
    // },

    confirmDelete(userId) {
      if (confirm("Are you sure you want to delete this user?")) {
        this.$emit("delete-user", userId);
      }
    },
    

   
    // editUser(user) {
    //   this.$emit("edit-user", user);
    // },
  },
};
</script>















<style scoped>
.tableInfo {
  width: 500px;
  max-width: 950px;
  overflow: hidden;
  width: 100%;
}

table.table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.table th,
.table td {
  padding: 8px;
  border-bottom: 1px solid #ddd;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table th {
  background-color: #f2f2f2;
  font-weight: bold;
  text-align: left;
}

.table tr:hover {
  background-color: #f2f2f2;
}

.table input {
  width: 100%;
  box-sizing: border-box;
}

.Delete-button,
.Edit-button {
  padding: 6px 12px;
  margin-right: 5px;
  border: none;
  cursor: pointer;
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
</style>