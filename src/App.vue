<script setup>
import { RouterView } from 'vue-router'
import MainHeader from './MainView/components/MainHeader.vue'
</script>

<script>
export default {
  computed: {
    sinHeader() {
      return this.$route.path === '/login' || this.$route.path === '/register'
    },
  },
}
</script>

<template>
  <div class="app-layout">
    <MainHeader v-if="$route.meta.requiresHeader !== false"></MainHeader>
    <div :class="{ 'main-content': true, noPadding: sinHeader }">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0 !important;
  padding: 0 !important;
  box-sizing: border-box;
  max-width: 100%;
  overflow-x: hidden;
}
.app-layout {
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: 100vh;
}
.main-content {
  grid-row: 2;
  padding: 20px;
  width: 100%;
  padding-top: calc(80px + 20px) !important;
}
.noPadding {
  padding-top: 20px;
}
</style>
