const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const payload = {
  userId: 'demo-user-id',
  email: 'manager@restaurant.com',
  role: 'MANAGER'
};

const secret = process.env.JWT_SECRET;
if (!secret) {
  console.error('JWT_SECRET not set in .env');
  process.exit(1);
}

const token = jwt.sign(payload, secret, { expiresIn: '24h' });
console.log('Generated demo manager token:');
console.log(token); 