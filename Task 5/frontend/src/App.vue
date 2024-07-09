<template>
  <div id="App">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
</script>

<style>
.App {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 5vh auto;
  font-family: Arial, Helvetica, sans-serif;
  color: #333;
}
</style>
