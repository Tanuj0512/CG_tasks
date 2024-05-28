<template>
  <form class="Emp_data" @submit.prevent="handleSubmit">
    <div class="FirstName">
      <label type="text">First Name</label>
      <input
        class="first_nameInput"
        type="text"
        placeholder="Enter your Name..."
        v-model="user.firstName"
      />
    </div>

    <div class="LastName">
      <label type="text">Last Name</label>
      <input
        class="last_nameInput"
        type="text"
        placeholder="Enter your Name..."
        v-model="user.lastName"
      />
    </div>

    <div class="Dob">
      <label>Date of birth</label>
      <input class="User_dob" type="date" v-model="user.dob" />
    </div>

    <div class="Address">
      <label>Address</label>
      <input
        class="User_address"
        type="text"
        placeholder="Enter your address..."
        v-model="user.address"
      />
    </div>

    <div class="Mobile">
      <label>Mobile Number</label>
      <input
        class="User_dob"
        type="tel"
        placeholder="Enter your mobile number..."
        v-model="user.mobile"
      />
    </div>

    <button class="Add">Add User</button>
  </form>
</template>

<script>
export default {
  name: "User_details",
  data() {
    return {
      user: {
        firstName: "",
        lastName: "",
        dob: "",
        address: "",
        mobile: "",
      },
    };
  },
  methods: {
    handleSubmit() {
      this.$emit("add-user", { ...this.user });
      console.log("Form submitted:", this.user);

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

.FirstName,
.LastName,
.Dob,
.Address,
.Mobile {
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