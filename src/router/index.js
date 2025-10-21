import { createRouter, createWebHistory } from 'vue-router'
import MainPresentation from '@/MainView/components/MainPresentation.vue'
import LogIn from '@/Authentication/components/LogIn.vue'
import SignIn from '@/Authentication/components/SignIn.vue'
import TratamientosSeleccion from '@/TratamientoSection/components/TratamientosSeleccion.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainPresentation,
      meta: { requiresHeader: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LogIn,
      meta: { requiresHeader: false },
    },
    {
      path: '/register',
      name: 'sigin',
      component: SignIn,
      meta: { requiresHeader: false },
    },
    {
      path: '/productos',
      name: 'tratamientos',
      component: TratamientosSeleccion,
      meta: { requiresHeader: true },
    },
  ],
})

export default router
