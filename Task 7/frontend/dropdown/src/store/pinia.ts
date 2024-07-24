import { defineStore } from "pinia";
import locations from "../assets/location.json";

interface Country {
  name: string;
  code: string;
}

interface State {
  name: string;
  code: string;
}

interface City {
  name: string;
  code: string;
}

interface LocationState {
  countries: Country[];
  states: Record<string, State[]>;
  cities: Record<string, City[]>;
  selectedCountry: string | null; // Code of currently selected country
  selectedState: string | null; // Code of currently selected state
  selectedCity: string | null;
}

export const useLocationStore = defineStore("location", {
  // Returns initial state of dropdown
  state: (): LocationState => ({
    countries: locations.countries,
    states: locations.states,
    cities: locations.cities,
    selectedCountry: null,
    selectedState: null,
    selectedCity: null,
  }),

  // Returns the states corresponding to the selected country
  getters: {
    filteredStates: (state) => {
      return state.selectedCountry
        ? state.states[state.selectedCountry] || []
        : [];
    },
    filteredCities: (city) => {
      return city.selectedState ? city.cities[city.selectedState] || [] : [];
    },
  },

  actions: {
    setSelectedCountry(countryCode: string | null) {
      this.selectedCountry = countryCode;
      // if (countryCode === null) {
      //   this.selectedState = null;
      //   this.selectedCity = null; // Reset state, city if country is deselected
      // }
    },
    setSelectedState(stateCode: string | null) {
      this.selectedState = stateCode;
      // if (stateCode === null) {
      //   this.selectedCity = null; // Reset city if state is deselected
      // }
    },
    setSelectedCity(cityCode: string | null) {
      this.selectedCity = cityCode;
    },
  },
});
