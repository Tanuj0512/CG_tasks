<template>
  <div>
    <h4>Select country :</h4>
    <select v-model="selectedCountry" @change="onCountryChange">
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
      <select v-model="selectedState">
        <option
          v-for="state in filteredStates"
          :key="state.code"
          :value="state.code"
        >
          {{ state.name }}
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

export default defineComponent({
  name: "CountryStateDropdown",
  setup() {
    const locationStore = useLocationStore();

    // Fetch countries and states from pinia location store
    const countries = computed<Country[]>(() => locationStore.countries);

    const filteredStates = computed<State[]>(
      () => locationStore.filteredStates
    );

    //Reactive referenses for getting and setting values
    const selectedCountry = computed<string | null>({
      get: () => locationStore.selectedCountry,
      set: (value) => locationStore.setSelectedCountry(value as string | null),
    });

    const selectedState = computed<string | null>({
      get: () => locationStore.selectedState,
      set: (value) => locationStore.setSelectedState(value as string | null),
    });

    // Updates the selected country in store when any contry is selected
    const onCountryChange = () => {
      locationStore.setSelectedCountry(selectedCountry.value);
    };

    return {
      countries,
      filteredStates,
      selectedCountry,
      selectedState,
      onCountryChange,
    };
  },
});
</script>
