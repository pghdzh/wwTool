<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <div id="app">
    <AppHeader class="nav" />

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
#app {
  position: relative;
  min-height: 100vh;

  .nav{
    position: fixed;
    top: 0;
    left: 0;
  }
}
</style>
