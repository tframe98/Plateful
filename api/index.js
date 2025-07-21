const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const { verifyToken, clerkClient } = require('@clerk/clerk-sdk-node');

// Load environment variables
dotenv.config();
console.log('CLERK_SECRET_KEY:', process.env.CLERK_SECRET_KEY);
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Debug logs
  console.log('Authorization header:', authHeader);
  console.log('Token:', token);

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'Access token required' });
  }

  // Try Clerk JWT first (only if CLERK_SECRET_KEY is set)
  if (process.env.CLERK_SECRET_KEY) {
    try {
      const payload = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
      
      // Get user from database to include restaurant context
      const user = await prisma.user.findUnique({
        where: { email: payload.email },
        include: { 
          restaurant: true,
          ownedRestaurants: true
        }
      });

      req.user = {
        userId: user?.id || payload.sub,
        email: payload.email,
        role: user?.role || payload.publicMetadata?.role || payload.unsafeMetadata?.role || 'EMPLOYEE',
        restaurantId: user?.restaurantId,
        restaurant: user?.restaurant,
        ownedRestaurants: user?.ownedRestaurants || [],
      };
      console.log('Authenticated user (Clerk):', req.user);
      return next();
    } catch (clerkError) {
      console.error('Clerk JWT verification failed:', clerkError);
      // Fall through to legacy JWT
    }
  }
  
  // Fallback to legacy JWT
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database to include restaurant context
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { 
        restaurant: true,
        ownedRestaurants: true
      }
    });

    req.user = {
      ...decoded,
      restaurantId: user?.restaurantId,
      restaurant: user?.restaurant,
      ownedRestaurants: user?.ownedRestaurants || [],
    };
    console.log('Authenticated user (Legacy):', req.user);
    return next();
  } catch (error) {
    console.error('Legacy JWT verification failed:', error);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Role-based access control helper
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

// Restaurant access control helper
const requireRestaurantAccess = () => {
  return (req, res, next) => {
    if (!req.user.restaurantId) {
      return res.status(403).json({ error: 'Restaurant access required' });
    }

    next();
  };
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Auth routes
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const bcrypt = require('bcryptjs');
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || 'EMPLOYEE'
      }
    });

    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Orders endpoints with RBAC
app.get('/orders', authenticateToken, requireRestaurantAccess(), async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.userId },
      include: {
        orderItems: {
          include: {
            menuItem: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/orders', authenticateToken, requireRole(['MANAGER', 'CHEF', 'SERVER']), requireRestaurantAccess(), async (req, res) => {
  try {
    const { customerName, customerPhone, customerEmail, orderItems, notes, source } = req.body;
    
    // Calculate totals
    let totalAmount = 0;
    let taxAmount = 0;
    
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerPhone,
        customerEmail,
        totalAmount: 0, // Will be calculated
        taxAmount: 0, // Will be calculated
        notes,
        source,
        userId: req.user.userId
      }
    });

    // Create order items and calculate totals
    for (const item of orderItems) {
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: item.menuItemId }
      });

      if (!menuItem) {
        throw new Error(`MenuItem ${item.menuItemId} not found`);
      }

      const totalPrice = menuItem.price * item.quantity;
      totalAmount += totalPrice;

      await prisma.orderItem.create({
        data: {
          quantity: item.quantity,
          unitPrice: menuItem.price,
          totalPrice,
          notes: item.notes,
          orderId: order.id,
          menuItemId: item.menuItemId
        }
      });
    }

    // Calculate tax (example: 8.5%)
    taxAmount = totalAmount * 0.085;

    // Update order with calculated totals
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        totalAmount,
        taxAmount
      },
      include: {
        orderItems: {
          include: {
            menuItem: true
          }
        }
      }
    });

    res.status(201).json(updatedOrder);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/orders/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        orderItems: {
          include: {
            menuItem: true
          }
        }
      }
    });

    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Menu endpoints with RBAC
app.get('/menu', authenticateToken, requireRestaurantAccess(), async (req, res) => {
  try {
    const menuItems = await prisma.menuItem.findMany({
      orderBy: { category: 'asc' }
    });

    res.json(menuItems);
  } catch (error) {
    console.error('Get menu error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/menu', authenticateToken, requireRole(['MANAGER', 'CHEF']), requireRestaurantAccess(), async (req, res) => {
  try {
    const { name, description, price, category, isAvailable, imageUrl, allergens, nutrition } = req.body;
    
    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        isAvailable: isAvailable !== undefined ? isAvailable : true,
        imageUrl,
        allergens: allergens ? JSON.parse(JSON.stringify(allergens)) : null,
        nutrition: nutrition ? JSON.parse(JSON.stringify(nutrition)) : null
      }
    });

    res.status(201).json(menuItem);
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/menu/:id', authenticateToken, requireRole(['MANAGER', 'CHEF']), requireRestaurantAccess(), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, isAvailable, imageUrl, allergens, nutrition } = req.body;
    
    const menuItem = await prisma.menuItem.update({
      where: { id },
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        isAvailable,
        imageUrl,
        allergens: allergens ? JSON.parse(JSON.stringify(allergens)) : null,
        nutrition: nutrition ? JSON.parse(JSON.stringify(nutrition)) : null
      }
    });

    res.json(menuItem);
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/menu/:id', authenticateToken, requireRole(['MANAGER']), requireRestaurantAccess(), async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.menuItem.delete({
      where: { id }
    });

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Campaigns endpoints with RBAC
app.get('/campaigns', authenticateToken, requireRole(['MANAGER']), requireRestaurantAccess(), async (req, res) => {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json(campaigns);
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/campaigns', authenticateToken, requireRole(['MANAGER']), requireRestaurantAccess(), async (req, res) => {
  try {
    const { name, description, startDate, endDate, discountType, discountValue, minimumOrder, targetAudience } = req.body;

    const campaign = await prisma.campaign.create({
      data: {
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        discountType,
        discountValue,
        minimumOrder,
        targetAudience
      }
    });

    res.status(201).json(campaign);
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Analytics endpoints with RBAC
app.get('/analytics', authenticateToken, requireRole(['MANAGER']), requireRestaurantAccess(), async (req, res) => {
  try {
    // Get analytics data for the restaurant
    const analytics = await prisma.analyticsSnapshot.findMany({
      where: { userId: req.user.userId },
      orderBy: { date: 'desc' },
      take: 30 // Last 30 days
    });

    res.json(analytics);
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Webhook endpoints for third-party integrations
app.post('/webhook/ubereats', (req, res) => {
  // Handle UberEats webhook
  console.log('UberEats webhook received:', req.body);
  res.status(200).json({ status: 'received' });
});

app.post('/webhook/doordash', (req, res) => {
  // Handle DoorDash webhook
  console.log('DoorDash webhook received:', req.body);
  res.status(200).json({ status: 'received' });
});

// Onboarding endpoint
app.post('/onboarding', async (req, res) => {
  try {
    const { restaurantName, restaurantAddress, restaurantPhone, role, userId, email, firstName, lastName } = req.body;
    
    if (!restaurantName || !userId || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create restaurant
    const restaurant = await prisma.restaurant.create({
      data: {
        name: restaurantName,
        address: restaurantAddress,
        phone: restaurantPhone,
        ownerId: userId
      }
    });

    // Create or update user in our database
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        role: role || 'MANAGER',
        restaurantId: restaurant.id,
        firstName: firstName || '',
        lastName: lastName || ''
      },
      create: {
        email,
        password: 'temp-password', // Will be updated when user sets password
        firstName: firstName || '',
        lastName: lastName || '',
        role: role || 'MANAGER',
        restaurantId: restaurant.id
      }
    });

    res.status(201).json({
      restaurant,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        restaurantId: user.restaurantId
      }
    });
  } catch (error) {
    console.error('Onboarding error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle invitation acceptance
app.post('/invitation/accept', async (req, res) => {
  try {
    const { invitationId, userId, email, firstName, lastName } = req.body;
    
    if (!invitationId || !userId || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get the invitation details from Clerk
    const invitation = await clerkClient.invitations.getInvitation({
      invitationId: invitationId,
    });

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    const { role, restaurantId } = invitation.publicMetadata;

    // Update the user record in our database
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        firstName: firstName || '',
        lastName: lastName || '',
        role: role || 'EMPLOYEE',
        restaurantId: restaurantId,
        isActive: true,
        password: 'clerk-authenticated' // User will authenticate through Clerk
      }
    });

    res.json({
      message: 'Invitation accepted successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
        restaurantId: updatedUser.restaurantId
      }
    });
  } catch (error) {
    console.error('Accept invitation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Team management endpoints
app.get('/team', authenticateToken, requireRestaurantAccess(), async (req, res) => {
  try {
    const teamMembers = await prisma.user.findMany({
      where: { restaurantId: req.user.restaurantId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json(teamMembers);
  } catch (error) {
    console.error('Get team members error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/team/invite', authenticateToken, requireRole(['MANAGER']), requireRestaurantAccess(), async (req, res) => {
  try {
    const { email, role } = req.body;
    
    if (!email || !role) {
      return res.status(400).json({ error: 'Email and role are required' });
    }

    // Check if user already exists in this restaurant
    const existingUser = await prisma.user.findFirst({
      where: { 
        email,
        restaurantId: req.user.restaurantId
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User is already a member of this restaurant' });
    }

    // Create Clerk invitation
    const invitation = await clerkClient.invitations.createInvitation({
      emailAddress: email,
      publicMetadata: {
        role: role,
        restaurantId: req.user.restaurantId,
        invitedBy: req.user.userId
      },
      redirectUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/sign-up?invitation=${encodeURIComponent(email)}`,
    });

    // Create placeholder user record in our database
    const invitedUser = await prisma.user.create({
      data: {
        email,
        password: 'invitation-pending',
        firstName: '',
        lastName: '',
        role,
        restaurantId: req.user.restaurantId,
        isActive: false
      }
    });

    res.status(201).json({
      message: 'Invitation sent successfully',
      invitationId: invitation.id,
      userId: invitedUser.id
    });
  } catch (error) {
    console.error('Invite team member error:', error);
    
    // Handle specific Clerk errors
    if (error.errors && error.errors.length > 0) {
      const clerkError = error.errors[0];
      if (clerkError.code === 'form_identifier_exists') {
        return res.status(400).json({ error: 'User with this email already exists' });
      }
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/team/:userId', authenticateToken, requireRole(['MANAGER']), requireRestaurantAccess(), async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ error: 'Role is required' });
    }

    const updatedUser = await prisma.user.update({
      where: { 
        id: userId,
        restaurantId: req.user.restaurantId // Ensure user belongs to same restaurant
      },
      data: { role }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Update team member error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/team/:userId', authenticateToken, requireRole(['MANAGER']), requireRestaurantAccess(), async (req, res) => {
  try {
    const { userId } = req.params;

    // Don't allow removing yourself
    if (userId === req.user.userId) {
      return res.status(400).json({ error: 'Cannot remove yourself from the team' });
    }

    await prisma.user.delete({
      where: { 
        id: userId,
        restaurantId: req.user.restaurantId // Ensure user belongs to same restaurant
      }
    });

    res.json({ message: 'Team member removed successfully' });
  } catch (error) {
    console.error('Remove team member error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Shifts endpoints with RBAC
app.get('/shifts', authenticateToken, requireRestaurantAccess(), async (req, res) => {
  try {
    const shifts = await prisma.shift.findMany({
      where: { userId: req.user.userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { startTime: 'desc' }
    });

    res.json(shifts);
  } catch (error) {
    console.error('Get shifts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/shifts', authenticateToken, requireRole(['MANAGER']), requireRestaurantAccess(), async (req, res) => {
  try {
    const { startTime, endTime, userId, notes } = req.body;

    const shift = await prisma.shift.create({
      data: {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        userId,
        notes
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.status(201).json(shift);
  } catch (error) {
    console.error('Create shift error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reservations endpoints with RBAC
app.get('/reservations', authenticateToken, requireRestaurantAccess(), async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      where: { userId: req.user.userId },
      orderBy: { reservationTime: 'asc' }
    });

    res.json(reservations);
  } catch (error) {
    console.error('Get reservations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/reservations', authenticateToken, requireRole(['MANAGER', 'HOST']), requireRestaurantAccess(), async (req, res) => {
  try {
    const { customerName, customerPhone, customerEmail, partySize, reservationTime, specialRequests } = req.body;

    const reservation = await prisma.reservation.create({
      data: {
        customerName,
        customerPhone,
        customerEmail,
        partySize,
        reservationTime: new Date(reservationTime),
        specialRequests,
        userId: req.user.userId
      }
    });

    res.status(201).json(reservation);
  } catch (error) {
    console.error('Create reservation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
}); 