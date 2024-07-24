<template>
  <div>
    <h1>Page 1</h1>
    <CountryStateDropdown />

    <h1><button @click="nextPage">Next Page</button></h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CountryStateDropdown from "../components/dropdown.vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Page1",
  components: {
    CountryStateDropdown,
  },

  setup() {
    const router = useRouter();

    const nextPage = () => {
      router.push("/page2");
    };

    return {
      nextPage,
    };
  },
});
</script>
