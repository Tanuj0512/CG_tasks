<template>
  <h3>User Form</h3>
  <form class="Emp_data" @submit.prevent="handleSubmit">
    <div class="FirstName mb-10"> 
      <label type="text">First Name</label>
      <input
        class="first_nameInput"
        type="text"
        placeholder="Enter your Name..."
        v-model="user.firstName"
      />
    </div>

    <div class="LastName mb-10">
      <label type="text">Last Name</label>
      <input
        class="last_nameInput"
        type="text"
        placeholder="Enter your Name..."
        v-model="user.lastName"
      />
    </div>

    <div class="Dob mb-10">
      <label>Date of birth</label>
      <input class="User_dob" type="date" v-model="user.dob" />
    </div>

    <div class="Address mb-10">
      <label>Address</label>
      <input
        class="User_address"
        type="text"
        placeholder="Enter your address..."
        v-model="user.address"
      />
    </div>

    <div class="Mobile mb-10">
      <label>Mobile Number</label>
      <input
        class="User_dob"
        type="tel"
        placeholder="Enter your mobile number..."
        v-model="user.mobile"
      />
    </div>

    <button class="Add">{{ isEditing ? "Update User" : "Add User" }}</button>
  </form>
</template>

<script>
export default {
  name: "User_details",
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
      isEditing: false,
    };
  },

  watch: {
    editUser: {
      handler(newVal) {
        if (newVal) {
          this.user = { ...newVal };
          this.isEditing = true;
        }
      },
      immediate: true,
    },
  },

  methods: {
    handleSubmit() {
      if (this.isEditing) {
        this.$emit("update-user", { ...this.user });
        this.isEditing = false;
      } else {
        this.$emit("add-user", { ...this.user });
      }

      console.log("Form submitted:", this.user);
      this.resetForm();
    },

    resetForm() {
      this.user = {
        firstName: "",
        lastName: "",
        dob: "",
        address: "",
        mobile: "",
      };
    },
  },
};
</script>

<style scoped>
.Emp_data {
  width: 400px;
  /* margin: auto; */
}

/* .FirstName,
.LastName,
.Dob,
.Address,
.Mobile */
.mb-10{ 
  margin-bottom: 10px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
input[type="date"],
input[type="tel"] {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button.Add {
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}

button.Add:hover {
  background-color: #45a049;
}
</style>