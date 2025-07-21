import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Restaurant {
  id: string
  name: string
  address?: string
  phone?: string
}

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'MANAGER' | 'CHEF' | 'SERVER' | 'HOST' | 'EMPLOYEE'
  restaurantId?: string
  restaurant?: Restaurant
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
  setRestaurant: (restaurant: Restaurant) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user: User) =>
        set({
          user,
          token: 'mock-token', // For demo purposes
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
      updateUser: (userData: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
      setRestaurant: (restaurant: Restaurant) =>
        set((state) => ({
          user: state.user ? { ...state.user, restaurant } : null,
        })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
) 