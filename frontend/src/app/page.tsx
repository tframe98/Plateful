import Link from 'next/link'
import { 
  Utensils, 
  Users, 
  BarChart3, 
  Calendar, 
  ShoppingCart, 
  Settings,
  ArrowRight,
  Star,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'

export default function Home() {
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
              <button className="text-surface-600 hover:text-surface-900">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-surface-900 mb-6">
              Restaurant Management
              <span className="text-primary-600"> Made Simple</span>
            </h1>
            <p className="text-xl text-surface-600 mb-8 max-w-3xl mx-auto">
              Streamline your restaurant operations with our comprehensive management platform. 
              From orders to scheduling, everything you need in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up" className="btn-primary text-lg px-8 py-3">
                Get Started Free
                
              </Link>
              <Link href="#features" className="btn-secondary text-lg px-8 py-3">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4">
              Everything You Need to Run Your Restaurant
            </h2>
            <p className="text-xl text-surface-600 max-w-2xl mx-auto">
              Powerful tools designed specifically for restaurant owners and managers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg border border-surface-200 hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-surface-900 mb-2">{feature.title}</h3>
                <p className="text-surface-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4">
              Trusted by Restaurant Teams
            </h2>
            <p className="text-xl text-surface-600">
              See what our customers have to say
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-surface-200">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-surface-600 mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-surface-900">{testimonial.name}</p>
                  <p className="text-surface-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Restaurant?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of restaurants already using our platform to streamline their operations.
          </p>
          <Link href="/sign-up" className="btn-secondary text-lg px-8 py-3 bg-white text-primary-600 hover:bg-surface-100">
            Start Your Free Trial
            
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-surface-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Utensils className="h-8 w-8 text-primary-400" />
                <span className="ml-2 text-xl font-bold">Plateful</span>
              </div>
              <p className="text-surface-400">
                Comprehensive restaurant management platform for modern businesses.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-surface-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><Link href="/sign-up" className="hover:text-white">Sign Up</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-surface-400">
                <li><a href="#contact" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-surface-400">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>hello@plateful.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>123 Restaurant St, Food City, FC 12345</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-surface-800 mt-8 pt-8 text-center text-surface-400">
            <p>&copy; 2024 Plateful. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
