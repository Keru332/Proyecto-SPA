import { createRouter, createWebHashHistory } from 'vue-router'
import MainPresentation from '@/MainView/components/MainPresentation.vue'
import LogIn from '@/Authentication/components/LogIn.vue'
import SignIn from '@/Authentication/components/SignIn.vue'
import TratamientosSeleccion from '@/TratamientoSection/components/TratamientosSeleccion.vue'
import { authService } from '@/Authentication/services/auth'
import AgendarCita from '@/VentaSection/components/AgendarCita.vue'
import PaquetesSelection from '@/PaquetesSection/components/PaquetesSelection.vue'
import EditarTratamiento from '@/TratamientoSection/components/EditarTratamiento.vue'
import ComprarPaquete from '@/VentaSection/components/ComprarPaquete.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
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
    {
      path: '/paquetes',
      name: 'paquetes',
      component: PaquetesSelection,
      meta: { requiresHeader: true, requiresAuth: true },
    },
    {
      path: '/agendarCita/:id',
      name: 'agendarCita',
      component: AgendarCita,
      props: true,
      meta: { requiresHeader: true, requiresAuth: true },
    },
    {
      path: '/comprarPaquete/:id',
      name: 'comprarPaquete',
      component: ComprarPaquete,
      props: true,
      meta: { requiresHeader: true, requiresAuth: true },
    },
    {
      path: '/EditarTratamiento/:id',
      name: 'EditarTratamiento',
      component: EditarTratamiento,
      props: true,
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
