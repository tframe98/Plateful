import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth-storage')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    role?: 'MANAGER' | 'EMPLOYEE'
  }) => api.post('/auth/register', userData),
}

// Orders API (now requires token)
export const ordersAPI = {
  getAll: (token?: string) => api.get('/orders', { 
    headers: token ? { Authorization: `Bearer ${token}` } : {} 
  }),
  create: (orderData: any, token?: string) => api.post('/orders', orderData, { 
    headers: token ? { Authorization: `Bearer ${token}` } : {} 
  }),
  updateStatus: (id: string, status: string, token?: string) =>
    api.put(`/orders/${id}/status`, { status }, { 
      headers: token ? { Authorization: `Bearer ${token}` } : {} 
    }),
}

// Menu API
export const menuAPI = {
  getAll: (token?: string) => api.get('/menu', { 
    headers: token ? { Authorization: `Bearer ${token}` } : {} 
  }),
  create: (menuItemData: any, token?: string) => api.post('/menu', menuItemData, { 
    headers: token ? { Authorization: `Bearer ${token}` } : {} 
  }),
  update: (id: string, menuItemData: any, token?: string) =>
    api.put(`/menu/${id}`, menuItemData, { 
      headers: token ? { Authorization: `Bearer ${token}` } : {} 
    }),
  delete: (id: string, token?: string) =>
    api.delete(`/menu/${id}`, { 
      headers: token ? { Authorization: `Bearer ${token}` } : {} 
    }),
}

// Shifts API
export const shiftsAPI = {
  getAll: (token?: string) => api.get('/shifts', { 
    headers: token ? { Authorization: `Bearer ${token}` } : {} 
  }),
  create: (shiftData: any, token?: string) => api.post('/shifts', shiftData, { 
    headers: token ? { Authorization: `Bearer ${token}` } : {} 
  }),
}

// Reservations API
export const reservationsAPI = {
  getAll: (token?: string) => api.get('/reservations', { 
    headers: token ? { Authorization: `Bearer ${token}` } : {} 
  }),
  create: (reservationData: any, token?: string) => api.post('/reservations', reservationData, { 
    headers: token ? { Authorization: `Bearer ${token}` } : {} 
  }),
}

// Campaigns API
export const campaignsAPI = {
  getAll: (token?: string) => api.get('/campaigns', { 
    headers: token ? { Authorization: `Bearer ${token}` } : {} 
  }),
  create: (campaignData: any, token?: string) => api.post('/campaigns', campaignData, { 
    headers: token ? { Authorization: `Bearer ${token}` } : {} 
  }),
}

// Analytics API
export const analyticsAPI = {
  getAnalytics: (startDate?: string, endDate?: string, token?: string) =>
    api.get('/analytics', { 
      params: { startDate, endDate }, 
      headers: token ? { Authorization: `Bearer ${token}` } : {} 
    }),
}

export default api 