import { useUser } from '@clerk/nextjs'
import { useAuthStore } from '@/store/auth'

export interface RBACConfig {
  allowedRoles: string[]
  requireRestaurant?: boolean
}

export const useRBAC = () => {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser()
  const { user: authUser } = useAuthStore()

  // Prefer Clerk user, fallback to Zustand auth store
  const effectiveUser = clerkUser
    ? {
        role: (clerkUser.unsafeMetadata?.role as string) || 'EMPLOYEE',
        restaurantId: clerkUser.unsafeMetadata?.restaurantId as string | undefined,
      }
    : authUser

  const hasRole = (allowedRoles: string[]): boolean => {
    if (!clerkLoaded && !authUser) return false
    const userRole = effectiveUser?.role || 'EMPLOYEE'
    return allowedRoles.includes(userRole)
  }

  const hasRestaurantAccess = (): boolean => {
    if (!clerkLoaded && !authUser) return false
    return !!effectiveUser?.restaurantId
  }

  const canAccess = (config: RBACConfig): boolean => {
    if (!clerkLoaded && !authUser) return false
    if (!hasRole(config.allowedRoles)) return false
    if (config.requireRestaurant && !hasRestaurantAccess()) return false
    return true
  }

  const getUserRole = (): string => {
    if (!clerkLoaded && !authUser) return 'EMPLOYEE'
    return effectiveUser?.role || 'EMPLOYEE'
  }

  const isManager = (): boolean => hasRole(['MANAGER'])
  const isChef = (): boolean => hasRole(['CHEF'])
  const isServer = (): boolean => hasRole(['SERVER'])
  const isHost = (): boolean => hasRole(['HOST'])
  const isEmployee = (): boolean => hasRole(['EMPLOYEE'])

  return {
    hasRole,
    hasRestaurantAccess,
    canAccess,
    getUserRole,
    isManager,
    isChef,
    isServer,
    isHost,
    isEmployee,
    isLoaded: clerkLoaded || !!authUser,
    user: effectiveUser
  }
} 