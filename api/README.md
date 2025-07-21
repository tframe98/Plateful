# Restaurant SaaS Backend API

A comprehensive Node.js backend for restaurant management with Express, Prisma, and PostgreSQL.

## Features

- 🔐 JWT-based authentication
- 📊 Order management with real-time status updates
- 👥 Employee scheduling and shift management
- 📅 Reservation system
- 🎯 Marketing campaigns and loyalty programs
- 📈 Analytics and reporting
- 🔗 Third-party integrations (UberEats, DoorDash)
- 🗄️ PostgreSQL database with Prisma ORM

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Validation**: Built-in Express validation

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone and navigate to the API directory**
   ```bash
   cd api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the `api` directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/restaurant_saas"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   PORT=3001
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev --name init
   
   # (Optional) Seed the database
   npx prisma db seed
   ```

5. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication

- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Orders

- `GET /orders` - Get all orders
- `POST /orders` - Create new order
- `PUT /orders/:id/status` - Update order status

### Shifts

- `GET /shifts` - Get all shifts
- `POST /shifts` - Create new shift

### Reservations

- `GET /reservations` - Get all reservations
- `POST /reservations` - Create new reservation

### Campaigns

- `GET /campaigns` - Get all campaigns
- `POST /campaigns` - Create new campaign

### Analytics

- `GET /analytics` - Get analytics data

### Webhooks

- `POST /webhook/ubereats` - UberEats integration
- `POST /webhook/doordash` - DoorDash integration

## Database Schema

The application includes the following main entities:

- **User**: Employees and managers with role-based access
- **Order**: Customer orders with items and status tracking
- **MenuItem**: Restaurant menu items with pricing
- **Shift**: Employee work schedules
- **Reservation**: Table reservations
- **Campaign**: Marketing campaigns and promotions
- **AnalyticsSnapshot**: Performance metrics

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Development

### Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npx prisma studio` - Open Prisma Studio for database management
- `npx prisma migrate dev` - Run database migrations
- `npx prisma generate` - Generate Prisma client

### Testing

Test the API endpoints using tools like:
- Postman
- Insomnia
- curl

Example health check:
```bash
curl http://localhost:3001/health
```

## Deployment

1. Set up a PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Start the server with `npm start`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License 