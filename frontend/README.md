# Restaurant SaaS Frontend

A modern Next.js frontend for restaurant management with beautiful UI and comprehensive features.

## Features

- 🎨 Modern, responsive design with Tailwind CSS
- 🔐 JWT-based authentication with Clerk
- 📊 Real-time dashboard with analytics
- 📋 Order management with status tracking
- 👥 Employee scheduling and shift management
- 📅 Reservation system
- 🎯 Marketing campaigns
- 📈 Analytics and reporting
- 📱 Mobile-responsive interface

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Authentication**: Clerk
- **Icons**: Lucide React
- **Data Fetching**: React Query (TanStack Query)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see backend README)

### Installation

1. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the `frontend` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard pages
│   │   ├── orders/       # Order management
│   │   ├── schedule/     # Employee scheduling
│   │   ├── crm/          # Customer management
│   │   └── hr/           # Human resources
│   ├── login/            # Authentication pages
│   └── layout.tsx        # Root layout
├── components/           # Reusable components
│   └── DashboardLayout.tsx
├── lib/                  # Utility functions and API
│   └── api.ts
├── store/               # State management
│   └── auth.ts
└── styles/              # Global styles
```

## Key Components

### DashboardLayout
The main layout component that provides:
- Responsive sidebar navigation
- User authentication status
- Mobile-friendly design
- Consistent styling across pages

### Authentication
- JWT-based authentication with Clerk
- Protected routes
- Automatic token refresh
- User role management

### API Integration
- Centralized API client with Axios
- Automatic token injection
- Error handling and retry logic
- TypeScript interfaces for all API responses

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Features Overview

### Dashboard
- Overview statistics (orders, revenue, customers)
- Recent orders table
- Quick action cards
- Real-time updates

### Orders Management
- Order listing with search and filters
- Status updates (pending, confirmed, preparing, ready, delivered)
- Order details with items and pricing
- Source tracking (POS, UberEats, DoorDash)

### Employee Scheduling
- Shift management
- Schedule requests
- Employee availability
- Calendar view

### Customer Management (CRM)
- Customer profiles
- Reservation management
- Loyalty programs
- Communication history

### Analytics
- Sales reports
- Customer insights
- Performance metrics
- Export functionality

## Styling

The application uses Tailwind CSS for styling with:
- Consistent color scheme
- Responsive design patterns
- Modern UI components
- Accessibility features

## State Management

Zustand is used for global state management:
- Authentication state
- User preferences
- Application settings
- Persistent storage

## API Integration

The frontend communicates with the backend API through:
- RESTful endpoints
- JWT authentication
- Real-time updates
- Error handling

## Development

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Consistent naming conventions

### Testing
- Component testing with Jest
- API mocking
- User interaction testing
- Accessibility testing

## Deployment

### Build Process
1. Install dependencies: `npm install`
2. Build the application: `npm run build`
3. Start production server: `npm start`

### Environment Variables
Ensure all required environment variables are set:
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License
