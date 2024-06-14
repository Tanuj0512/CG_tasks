<template>
  <div>
    <h3>User Form</h3>
    <form class="user-form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="firstName">First Name <span class="req">*</span></label>
        <input
          id="firstName"
          class="form-control"
          type="text"
          placeholder="Enter your First Name"
          v-model="user.firstName"
          @input="clearErrorMessage('firstName')"
        />
        <div class="error-message" v-if="errorMessages.firstName">
          {{ getErrorMessage("firstName", errorMessages.firstName) }}
        </div>
      </div>

      <div class="form-group">
        <label for="lastName">Last Name <span class="req">*</span></label>
        <input
          id="lastName"
          class="form-control"
          type="text"
          placeholder="Enter your Last Name"
          v-model="user.lastName"
          @input="clearErrorMessage('lastName')"
        />
        <div class="error-message" v-if="errorMessages.lastName">
          {{ getErrorMessage("lastName", errorMessages.lastName) }}
        </div>
      </div>

      <div class="form-group">
        <label for="dob">Date of Birth <span class="req">*</span></label>
        <input
          id="dob"
          class="form-control"
          type="date"
          v-model="user.dob"
          @input="clearErrorMessage('dob')"
        />
        <div class="error-message" v-if="errorMessages.dob">
          {{ getErrorMessage("dob", errorMessages.dob) }}
        </div>
      </div>

      <div class="form-group">
        <label for="address">Address <span class="req">*</span></label>
        <input
          id="address"
          class="form-control"
          type="text"
          placeholder="Enter your address"
          v-model="user.address"
          @input="clearErrorMessage('address')"
        />
        <div class="error-message" v-if="errorMessages.address">
          {{ getErrorMessage("address", errorMessages.address) }}
        </div>
      </div>

      <div class="form-group">
        <label for="mobile">Mobile Number <span class="req">*</span></label>
        <input
          id="mobile"
          class="form-control"
          type="tel"
          placeholder="Enter your mobile number"
          v-model="user.mobile"
          @input="clearErrorMessage('mobile')"
        />
        <div class="error-message" v-if="errorMessages.mobile">
          {{ getErrorMessage("mobile", errorMessages.mobile) }}
        </div>
      </div>

      <div class="form-but">
        <button class="btn btn-primary">Add User</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import axios from "axios";

const props = defineProps({
  editUser: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["add-user"]);
const user = reactive({
  firstName: "",
  lastName: "",
  dob: "",
  address: "",
  mobile: "",
});

const errorMessages = reactive({});
const isSubmitting = ref(false);

const validateUser = async () => {
  try {
    await axios.post("/api/validateUser/", user);
    Object.keys(errorMessages).forEach((key) => {
      errorMessages[key] = ""; // Clear error messages
    });
    return true;
  } catch (error) {
    if (error.response && error.response.data) {
      const errors = error.response.data.errors;
      errors.forEach((message) => {
        const field = message.split('"')[1]; // Extract field name from message
        errorMessages[field] = message; // Map error message to field name
      });
    }
    return false;
  }
};

const clearErrorMessage = (fieldName) => {
  if (errorMessages[fieldName]) {
    errorMessages[fieldName] = "";
  }
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  const isValid = await validateUser();
  if (!isValid) {
    isSubmitting.value = false;
    return;
  }
  try {
    const response = await axios.post("/api/users", user);
    emit("add-user", response.data);
    alert("User added successfully");
    resetForm();
  } catch (error) {
    console.error("Error submitting form:", error);
  }
};

const resetForm = () => {
  Object.keys(user).forEach((key) => {
    user[key] = "";
  });
  Object.keys(errorMessages).forEach((key) => {
    errorMessages[key] = "";
  });
};
</script>

<style scoped>
.error-message {
  color: red;
}
.req {
  color: red;
}
</style>


<style scoped>
form.user-form {
  background-color: #dbdfd8;
  padding: 3vh;
  border-radius: 10px;
}
.user-form {
  max-width: 400px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
}

.req {
  color: red;
}

.form-control {
  width: calc(100% - 24px); /* Adjusted width to match the table input width */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background-color: #45a049;
}
</style>