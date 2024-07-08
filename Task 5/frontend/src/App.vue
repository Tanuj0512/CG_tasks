<script setup lang="ts">
import { ref, onMounted } from "vue";
import User_details from "./components/Emp_details.vue";
import User_table from "./components/Emp_table.vue";
import axios from "axios";
import Auth from "./components/Auth.vue"

interface User {
  id?: number;
  firstName: string;
  lastName: string;
  dob: string;
  address: string;
  mobile: string;
  addFile?: string;
}

const users = ref<User[]>([]);
const editUser = ref<User | null>(null);
const isAuthenticated = ref(false);

onMounted(() => {
  if (isAuthenticated.value) {
    fetchUsers();
  }
});

function fetchUsers() {
  axios
    .get("/api/users")
    .then((response) => {
      users.value = response.data;
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
    });
}

function handleAuthSuccess() {
  isAuthenticated.value = true;
  fetchUsers();
}

function addUser(user: User) {
  users.value.push(user);
}

function deleteUser(userId: number) {
  users.value = users.value.filter((user) => user.id !== userId);
}

function setEditUser(user: User) {
  editUser.value = user;
}

function updateUser(updatedUser: User) {
  const index = users.value.findIndex((user) => user.id === updatedUser.id);
  if (index !== -1) {
    users.value.splice(index, 1, updatedUser);
  }
  editUser.value = null;
}
</script>

<template>
  <div class="App">
    <Auth v-if="!isAuthenticated" @auth-success="handleAuthSuccess" />
    <div v-else class = "headingAndContent">
      <h1>CRUD App</h1>

      <div class="container">
        <div class="form">
          <User_details @add-user="addUser" />
        </div>
        <div class="tablee">
          <User_table
            :users="users"
            @delete-user="deleteUser"
            @update-user="updateUser"
            @edit-user="setEditUser"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.App {
  width: 100%;
  /* box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px; */
  display: flex;
  flex-direction: column;
  margin: 5vh auto;
  /* align-items: center; */
  font-family: Arial, Helvetica, sans-serif;
  color: #333;
}
.headingAndContent {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* row-gap: 10vh; */
}

.container {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  width: 100%;
  gap: 5vw;
  /* padding: 2vh 2vw 10vh 2vw; */
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
