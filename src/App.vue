<script setup>
import { RouterView } from 'vue-router'
import MainHeader from './MainView/components/MainHeader.vue'
import CustomModal from './MainView/assets/CustomModal.vue'
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
      <CustomModal />
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  max-width: 100%;
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
  overflow: hidden;
}
.noPadding {
  padding-top: 20px;
}
@media (max-width: 480px) {
  .main-content {
    padding: 0;
    margin: 0;
  }
  .main-content:has(.login-container) {
    padding: 0;
    margin: 0;
    overflow: visible;
  }
}
</style>
