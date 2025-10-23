import { createRouter, createWebHistory } from 'vue-router'
import MainPresentation from '@/MainView/components/MainPresentation.vue'
import LogIn from '@/Authentication/components/LogIn.vue'
import SignIn from '@/Authentication/components/SignIn.vue'
import TratamientosSeleccion from '@/TratamientoSection/components/TratamientosSeleccion.vue'
import CrearTratamiento from '@/TratamientoSection/CrearTratamiento.vue'
import { authService } from '@/Authentication/services/auth'

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
      meta: { requiresHeader: true, requiresAuth: true },
    },
    { path: '/crear-tratamiento',
      name: 'crear-tratamiento',
      component: CrearTratamiento,
      meta: { requiresHeader: true, requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authService.isAuthenticated()) {
      // Redirige al login
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
