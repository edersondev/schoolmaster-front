import { useAuthStore } from '@/stores/authStore'
import { getRoleHome } from '@/router/roleHomeMap'

export const registerAuthGuard = (router) => {
  router.beforeEach(async (to) => {
    const routeRole = to.meta?.role

    if (!routeRole || routeRole === 'shared') {
      return true
    }

    const authStore = useAuthStore()

    if (!authStore.token) {
      return { path: '/login' }
    }

    if (!authStore.user && !authStore.loading) {
      try {
        await authStore.fetchMe()
      } catch {
        return { path: '/login' }
      }
    }

    const userRole = authStore.user?.role
    if (userRole && userRole !== routeRole) {
      return { path: getRoleHome(userRole) }
    }

    return true
  })
}
