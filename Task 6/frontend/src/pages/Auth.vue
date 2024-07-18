<template>
  <div class="auth-container">
    <div class="auth">
      <h2 class="auth-title">{{ isLoginMode ? "Login" : "Sign Up" }}</h2>
      <form
        @submit.prevent="isLoginMode ? loginUser() : registerUser()"
        class="auth-form"
      >
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" v-model="username" required />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" v-model="password" required />
        </div>
        <button type="submit" class="auth-button">
          {{ isLoginMode ? "Login" : "Sign Up" }}
        </button>
      </form>
      <p v-if="error" class="auth-error">{{ error }}</p>
      <button @click="toggleMode" class="toggle-button">
        {{ isLoginMode ? "Switch to Sign Up" : "Switch to Login" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const username = ref("");
const password = ref("");
const error = ref("");
const isLoginMode = ref(route.name === "Login");

watch(
  () => route.name,
  (newRouteName) => {
    isLoginMode.value = newRouteName === "Login";
  }
);

function toggleMode() {
  isLoginMode.value = !isLoginMode.value;
  error.value = "";
  router.push(isLoginMode.value ? "/login" : "/signup");
}

async function loginUser() {
  try {
    const response = await axios.post("/api/login", {
      username: username.value,
      password: password.value,
    });
    if (response.data.message === "Login successful") {
      alert("Login Successful");
      router.push("/crud");
    } else {
      error.value = "Invalid login credentials";
    }
  } catch (err) {
    error.value = "Error logging in";
    console.error(err);
  }
}

async function registerUser() {
  try {
    const response = await axios.post("/api/register", {
      username: username.value,
      password: password.value,
    });
    if (response.data === "User Registered") {
      alert("You are Signed In");
      router.push("/login");
    } else {
      error.value = "Username already exists";
    }
  } catch (err) {
    error.value = "Error registering user";
    console.error(err);
  }
}
</script>

<style scoped>
.auth-container {
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  width: 100vw;
}

.auth {
  width: 100%;
  max-width: 500px;
  padding: 20px;
  border-radius: 5px;
  background-color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.auth-title {
  text-align: center;
  margin-bottom: 20px;
}

.auth-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
}

input[type="text"],
input[type="password"] {
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 90%;
}

.auth-button {
  padding: 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  width: 95%;
}

.auth-button:hover {
  background-color: #45a049;
}

.auth-error {
  color: #ff6347;
  text-align: center;
  margin-top: 10px;
}

.toggle-button {
  border: 1px solid #45a049;
  padding: 12px;
  background-color: white;
  color: #45a049;
  /* border: none; */
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  width: 95%;
  margin-top: 10px;
}
</style>
