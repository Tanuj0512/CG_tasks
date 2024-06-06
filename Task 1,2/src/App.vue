<script setup>
import { ref, onMounted, watch } from "vue";
import User_details from "./components/Emp_details.vue";
import User_table from "./components/Emp_table.vue";
import axios from "axios";

const users = ref([]);
//function create a ractive state using 'ref', means any change to it will automatically triger DOM

const editUser = ref(null);

onMounted(() => {
  //fetch users data from the api
  axios.get("/api/users")
    .then((response) => {
      users.value = response.data;
    })
    .catch((error) => {
      console.error('Error fetching users:', error);
    });
});



function addUser(user) {
  // user.id = Date.now(); // Ensure a unique ID for new users
  users.value.push(user);
}

function deleteUser(userId) {
  users.value = users.value.filter((user) => user.id !== userId);
}
//deletr user by id instead of index

function setEditUser(user) {
  editUser.value = user;
}

function updateUser(updateUser) {
  const index = users.value.findIndex((user) => user.id === updateUser.id);
  if (index !== -1) {
    users.value.splice(index, 1, updateUser);
  }
  editUser.value = null;
}
</script>

<template>
  <div class="App">
    <h1>CRUD App</h1>

    <div class="container">
      <div class="form">
        <User_details
          @add-user="addUser"
          @update-user="updateUser"
          :editUser="editUser"
        />
        <!-- User_details pushes 'add user' (user data), it sets event lisytner to 'add-user' 
      and 'add user' function is called whenever emint is pushed -->
      </div>
      <div class="tablee">
        <User_table
          :users="users"
          @delete-user="deleteUser"
          @update-user="updateUser"
          @edit-user="setEditUser"
        />
        <!-- : indicates user is a dynamic value ....'users'array is passed as a prop to 'User-table' -->
      </div>
    </div>
  </div>
</template>











<style scoped>
.App {
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
  display: flex;
  flex-direction: column;
  margin: 5vh auto;
  align-items: center;
  font-family: Arial, sans-serif;
  color: #333;
}

.container {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  width: 100%;
  gap: 5vw;
  padding: 2vh 2vw 10vh 2vw;
}

h1 {
  font-size: 28px;
  margin-bottom: 20px;
  color: #4caf50;
}

.tablee {
  width: 70%;
}

.form[data-v-7a7a37b1] {
    width: 30%;
    padding-left: 1vw;
}
</style>