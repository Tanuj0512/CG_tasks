<template>
    <div>
      <h1>Page 2</h1>
      <h1>Waaps jaa !!</h1>
      <button @click="prevPage()">Go to Page 1</button>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { useRouter } from "vue-router";
  
  export default defineComponent({
    name: 'Page2',

    setup() {
  const router = useRouter();

  const prevPage = () => {
    router.push('/');
  };

  return {
    prevPage
  };
}
    
  });
  </script>
  