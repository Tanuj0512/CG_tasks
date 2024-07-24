Summary

Interfaces define the structure of the data.
State initializes the dropdown data and selected values.
Getters allow you to compute derived state values, such as filtering states based on the selected country.
Actions provide methods to change the selected country and state.

Here's how the store works in practice:

When a user selects a country, the setSelectedCountry action updates the selectedCountry.
When a user selects a state, the setSelectedState action updates the selectedState.
The filteredStates getter dynamically provides the list of states for the selected country, ensuring the UI is updated accordingly.