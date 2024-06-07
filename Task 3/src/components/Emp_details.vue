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
          required
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
          required
        />
      </div>

      <div class="form-group">
        <label for="dob">Date of Birth <span class="req">*</span></label>
        <input
          id="dob"
          class="form-control"
          type="date"
          v-model="user.dob"
          required
        />
      </div>

      <div class="form-group">
        <label for="address">Address <span class="req">*</span></label>
        <input
          id="address"
          class="form-control"
          type="text"
          placeholder="Enter your address"
          v-model="user.address"
          required
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
          required
        />
      </div>
      <div class="form-but">
        <button class="btn btn-primary">{{ editUser ? 'Update User' : 'Add User' }}</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UserForm",
  props: {
    editUser: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      user: {
        firstName: "",
        lastName: "",
        dob: "",
        address: "",
        mobile: "",
      },
      errorMessage: "",
    };
  },
  watch: {
    editUser: {
      handler(newVal) {
        if (newVal) {
          this.user = { ...newVal };
        } else {
          this.resetForm();
        }
      },
      immediate: true,
    },
  },
  methods: {
    async handleSubmit() {
      try {
        if (this.editUser) {
          await axios.put(`/api/users/${this.user.id}`, this.user);
          this.$emit("update-user", { ...this.user });
        } else {
          const response = await axios.post("/api/users", this.user);
          this.$emit("add-user", response.data);
        }
        this.resetForm();
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
    resetForm() {
      this.user = {
        firstName: "",
        lastName: "",
        dob: "",
        address: "",
        mobile: "",
      };
      this.errorMessage = "";
    },
  },
};
</script>

<style scoped>
.user-form {
  max-width: 400px;
  /* margin: auto; */
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
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.btn {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn:hover {
  background-color: #45a049;
}
</style>
