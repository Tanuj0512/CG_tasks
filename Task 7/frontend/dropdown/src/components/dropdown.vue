<template>
  <div>
    <h4>Select country :</h4>
    <select v-model="selectedCountry" @change="onCountryChange">
      <option value="" disabled>Select a country</option>
      <option
        v-for="country in countries"
        :key="country.code"
        :value="country.code"
      >
        {{ country.name }}
      </option>
    </select>

    <div v-if="selectedCountry">
      <h4>Select state :</h4>
      <select v-model="selectedState" @change="onStateChange">
        <option value="" disabled>Select a state</option>
        <option
          v-for="state in filteredStates"
          :key="state.code"
          :value="state.code"
        >
          {{ state.name }}
        </option>
      </select>
    </div>

    <div v-if="selectedState">
      <h4>Select City :</h4>
      <select v-model="selectedCity">
        <option value="" disabled>Select a city</option>
        <option
          v-for="city in filteredCities"
          :key="city.code"
          :value="city.code"
        >
          {{ city.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useLocationStore } from "../store/pinia"; //access pinia store

interface Country {
  code: string;
  name: string;
}

interface State {
  code: string;
  name: string;
}

interface City {
  name: string;
  code: string;
}
export default defineComponent({
  name: "CountryStateDropdown",
  setup() {
    const locationStore = useLocationStore();

    // Fetch countries, state and city from pinia location store
    const countries = computed<Country[]>(() => locationStore.countries);
    const filteredStates = computed<State[]>(
      () => locationStore.filteredStates
    );
    const filteredCities = computed<City[]>(() => locationStore.filteredCities);

    // Reactive referenses for getting and setting values
    const selectedCountry = computed<string | null>({
      get: () => locationStore.selectedCountry,
      set: (value) => locationStore.setSelectedCountry(value as string | null),
    });

    const selectedState = computed<string | null>({
      get: () => locationStore.selectedState,
      set: (value) => locationStore.setSelectedState(value as string | null),
    });

    const selectedCity = computed<string | null>({
      get: () => locationStore.selectedCity,
      set: (value) => locationStore.setSelectedCity(value as string | null),
    });

    // Updates the selected country in store when any contry is selected
    const onCountryChange = () => {
      locationStore.setSelectedCountry(selectedCountry.value);
      locationStore.setSelectedState(null); // Reset state when country changes
      locationStore.setSelectedCity(null);
    };
    const onStateChange = () => {
      locationStore.setSelectedState(selectedState.value);
      locationStore.setSelectedCity(null);
    };

    return {
      countries,
      filteredStates,
      filteredCities,
      selectedCountry,
      selectedState,
      selectedCity,
      onCountryChange,
      onStateChange,
    };
  },
});
</script>
