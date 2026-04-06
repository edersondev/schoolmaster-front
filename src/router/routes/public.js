import HomePage from '@/pages/HomePage.vue'
import ForgotPasswordPage from '@/pages/public/ForgotPasswordPage.vue'
import LoginPage from '@/pages/public/LoginPage.vue'
import RegisterPage from '@/pages/public/RegisterPage.vue'
import RegisterPendingPage from '@/pages/public/RegisterPendingPage.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'

const publicRoutes = [
  {
    path: '/',
    component: HomePage,
    meta: { role: 'shared' },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { role: 'shared' },
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
    meta: { role: 'shared' },
  },
  {
    path: '/register/pending',
    name: 'register-pending',
    component: RegisterPendingPage,
    meta: { role: 'shared' },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPasswordPage,
    meta: { role: 'shared' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundPage,
    meta: { role: 'shared' },
  },
]

export default publicRoutes
