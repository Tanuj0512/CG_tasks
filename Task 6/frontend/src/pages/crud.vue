<script setup lang="ts">
import { ref, onMounted } from "vue";
import User_details from "../components/Emp_details.vue";
import User_table from "../components/Emp_table.vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
axios.defaults.withCredentials = true;

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

onMounted(() => {
  fetchUsers();
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

function logoutUser() {
  try {
    document.cookie = 'access-token=; expires= 9 11 2001 00:00:00 GMT'; // Clear access-token cookie
    router.push("/login");
  } catch (err) {
    console.error("Error logging out:", err);
  }
}
</script>

<template>
  <div class="headingAndContent">
    <h1>CRUD App</h1>
    <div class="logoutButAlign">
      <button @click="logoutUser" class="btn btn-primary">Logout</button>
    </div>

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
</template>

<style scoped>

.logoutButAlign {
  margin-left: 85vw;
  margin-top: -7vh;
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

.form {
  width: 30%;
  padding-left: 1vw;
}
</style>
