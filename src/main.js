import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/assets/custuomvalidate'

import App from './App.vue'
import router from './router'
import { authService } from './Authentication/services/auth'

const app = createApp(App)

authService.initialize()

app.use(createPinia())
app.use(router)

app.mount('#app')
