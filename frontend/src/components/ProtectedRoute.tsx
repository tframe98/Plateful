import { ReactNode } from 'react'
import { useRBAC, RBACConfig } from '@/hooks/useRBAC'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  config: RBACConfig
  fallback?: ReactNode
  redirectTo?: string
}

export const ProtectedRoute = ({ 
  children, 
  config, 
  fallback = <div>Access Denied</div>,
  redirectTo = '/dashboard'
}: ProtectedRouteProps) => {
  const { canAccess, isLoaded } = useRBAC()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !canAccess(config)) {
      router.push(redirectTo)
    }
  }, [isLoaded, canAccess, config, router, redirectTo])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!canAccess(config)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// Convenience components for specific roles
export const ManagerOnly = ({ children, fallback }: { children: ReactNode, fallback?: ReactNode }) => (
  <ProtectedRoute config={{ allowedRoles: ['MANAGER'] }} fallback={fallback}>
    {children}
  </ProtectedRoute>
)

export const ChefOnly = ({ children, fallback }: { children: ReactNode, fallback?: ReactNode }) => (
  <ProtectedRoute config={{ allowedRoles: ['MANAGER', 'CHEF'] }} fallback={fallback}>
    {children}
  </ProtectedRoute>
)

export const ServerOnly = ({ children, fallback }: { children: ReactNode, fallback?: ReactNode }) => (
  <ProtectedRoute config={{ allowedRoles: ['MANAGER', 'CHEF', 'SERVER'] }} fallback={fallback}>
    {children}
  </ProtectedRoute>
)

export const HostOnly = ({ children, fallback }: { children: ReactNode, fallback?: ReactNode }) => (
  <ProtectedRoute config={{ allowedRoles: ['MANAGER', 'HOST'] }} fallback={fallback}>
    {children}
  </ProtectedRoute>
) 