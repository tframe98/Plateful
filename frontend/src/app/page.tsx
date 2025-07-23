'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Utensils, 
  Users, 
  BarChart3, 
  Calendar, 
  ShoppingCart, 
  Settings,
  ArrowRight,
  Check,
  Star,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    console.log('Landing page loaded!')
    // alert('Landing page loaded!')
  }, [])

  const features = [
    {
      icon: ShoppingCart,
      title: 'Unified Order Management',
      description: 'Manage orders from POS, UberEats, and DoorDash in one place'
    },
    {
      icon: Calendar,
      title: 'Staff Scheduling',
      description: 'Drag-and-drop calendar for easy shift management'
    },
    {
      icon: Users,
      title: 'Customer CRM',
      description: 'Loyalty programs, birthday rewards, and customer insights'
    },
    {
      icon: Utensils,
      title: 'Digital Menu Management',
      description: 'Update menu items, pricing, and availability instantly'
    },
    {
      icon: Settings,
      title: 'HR Tools',
      description: 'Employee onboarding, performance tracking, and role management'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Real-time insights into sales, performance, and trends'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Restaurant Manager',
      content: 'This platform has transformed how we manage our restaurant. Everything is in one place!',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Head Chef',
      content: 'The menu management and order tracking features are incredible. Highly recommended!',
      rating: 5
    },
    {
      name: 'Emily Davis',
      role: 'Server',
      content: 'The scheduling system makes it so easy to manage my shifts and request time off.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-red-600">LANDING PAGE IS WORKING!</h1>
        <p className="text-xl mt-4">If you can see this, the routing is working!</p>
      </div>
      
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Utensils className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-surface-900">Plateful</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-surface-600 hover:text-surface-900">Features</a>
              <a href="#pricing" className="text-surface-600 hover:text-surface-900">Pricing</a>
              <a href="#contact" className="text-surface-600 hover:text-surface-900">Contact</a>
              <Link href="/sign-in" className="btn-primary">
                Sign In
              </Link>
              <Link href="/sign-up" className="btn-secondary">
                Sign Up
              </Link>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-surface-600 hover:text-surface-900"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-surface-200">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-surface-600 hover:text-surface-900">Features</a>
                <a href="#pricing" className="text-surface-600 hover:text-surface-900">Pricing</a>
                <a href="#contact" className="text-surface-600 hover:text-surface-900">Contact</a>
                <Link href="/login" className="btn-primary w-full text-center">
                  Sign In
                </Link>
                <Link href="/sign-up" className="btn-secondary w-full text-center">
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-accent-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-surface-900 mb-6">
              Streamline Your
              <span className="text-primary-600"> Restaurant</span>
              <br />
              Operations
            </h1>
            <p className="text-xl text-surface-600 mb-8 max-w-3xl mx-auto">
              All-in-one restaurant management platform. Handle orders, staff, customers, and analytics from one powerful dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up" className="btn-primary text-lg px-8 py-4">
                Get Started For Free 
              </Link>
              
              <button className="btn-secondary text-lg px-8 py-4">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4">
              Everything You Need to Run Your Restaurant
            </h2>
            <p className="text-xl text-surface-600 max-w-3xl mx-auto">
              From order management to staff scheduling, we've got you covered with powerful tools designed specifically for restaurants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-8 text-center hover:shadow-medium transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-surface-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-surface-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-primary-100">Restaurants</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">50K+</div>
              <div className="text-primary-100">Orders Processed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">99.9%</div>
              <div className="text-primary-100">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">4.8/5</div>
              <div className="text-primary-100">Customer Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4">
              Loved by Restaurant Owners
            </h2>
            <p className="text-xl text-surface-600">
              See what our customers have to say about Restaurant SaaS
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card p-8">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-warning-400 fill-current" />
                  ))}
                </div>
                <p className="text-surface-600 mb-6">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-surface-900">{testimonial.name}</div>
                  <div className="text-sm text-surface-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Restaurant?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of restaurants already using our platform to streamline their operations and boost profits.
          </p>
          <Link href="/sign-up" className="bg-white text-primary-600 hover:bg-surface-50 font-semibold py-4 px-8 rounded-lg inline-flex items-center transition-colors">
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-surface-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Utensils className="h-8 w-8 text-primary-400" />
                <span className="ml-2 text-xl font-bold">Restaurant SaaS</span>
              </div>
              <p className="text-surface-300 mb-4">
                The complete restaurant management solution for modern businesses.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-surface-400 hover:text-white">
                  <Phone className="h-5 w-5" />
                </a>
                <a href="#" className="text-surface-400 hover:text-white">
                  <Mail className="h-5 w-5" />
                </a>
                <a href="#" className="text-surface-400 hover:text-white">
                  <MapPin className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-surface-300">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-surface-300">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-surface-300">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-surface-800 mt-12 pt-8 text-center text-surface-400">
            <p>&copy; 2024 Restaurant SaaS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
