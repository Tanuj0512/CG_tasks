import { defineStore } from 'pinia';
import locations from '../assets/location.json';

interface Country {
  name: string;
  code: string;
}

interface State {
  name: string;
  code: string;
}

interface LocationState {
  countries: Country[];
  states: Record<string, State[]>;
  selectedCountry: string | null; // Code of currently selected country
  selectedState: string | null; // Code of currently selected state
}

export const useLocationStore = defineStore('location', {
  // Returns initial state of dropdown
  state: (): LocationState => ({
    countries: locations.countries,
    states: locations.states,
    selectedCountry: null,
    selectedState: null,
  }),

  // Returns the states corresponding to the selected country
  getters: {
    filteredStates: (state) => {
      return state.selectedCountry ? state.states[state.selectedCountry] || [] : [];
    }
  },
  
  actions: {
    setSelectedCountry(countryCode: string | null) {
      this.selectedCountry = countryCode;
      if (countryCode === null) {
        this.selectedState = null; // Reset state if country is deselected
      }
    },
    setSelectedState(stateCode: string | null) {
      this.selectedState = stateCode;
    }
  }
});
