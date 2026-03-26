import HomePage from '@/pages/HomePage.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'

const publicRoutes = [
  {
    path: '/',
    component: HomePage,
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
