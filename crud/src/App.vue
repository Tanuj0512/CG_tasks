<script setup>
import { ref, onMounted, watch } from "vue";
import User_details from "./components/Emp_details.vue";
import User_table from "./components/Emp_table.vue";

const users = ref([]);
//function create a ractive state using 'ref', means any change to it will automatically triger DOM

const editUser = ref(null);

//load data from localstorage on component mount
onMounted(() => {
  const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
  users.value = savedUsers;
});

//watch the users array for change and save to localStorage
watch(
  users,
  (newUsers) => {
    localStorage.setItem("users", JSON.stringify(newUsers));
  },
  { deep: true }
);

function addUser(user) {
  user.id = Date.now();  // Ensure a unique ID for new users
  users.value.push(user);
}

function deleteUser(userId) {
  users.value = users.value.filter(user => user.id !== userId);
}
//deletr user by id instead of index



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
          @update-user = "updateUser"
          @edit-user="setEditUser"
        />
        <!-- : indicates user is a dynamic value ....'users'array is passed as a prop to 'User-table' -->
      </div>
    </div>
  </div>
</template>















<style scoped>
.App[data-v-7a7a37b1] {
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
  width: fit-content;
  /* background-color: azure; */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: 2vw;
  margin-left: 2vw
}
.container[data-v-7a7a37b1][data-v-7a7a37b1] {
        /* background-color: aliceblue; */
        display: flex;
    flex-direction: row;
    /* align-items: center; */
    margin-top: 20px;
    width: 90vw;
    justify-content: space-between;
    padding-bottom: 10vh;
    padding-right: 3vw;

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