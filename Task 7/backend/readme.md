import express from 'express';
import path from 'path';
import fs from 'fs/promises';

const app = express();
const PORT = 3001;

// Serve static files if needed
app.use(express.static(path.join(__dirname, '../public')));

// Endpoint to get countries and states
app.get('/locations', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, '../data/locations.json'), 'utf-8');
    const locations = JSON.parse(data);
    res.json(locations);
  } catch (error) {
    console.error('Error reading locations data:', error);
    res.status(500).send('Error reading locations data');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});




<template>
  <div>
    <h1>Select Country and State</h1>
    <div>
      <label for="country">Country:</label>
      <select v-model="selectedCountry" @change="fetchStates">
        <option value="">Select a country</option>
        <option v-for="country in countries" :key="country.code" :value="country.code">
          {{ country.name }}
        </option>
      </select>
    </div>
    <div>
      <label for="state">State:</label>
      <select v-model="selectedState" :disabled="!states.length">
        <option value="">Select a state</option>
        <option v-for="state in states" :key="state.code" :value="state.code">
          {{ state.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';

export default defineComponent({
  setup() {
    const countries = ref<any[]>([]);
    const states = ref<any[]>([]);
    const selectedCountry = ref<string | null>(null);
    const selectedState = ref<string | null>(null);

    const fetchLocations = async () => {
      try {
        const response = await axios.get('/locations');
        const data = response.data;
        countries.value = data.countries;
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    const fetchStates = async () => {
      if (selectedCountry.value) {
        try {
          const response = await axios.get('/locations');
          const data = response.data;
          states.value = data.states[selectedCountry.value] || [];
          selectedState.value = null; // Reset selected state
        } catch (error) {
          console.error('Error fetching states:', error);
        }
      } else {
        states.value = [];
      }
    };

    onMounted(() => {
      fetchLocations();
    });

    return {
      countries,
      states,
      selectedCountry,
      selectedState,
      fetchStates
    };
  }
});
</script>

<style scoped>
/* Add some basic styling */
</style>



main
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // If using Vue Router

// Create Vue app
const app = createApp(App);

// Use router if applicable
app.use(router);

// Mount the Vue app
app.mount('#app');


router
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/CountryStateDropdown.vue'; // or wherever your main component is

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  }
  // Add other routes here
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;


app.vue
<template>
  <div id="app">
    <CountryStateDropdown />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CountryStateDropdown from './components/CountryStateDropdown.vue';

export default defineComponent({
  components: {
    CountryStateDropdown
  }
});
</script>

<style>
/* Add some basic styling here */
</style>
