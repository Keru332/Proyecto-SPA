import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/assets/custuomvalidate'

import App from './App.vue'
import router from './router'
import { authService } from './Authentication/services/auth'
import CustomModal from './MainView/assets/CustomModal.vue'
import customModal from './MainView/assets/custom-modal'

const app = createApp(App)

app.component('CustomModal', CustomModal)
app.use(customModal)
app.provide('modal', CustomModal)

authService.initialize()

app.use(createPinia())
app.use(router)

app.mount('#app')
