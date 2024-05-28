<template>
  <div class="tableInfo">
    <h3>Users Data</h3>

    <div class="table">
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Mobile</th>
            <th>Address</th>
            <th>DOB</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in users" :key="index">
            <td>{{ user.firstName }}</td>
            <td>{{ user.lastName }}</td>
            <td>{{ user.mobile }}</td>
            <td>{{ user.address }}</td>
            <td>{{ user.dob }}</td>
            <td>
              <button
                class="Delete-button"
                @click="$emit('delete-user', user.id)"
              >
                Delete
              </button>

              <button class="Edit-button">Edit</button>
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

  methods: {
    deleteUser(index) {
      this.$emit("delete-user", index);
    },
  },
};
</script>


<style scoped>
.tableInfo {
  max-width: 800px;
  margin: 20px auto;
}

/* .table {
  width:60vw;
} */

.table table {
  width: 60vw;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 8px;
  border-bottom: 1px solid #ddd;
}

.table th {
  background-color: #f2f2f2;
  font-weight: bold;
  text-align: left;
}

.table tr:hover {
  background-color: #f2f2f2;
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
