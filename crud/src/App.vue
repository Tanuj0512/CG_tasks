<script setup>
import { ref } from "vue";
import User_details from "./components/Emp_details.vue";
import User_table from "./components/Emp_table.vue";

const users = ref([]);
//function create a ractive state using 'ref', means any change to it will automatically triger DOM

function addUser(user) {
  users.value.push(user);
}

function deleteUser(index) {
  users.value.splice(index);
}
</script>

<template>
  <div class="App">
    <div class="container">
      <h1>CRUD App</h1>
      <User_details @add-user="addUser" />
      <!-- User_details pushes 'add user' (user data), it sets event lisytner to 'add-user' 
      and 'add user' function is called whenever emint is pushed -->

      <User_table :users="users" 
      @delete-user="deleteUser" />
      <!-- : indicates user is a dynamic value ....'users'array is passed as a prop to 'User-table' -->
    </div>
  </div>
</template>

<style scoped>
.App {
    display: flex;
    flex-direction: column;
    align-items: baseline;
    padding-left: 2vw;
}
.container {
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  margin-top: 20px;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
  color: orangered;
}
div#app {
  display: flex;
  padding-left: 5vw;
}
</style>