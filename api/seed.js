const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const { faker } = require('@faker-js/faker')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding with Faker...')

  // Create demo users with password 'password'
  const hashedPassword = await bcrypt.hash('password', 10)
  
  const manager = await prisma.user.upsert({
    where: { email: 'manager@restaurant.com' },
    update: { password: hashedPassword },
    create: {
      email: 'manager@restaurant.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Manager',
      role: 'MANAGER',
      phone: faker.phone.number(),
      address: faker.location.streetAddress()
    }
  })

  const chef = await prisma.user.upsert({
    where: { email: 'chef@restaurant.com' },
    update: { password: hashedPassword },
    create: {
      email: 'chef@restaurant.com',
      password: hashedPassword,
      firstName: 'Charlie',
      lastName: 'Chef',
      role: 'CHEF',
      phone: faker.phone.number(),
      address: faker.location.streetAddress()
    }
  })

  const server = await prisma.user.upsert({
    where: { email: 'server@restaurant.com' },
    update: { password: hashedPassword },
    create: {
      email: 'server@restaurant.com',
      password: hashedPassword,
      firstName: 'Sally',
      lastName: 'Server',
      role: 'SERVER',
      phone: faker.phone.number(),
      address: faker.location.streetAddress()
    }
  })

  const host = await prisma.user.upsert({
    where: { email: 'host@restaurant.com' },
    update: { password: hashedPassword },
    create: {
      email: 'host@restaurant.com',
      password: hashedPassword,
      firstName: 'Hank',
      lastName: 'Host',
      role: 'HOST',
      phone: faker.phone.number(),
      address: faker.location.streetAddress()
    }
  })

  const employee = await prisma.user.upsert({
    where: { email: 'employee@restaurant.com' },
    update: { password: hashedPassword },
    create: {
      email: 'employee@restaurant.com',
      password: hashedPassword,
      firstName: 'Jane',
      lastName: 'Employee',
      role: 'EMPLOYEE',
      phone: faker.phone.number(),
      address: faker.location.streetAddress()
    }
  })

  // Generate realistic menu items
  const menuCategories = ['Appetizers', 'Salads', 'Pizza', 'Pasta', 'Main Course', 'Desserts', 'Beverages']
  const menuItems = []
  
  for (let i = 0; i < 25; i++) {
    const category = faker.helpers.arrayElement(menuCategories)
    const price = parseFloat(faker.commerce.price({ min: 8, max: 45 }))
    
    const menuItem = await prisma.menuItem.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: price,
        category: category,
        isAvailable: faker.datatype.boolean({ probability: 0.9 }),
        imageUrl: faker.image.urlLoremFlickr({ category: 'food' }),
        allergens: faker.helpers.arrayElements(['dairy', 'gluten', 'nuts', 'eggs', 'soy', 'shellfish'], { min: 0, max: 3 }),
        nutrition: {
          calories: faker.number.int({ min: 150, max: 800 }),
          protein: faker.number.int({ min: 5, max: 40 }),
          carbs: faker.number.int({ min: 10, max: 80 }),
          fat: faker.number.int({ min: 5, max: 35 })
        }
      }
    })
    menuItems.push(menuItem)
  }

  // Generate realistic orders
  const orderStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED']
  const orderSources = ['POS', 'UberEats', 'DoorDash', 'GrubHub', 'Phone']
  const users = [manager, chef, server, host, employee]
  
  for (let i = 0; i < 50; i++) {
    const orderDate = faker.date.recent({ days: 30 })
    const customerName = faker.person.fullName()
    const customerPhone = faker.phone.number()
    const customerEmail = faker.internet.email()
    const status = faker.helpers.arrayElement(orderStatuses)
    const source = faker.helpers.arrayElement(orderSources)
    const user = faker.helpers.arrayElement(users)
    
    // Generate 1-5 order items per order
    const numItems = faker.number.int({ min: 1, max: 5 })
    const orderItems = []
    let totalAmount = 0
    
    for (let j = 0; j < numItems; j++) {
      const menuItem = faker.helpers.arrayElement(menuItems)
      const quantity = faker.number.int({ min: 1, max: 3 })
      const unitPrice = parseFloat(menuItem.price)
      const totalPrice = unitPrice * quantity
      totalAmount += totalPrice
      
      orderItems.push({
        quantity: quantity,
        unitPrice: unitPrice,
        totalPrice: totalPrice,
        notes: faker.datatype.boolean({ probability: 0.3 }) ? faker.lorem.sentence() : null,
        menuItemId: menuItem.id
      })
    }
    
    const taxAmount = totalAmount * 0.085 // 8.5% tax
    const tipAmount = faker.datatype.boolean({ probability: 0.7 }) ? parseFloat(faker.commerce.price({ min: 2, max: 10 })) : null
    
    await prisma.order.create({
      data: {
        orderNumber: `ORD-${faker.date.recent({ days: 30 }).getTime()}-${faker.string.alphanumeric(6).toUpperCase()}`,
        customerName: customerName,
        customerPhone: customerPhone,
        customerEmail: customerEmail,
        status: status,
        totalAmount: totalAmount,
        taxAmount: taxAmount,
        tipAmount: tipAmount,
        deliveryAddress: source !== 'POS' ? faker.location.streetAddress() : null,
        deliveryFee: source !== 'POS' ? parseFloat(faker.commerce.price({ min: 2, max: 5 })) : null,
        notes: faker.datatype.boolean({ probability: 0.4 }) ? faker.lorem.sentence() : null,
        source: source,
        externalOrderId: source !== 'POS' ? `${source.substring(0, 2).toUpperCase()}-${faker.string.alphanumeric(8)}` : null,
        userId: user.id,
        orderItems: {
          create: orderItems
        }
      }
    })
  }

  // Generate realistic shifts
  for (let i = 0; i < 30; i++) {
    const startTime = faker.date.recent({ days: 14 })
    const endTime = new Date(startTime.getTime() + faker.number.int({ min: 4, max: 12 }) * 60 * 60 * 1000)
    const status = faker.helpers.arrayElement(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
    const user = faker.helpers.arrayElement(users)
    
    await prisma.shift.create({
      data: {
        startTime: startTime,
        endTime: endTime,
        status: status,
        notes: faker.datatype.boolean({ probability: 0.3 }) ? faker.lorem.sentence() : null,
        userId: user.id
      }
    })
  }

  // Generate realistic reservations
  for (let i = 0; i < 20; i++) {
    const reservationTime = faker.date.soon({ days: 30 })
    const customerName = faker.person.fullName()
    const customerPhone = faker.phone.number()
    const customerEmail = faker.internet.email()
    const partySize = faker.number.int({ min: 2, max: 8 })
    const status = faker.helpers.arrayElement(['CONFIRMED', 'SEATED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'])
    const user = faker.helpers.arrayElement(users)
    
    await prisma.reservation.create({
      data: {
        customerName: customerName,
        customerPhone: customerPhone,
        customerEmail: customerEmail,
        partySize: partySize,
        reservationTime: reservationTime,
        status: status,
        specialRequests: faker.datatype.boolean({ probability: 0.4 }) ? faker.lorem.sentence() : null,
        tableNumber: faker.helpers.arrayElement(['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3']),
        userId: user.id
      }
    })
  }

  // Generate realistic campaigns
  const campaignTypes = ['Holiday Special', 'Lunch Deal', 'Dinner Special', 'Weekend Brunch', 'Happy Hour']
  
  for (let i = 0; i < 8; i++) {
    const startDate = faker.date.recent({ days: 60 })
    const endDate = faker.date.soon({ days: 90 })
    const discountType = faker.helpers.arrayElement(['PERCENTAGE', 'FIXED'])
    const discountValue = discountType === 'PERCENTAGE' ? faker.number.int({ min: 10, max: 30 }) : parseFloat(faker.commerce.price({ min: 5, max: 15 }))
    
    await prisma.campaign.create({
      data: {
        name: `${faker.helpers.arrayElement(campaignTypes)} - ${faker.commerce.productName()}`,
        description: faker.commerce.productDescription(),
        startDate: startDate,
        endDate: endDate,
        status: faker.helpers.arrayElement(['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED']),
        discountType: discountType,
        discountValue: discountValue,
        minimumOrder: parseFloat(faker.commerce.price({ min: 15, max: 50 })),
        targetAudience: faker.helpers.arrayElement(['ALL', 'LOYALTY_MEMBERS', 'NEW_CUSTOMERS'])
      }
    })
  }

  // Generate loyalty tiers
  const loyaltyTiers = await Promise.all([
    prisma.loyaltyTier.create({
      data: {
        name: 'Bronze',
        level: 'BRONZE',
        pointsRequired: 0,
        benefits: ['Free birthday dessert', 'Monthly newsletter'],
        discountPercentage: 5.0
      }
    }),
    prisma.loyaltyTier.create({
      data: {
        name: 'Silver',
        level: 'SILVER',
        pointsRequired: 100,
        benefits: ['Free birthday dessert', 'Monthly newsletter', 'Priority reservations'],
        discountPercentage: 10.0
      }
    }),
    prisma.loyaltyTier.create({
      data: {
        name: 'Gold',
        level: 'GOLD',
        pointsRequired: 500,
        benefits: ['Free birthday dessert', 'Monthly newsletter', 'Priority reservations', 'Free appetizer'],
        discountPercentage: 15.0
      }
    })
  ])

  console.log('✅ Database seeded successfully with Faker!')
  console.log(`👥 Created ${5} users`)
  console.log(`🍕 Created ${menuItems.length} menu items`)
  console.log(`📋 Created ${50} orders`)
  console.log(`⏰ Created ${30} shifts`)
  console.log(`📅 Created ${20} reservations`)
  console.log(`🎯 Created ${8} campaigns`)
  console.log(`🏆 Created ${loyaltyTiers.length} loyalty tiers`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 