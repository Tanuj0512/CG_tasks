<template>
  <div>
    <h3>Add User</h3>
    <form class="user-form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="firstName">First Name <span class="req">*</span></label>
        <input
          id="firstName"
          class="form-control"
          type="text"
          placeholder="Enter your First Name"
          v-model="user.firstName"
        />
      </div>

      <div class="form-group">
        <label for="lastName">Last Name <span class="req">*</span></label>
        <input
          id="lastName"
          class="form-control"
          type="text"
          placeholder="Enter your Last Name"
          v-model="user.lastName"
        />
      </div>

      <div class="form-group">
        <label for="dob">Date of Birth <span class="req">*</span></label>
        <input id="dob" class="form-control" type="date" v-model="user.dob" />
      </div>

      <div class="form-group">
        <label for="address">Address <span class="req">*</span></label>
        <input
          id="address"
          class="form-control"
          type="text"
          placeholder="Enter your address"
          v-model="user.address"
        />
      </div>

      <div class="form-group">
        <label for="mobile">Mobile Number <span class="req">*</span></label>
        <input
          id="mobile"
          class="form-control"
          type="tel"
          placeholder="Enter your mobile number"
          v-model="user.mobile"
        />
      </div>

      <div class="form-group">
        <label for="addPicture">Add File <span class="req">*</span></label>
        <input
          id="addPicture"
          class="form-control"
          type="file"
          @change="handleFileUpload"
        />
      </div>

      <div class="form-but">
        <button class="btn btn-primary" :disabled="isSubmitting">
          Add User
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, defineProps, defineEmits } from "vue";
import axios from "axios";

// Set axios defaults to include credentials
axios.defaults.withCredentials = true;

interface User {
  id?: number;
  firstName: string;
  lastName: string;
  dob: string;
  address: string;
  mobile: string;
  addFile?: File;
}


const emit = defineEmits(["add-user"]);
const user = reactive<User>({
  firstName: "",
  lastName: "",
  dob: "",
  address: "",
  mobile: "",
});

const errorMessages = reactive<{ [key in keyof User]?: string }>({});
const isSubmitting = ref(false);



const handleFileUpload = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    user.addFile = target.files[0];
  }
};
const validateUser = async (): Promise<boolean> => {
  try {
    await axios.post("/api/validateUser/", user);
    Object.keys(errorMessages).forEach((key) => {
      errorMessages[key as keyof User] = ""; // Clear error messages
    });
    return true;
  } catch (error: any) {
    if (error.response && error.response.data) {
      const errors: string[] = error.response.data.errors;
      errors.forEach((message: string) => {
        const field = message.split('"')[1] as keyof User; // Extract field name from message
        errorMessages[field] = message; // Map error message to field name
      });
    }
    return false;
  }
};

const handleSubmit = async (): Promise<void> => {
  isSubmitting.value = true;
  const isValid = await validateUser();
  if (!isValid) {
    isSubmitting.value = false;
    return;
  }
  const formData = new FormData();
  formData.append("firstName", user.firstName);
  formData.append("lastName", user.lastName);
  formData.append("dob", user.dob);
  formData.append("address", user.address);
  formData.append("mobile", user.mobile);
  if (user.addFile) {
    formData.append("profilePicture", user.addFile);
  }

  try {
    const response = await axios.post("/api/users", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    emit("add-user", response.data);
    alert("User added successfully");
    resetForm();
  } catch (error) {
    console.error("Error submitting form:", error);
  }
  isSubmitting.value = false;
};

const resetForm = (): void => {
  Object.keys(user).forEach((key) => {
    (user as any)[key as keyof User] = ""; // Ensure proper type assignment
  });
  Object.keys(errorMessages).forEach((key) => {
    errorMessages[key as keyof User] = "";
  });
};
</script>

<style >
.form {
    width: 30%;
}
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

input[type="file"].form-control[data-v-3cbff5e5] {
  padding: 6px 10px;
  cursor: pointer;
  background-color: white;
}

input[type="file"].form-control::file-selector-button {
  padding: 6px 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
}

input[type="file"].form-control::file-selector-button:hover {
  background-color: #45a049;
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
