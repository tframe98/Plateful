# Restaurant SaaS Platform

A comprehensive restaurant management platform built with Next.js, Node.js, and PostgreSQL. Features include order management, team collaboration, role-based access control, and seamless employee onboarding.

## 🚀 Features

### 🔐 Authentication & Onboarding
- **Clerk Integration**: Professional authentication with email verification
- **Restaurant Onboarding**: New owners complete restaurant setup after signup
- **Role-Based Access Control**: Granular permissions for different user roles
- **Seamless Invitations**: Team members invited via email with automatic role assignment

### 👥 Team Management
- **Employee Invitations**: Send professional invitations via Clerk
- **Role Assignment**: Assign roles (Manager, Chef, Server, Host, Employee)
- **Team Dashboard**: View, edit, and manage all team members
- **Permission Management**: Control access based on user roles

### 📊 Restaurant Operations
- **Order Management**: Create and track customer orders
- **Menu Management**: Manage menu items with categories and pricing
- **Reservation System**: Handle table reservations and special requests
- **Schedule Management**: Manage employee shifts and schedules
- **Analytics Dashboard**: Track performance metrics and insights

### 🛡️ Security & Access Control
- **Role-Based Permissions**: 
  - Managers: Full access to all features
  - Chefs: Menu and order management
  - Servers: Order creation and management
  - Hosts: Reservation management
  - Employees: Basic access to assigned tasks
- **Restaurant Isolation**: Users can only access their assigned restaurant
- **Secure API Endpoints**: All endpoints protected with authentication and authorization

## 🏗️ Architecture

### Frontend (Next.js 15)
- **Framework**: Next.js with App Router
- **Styling**: Tailwind CSS with custom design system
- **Authentication**: Clerk for user management
- **State Management**: Zustand for client-side state
- **Type Safety**: TypeScript throughout

### Backend (Node.js)
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + Clerk integration
- **API**: RESTful endpoints with role-based access control

### Database Schema
- **Users**: Employee accounts with roles and restaurant associations
- **Restaurants**: Restaurant information and ownership
- **Orders**: Customer orders with items and status tracking
- **Menu Items**: Restaurant menu with pricing and categories
- **Reservations**: Table reservations and customer information
- **Shifts**: Employee work schedules
- **Analytics**: Performance metrics and reporting

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Clerk account for authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RestaurantSaaS
   ```

2. **Backend Setup**
   ```bash
   cd api
   npm install
   
   # Create .env file
   cp .env.example .env
   # Edit .env with your database and Clerk credentials
   
   # Run database migrations
   npx prisma migrate dev
   
   # Start development server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Create .env.local file
   cp .env.example .env.local
   # Edit .env.local with your Clerk credentials
   
   # Start development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 🔧 Environment Configuration

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/restaurant_saas"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3001
NODE_ENV=development
CLERK_SECRET_KEY="your_clerk_secret_key"
FRONTEND_URL="http://localhost:3000"
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📋 User Roles & Permissions

### Manager
- Full access to all features
- Team management and invitations
- Analytics and reporting
- Menu and order management
- Schedule management

### Chef
- Menu item creation and editing
- Order management and status updates
- View team schedules

### Server
- Order creation and management
- Customer service features
- View assigned shifts

### Host
- Reservation management
- Customer service features
- View assigned shifts

### Employee
- Basic access to assigned tasks
- View personal schedule
- Limited order access

## 🔄 User Flow

### Restaurant Owner Onboarding
1. User signs up via Clerk
2. Redirected to onboarding page
3. Enters restaurant information
4. Restaurant record created in database
5. User associated as restaurant owner
6. Redirected to dashboard

### Team Member Invitation
1. Manager invites employee via team management
2. Clerk sends professional invitation email
3. Employee clicks invitation link
4. Employee completes signup
5. Automatically associated with restaurant and role
6. Employee can access appropriate features

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Backend tests
cd api
npm test

# Frontend tests
cd frontend
npm test
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /onboarding` - Restaurant onboarding

### Team Management
- `GET /team` - Get team members
- `POST /team/invite` - Invite new member
- `PUT /team/:userId` - Update member role
- `DELETE /team/:userId` - Remove member

### Restaurant Operations
- `GET /orders` - Get orders
- `POST /orders` - Create order
- `GET /menu` - Get menu items
- `POST /menu` - Create menu item
- `GET /reservations` - Get reservations
- `POST /reservations` - Create reservation

## 🚀 Deployment

### Production Setup
1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Deploy backend to your hosting platform
5. Deploy frontend to Vercel/Netlify
6. Configure Clerk for production

### Environment Variables
Ensure all production environment variables are set:
- Database connection string
- Clerk API keys
- JWT secret
- Frontend URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the test plan for implementation details 