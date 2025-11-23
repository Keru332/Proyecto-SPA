import { createRouter, createWebHistory } from 'vue-router'
import MainPresentation from '@/MainView/components/MainPresentation.vue'
import LogIn from '@/Authentication/components/LogIn.vue'
import SignIn from '@/Authentication/components/SignIn.vue'
import TratamientosSeleccion from '@/TratamientoSection/components/TratamientosSeleccion.vue'
import { authService } from '@/Authentication/services/auth'
import AgendarCita from '@/VentaSection/components/AgendarCita.vue'
import PaquetesSelection from '@/PaquetesSection/components/PaquetesSelection.vue'
import EditarTratamiento from '@/TratamientoSection/components/EditarTratamiento.vue'
import ComprarPaquete from '@/VentaSection/components/ComprarPaquete.vue'
import adminPanel from '@/admin/adminPanel.vue'
import EditarPaquete from '@/PaquetesSection/components/EditarPaquete.vue'
import CitasSeleccion from '@/CitasSection/CitasSeleccion.vue'
import NotFound from '@/NotFound.vue'
import PaquetesVSelection from '@/PaquetesSection/PaquetesVendidosSection/PaquetesVSelection.vue'
import CategoriasSelection from '@/CategoriaSection/components/CategoriasSelection.vue'
import EditarCategoria from '@/CategoriaSection/components/EditarCategoria.vue'
import usuarioPanel from '@/usuario/usuarioPanel.vue'
import CrearCategoria from '@/CategoriaSection/components/CrearCategoria.vue'
import CrearTratamiento from '@/TratamientoSection/components/CrearTratamiento.vue'
import CrearPaquete from '@/PaquetesSection/components/CrearPaquete.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainPresentation,
      meta: { requiresHeader: true, requiresAuth: false, requireAdmin: false },
    },
    {
      path: '/login',
      name: 'login',
      component: LogIn,
      meta: { requiresHeader: false, requiresAuth: false, requireAdmin: false },
    },
    {
      path: '/register',
      name: 'sigin',
      component: SignIn,
      meta: { requiresHeader: false, requiresAuth: false, requireAdmin: false },
    },
    {
      path: '/productos',
      name: 'tratamientos',
      component: TratamientosSeleccion,
      meta: { requiresHeader: true, requiresAuth: true, requireAdmin: false },
    },
    {
      path: '/paquetes',
      name: 'paquetes',
      component: PaquetesSelection,
      meta: { requiresHeader: true, requiresAuth: true, requireAdmin: false },
    },
    {
      path: '/paquetesv',
      name: 'paquetesv',
      component: PaquetesVSelection,
      meta: { requiresHeader: true, requiresAuth: true, requireAdmin: true },
    },
    {
      path: '/citas',
      name: 'citas',
      component: CitasSeleccion,
      meta: { requiresHeader: true, requiresAuth: true, requireAdmin: true },
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
      meta: { requiresHeader: true, requiresAuth: true, requireAdmin: true },
    },
    {
      path: '/EditarPaquete/:id',
      name: 'EditarPaquete',
      component: EditarPaquete,
      props: true,
      meta: { requiresHeader: true, requiresAuth: true, requireAdmin: true },
    },
    {
      path: '/cat',
      name: 'categoria',
      component: CategoriasSelection,
      meta: { requiresHeader: true, requiresAuth: true, requireAdmin: true },
    },
    {
      path: '/catEditar/:id',
      name: 'EditarCategoria',
      component: EditarCategoria,
      meta: { requiresHeader: true, requiresAuth: true, requireAdmin: true },
    },

    {
      path: '/admin',
      name: 'admin',
      component: adminPanel,
      meta: { requiresHeader: true, requiresAuth: true, requireAdmin: true },
    },
    {
      path: '/crearCategoria',
      name: 'crearCategoria',
      component: CrearCategoria,
      meta: { requiresHeader: true, requiresAuth: true, requireAdmin: true },
    },
    {
      path: '/crearTrat',
      name: 'crearTrat',
      component: CrearTratamiento,
      meta: { requiresHeader: true, requiresAuth: true, requireAdmin: true },
    },
    {
      path: '/crearPaquete',
      name: 'crearPaquete',
      component: CrearPaquete,
      meta: { requiresHeader: true, requiresAuth: true, requireAdmin: true },
    },
    {
      path: '/usuario',
      name: 'usuarioPanel',
      component: usuarioPanel,
      meta: { requiresHeader: true, requiresAuth: true, requireAdmin: false },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
      meta: { requiresHeader: false, requiresAuth: false, requireAdmin: false },
    },
  ],
})

router.beforeEach((to, from, next) => {
  // Verificar tokens expirados en cada navegación
  const token = authService.getToken()
  if (token && !authService.isTokenValid(token)) {
    console.log('🛡️ Router: Token expirado, redirigiendo al login')
    authService.logout(false)
    next('/login?expired=true')
    return
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authService.isAuthenticated()) {
      // Redirige al login
      next('/login')
    } else {
      if (to.matched.some((record) => record.meta.requireAdmin)) {
        if (authService.isAuthenticated() && !authService.isAdmin()) {
          next('/')
        } else {
          next()
        }
      } else {
        next()
      }
    }
  } else {
    next()
  }
})

export default router
