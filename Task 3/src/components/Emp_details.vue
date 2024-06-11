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
      errorMessages: {},
      isSubmitting: false,
    };
  },

  methods: {
    async validateUser() {
      try {
        await axios.post("/api/validateUser/", this.user);
        this.errorMessages = {}; // clear error messages
        return true;
      } catch (error) {
        if (error.response && error.response.data) {
          const errorMessages = error.response.data.errors;
          this.errorMessages = errorMessages.reduce((acc, message) => {
            const field = message.split('"')[1]; // exact field name causing error
            acc[field] = message; // map error message to field name
            return acc;
          }, {});
        }
        return false;
      }
    },
    getErrorMessage(fieldName, errorObject) {
      const errorCode = Object.keys(errorObject)[0];
      return errorObject[errorCode];
    },
    clearErrorMessage(fieldName) {
      // Clear the error message when the user starts typing again
      if (this.errorMessages[fieldName]) {
        this.errorMessages[fieldName] = "";
      }
    },

    async handleSubmit() {
      //validation
      this.isSubmitting = true;
      const isValid = await this.validateUser();
      if (!isValid) {
        this.isSubmitting = false;
        return;
      }
      //if is valid
      try {
        const response = await axios.post("/api/users", this.user);
        this.$emit("add-user", response.data);
        alert("User added Sucessfully");
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
      this.errorMessages = {};
    },
  },
};
</script>


<style scoped>
form.user-form {
  background-color: ghostwhite;
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