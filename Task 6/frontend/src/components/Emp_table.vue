<template>
  <h3>Users Data</h3>
  <div class="tableInfo">
    
    <div class="table-header">
      <div class="search-bar">
        <label>Search Bar</label>
        <input
          type="text"
          placeholder="...search"
          v-model="searchTerm"
          @input="fetchUsers"
          class="search-input"
        />
      </div>
      <div class="sortingBar">
        <label for="dropdown">Items:</label>
        <select
          v-model="dropDownField"
          @change="itemsDropdown"
          class="select-input"
        >
          <option v-for="option in itemOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
      <div class="sortingBar">
        <label for="sortField">Sort By:</label>
        <select v-model="sortField" @change="fetchUsers" class="select-input">
          <option
            v-for="option in sortingOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.text }}
          </option>
        </select>
        <label for="sortOrder">Order:</label>
        <select v-model="sortOrder" @change="fetchUsers" class="select-input">
          <option
            v-for="option in orderingOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.text }}
          </option>
        </select>
      </div>
    </div>
    <div>
      <div v-if="showSuccessMessage" class="success-message">
        Data updated successfully!
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Mobile</th>
            <th>Address</th>
            <th>DOB</th>
            <th>Actions</th>
            <th>Files</th>
          </tr>
        </thead>
        <tbody class="tableBody" v-if="paginatedUsers.length > 0">
          <tr v-for="(user, index) in paginatedUsers" :key="user.id">
            <td>
              <span v-if="editIndex !== index">{{ user.firstName }}</span>
              <input
                v-else
                v-model="editableUser.firstName"
                class="input-field"
              />
            </td>
            <td>
              <span v-if="editIndex !== index">{{ user.lastName }}</span>
              <input
                v-else
                v-model="editableUser.lastName"
                class="input-field"
              />
            </td>
            <td>
              <span v-if="editIndex !== index">{{ user.mobile }}</span>
              <input v-else v-model="editableUser.mobile" class="input-field" />
            </td>
            <td>
              <span v-if="editIndex !== index">{{ user.address }}</span>
              <input
                v-else
                v-model="editableUser.address"
                class="input-field"
              />
            </td>
            <td>
              <span v-if="editIndex !== index">{{ user.dob }}</span>
              <input
                v-else
                v-model="editableUser.dob"
                type="date"
                class="input-field"
              />
            </td>
            <td>
              <span v-if="editIndex !== index">
                <img
                  :src="`/uploads/${user.addFile}`"
                  alt=" Picture"
                  class="profile-picture"
                />
              </span>
              <input v-else type="file" @change="handleFileChange" />
            </td>
            <td class="buttons-align">
              <button
                v-if="editIndex !== index"
                class="edit-button"
                @click="startEditing(index, user)"
              >
                Edit
              </button>
              <button v-else class="update-button" @click="saveEdit">
                Update
              </button>
              <button
                v-if="editIndex === index"
                class="cancel-button"
                @click="cancelEdit"
              >
                Cancel
              </button>
              <button
                v-if="editIndex !== index"
                class="delete-button"
                @click="confirmDelete(user.id)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="6" class="no-users-message">No users found</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="lowerPart">
      <div class="pagination-controls">
        <span>Showing page {{ currentPage }} of {{ totalPages }}</span>
      </div>
      <div class="pagination">
        <button @click="changePage(1)" :disabled="currentPage === 1">
          &lt;&lt;
        </button>
        <button @click="prevPage" :disabled="currentPage === 1">&lt;</button>
        <button
          v-for="page in displayPages"
          :key="page"
          @click="changePage(page)"
          :class="{ active: currentPage === page }"
        >
          {{ page }}
        </button>
        <button @click="nextPage" :disabled="currentPage === totalPages">
          &gt;
        </button>
        <button
          @click="changePage(totalPages)"
          :disabled="currentPage === totalPages"
        >
          &gt;&gt;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted } from "vue";
import axios from "axios";

interface User {
  id?: number;
  firstName: string;
  lastName: string;
  dob: string;
  address: string;
  mobile: string;
  addFile?: string;
}

const editableUser = reactive<User>({
  firstName: "",
  lastName: "",
  dob: "",
  address: "",
  mobile: "",
  addFile: "",
});

const props = defineProps<{
  users: User[];
}>();

const emit = defineEmits(["update-user", "delete-user", "edit-user"]);

const editIndex = ref<number | null>(null);
// const editableUser = reactive<User>({});
const showSuccessMessage = ref<boolean>(false);
const searchTerm = ref<string>("");
const filteredUsers = ref<User[]>([]);
const sortField = ref<string>("firstName");
const sortOrder = ref<string>("asc");
const currentPage = ref<number>(1);
const totalItems = ref<number>(0);
const totalPages = ref<number>(0);
const itemsPerPage = ref<number>(10);
const dropDownField = ref<string>("10");
const itemOptions = [5, 10, 25];
const sortingOptions = [
  { value: "firstName", text: "First Name" },
  { value: "lastName", text: "Last Name" },
  { value: "mobile", text: "Mobile" },
  { value: "address", text: "Address" },
  { value: "dob", text: "DOB" },
];
const orderingOptions = [
  { value: "asc", text: "Ascending" },
  { value: "desc", text: "Descending" },
];

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    editableUser.addFile = target.files[0].name;
  }
};

watch(
  () => props.users,
  (newUsers: User[]) => {
    filteredUsers.value = newUsers;
    totalItems.value = newUsers.length;
    totalPages.value = Math.ceil(totalItems.value / itemsPerPage.value);
  },
  { immediate: true }
);

const paginatedUsers = computed(() => {
  return filteredUsers.value;
});

const displayPages = computed(() => {
  const pages: number[] = [];
  const startPage = Math.max(1, currentPage.value - 1);
  const endPage = Math.min(totalPages.value, currentPage.value + 2);
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
});

const startEditing = (index: number, user: User) => {
  editIndex.value = index;
  Object.assign(editableUser, { ...user });
};

const saveEdit = () => {
  axios
    .put(`/api/users/${editableUser.id}`, editableUser)
    .then(() => {
      emit("update-user", { ...editableUser });
      editIndex.value = null;
      showSuccessMessage.value = true;
      setTimeout(() => {
        showSuccessMessage.value = false;
      }, 2000);
    })
    .catch((error) => {
      console.error("Error updating user:", error);
    });
};

const cancelEdit = () => {
  editIndex.value = null;
  Object.keys(editableUser).forEach((key) => {
    (editableUser as any)[key] = "";
  });
};

const confirmDelete = async (userId?: number) => {
  if (confirm("Are you sure you want to delete this user?")) {
    try {
      await axios.delete(`/api/users/${userId}`);
      emit("delete-user", userId);
      filteredUsers.value = filteredUsers.value.filter(
        (user) => user.id !== userId
      );
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }
};

const fetchUsers = async () => {
  const params = {
    term: searchTerm.value,
    page: currentPage.value,
    itemsPerPage: itemsPerPage.value,
    sortBy: sortField.value,
    order: sortOrder.value,
  };

  try {
    const response = await axios.get("/api/users/pagination", { params });
    console.log("API Response:", response.data);
    filteredUsers.value = response.data;
    totalItems.value = parseInt(response.headers["x-total-count"]);
    totalPages.value = Math.ceil(totalItems.value / itemsPerPage.value);
    console.log("filteredUsers:", filteredUsers.value); // Log filtered users array
    console.log("totalItems:", totalItems.value); // Log total items count
    console.log("totalPages:", totalPages.value); // Log total pages count
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};


const itemsDropdown = () => {
  itemsPerPage.value = parseInt(dropDownField.value);
  currentPage.value = 1; // Reset to the first page
  fetchUsers();
};

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchUsers();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchUsers();
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchUsers();
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.profile-picture {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
}
.total_count[data-v-61ea5ed0] {
  margin: 20px 0;
  display: flex;
  align-items: center;
}

.pagination-controls[data-v-61ea5ed0] {
  font-weight: 700;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.lowerPart {
  /* background-color: aqua; */
  display: flex;
  flex-direction: row;
  gap: 400px;
  justify-content: space-between;
}

.total_count {
  margin: 20px 0;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar,
.sortingBar {
  display: flex;
  align-items: center;
}

.search-bar input,
.select-input {
  margin-left: 10px;
  padding: 5px;
}

.success-message {
  color: green;
  font-weight: bold;
  margin-bottom: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}

.pagination button {
  margin: 0 5px;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background-color: #f0f0f0;
  cursor: pointer;
  /* transition: background-color 0.1s ease, color 0.1s ease; */
}

.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.pagination button:not(:disabled):hover {
  background-color: #45a049;
  color: white;
}

.pagination button.active {
  font-weight: bold;
  background-color: #45a049;
  color: white;
}
/* .tableBody {
  background-color: ghostwhite;
} */
.tableInfo {
  width: 100%;
  max-width: 950px;
  margin: 0 auto;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  border-radius: 8px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.range-setter,
.search-bar,
.sortingBar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.select-input,
.search-input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

.select-input:focus,
.search-input:focus {
  border-color: #4caf50;
  outline: none;
}

.success-message {
  background-color: #dff0d8;
  color: #3c763d;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #d6e9c6;
  border-radius: 4px;
  text-align: center;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.table th,
.table td {
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
  text-align: left;
}

.table th {
  background-color: #4caf50;
  color: white;
  font-weight: bold;
}

.table tr:hover {
  background-color: #f2f2f2;
}

.input-field {
  width: 100%;
  padding: 8px;
  margin: 4px 0;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.input-field:focus {
  border-color: #4caf50;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
}

.buttons-align {
  display: flex;
  gap: 10px;
}

.delete-button,
.edit-button,
.cancel-button,
.update-button {
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.delete-button {
  background-color: #f44336;
  color: white;
}

.delete-button:hover {
  background-color: #e53935;
}

.edit-button {
  background-color: #4caf50;
  color: white;
}

.edit-button:hover {
  background-color: #45a049;
}

.update-button {
  background-color: #4caf50;
  color: white;
}

.update-button:hover {
  background-color: #45a049;
}

.cancel-button {
  background-color: #ff9800;
  color: white;
}

.cancel-button:hover {
  background-color: #fb8c00;
}

.buttons-align {
  display: flex;
  align-items: center;
  gap: 10px;
}

.buttons-align button {
  flex-grow: 1;
}
</style>
