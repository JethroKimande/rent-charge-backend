const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const authRoutes = require('./routes/auth');
const tenantRoutes = require('./routes/tenants');
const invoiceRoutes = require('./routes/invoices');
const receiptRoutes = require('./routes/receipts');
const userRoutes = require('./routes/users');

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Create default admin user
const createDefaultAdmin = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      const defaultAdmin = new User({
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
      });
      await defaultAdmin.save();
      console.log('Default admin user created: admin / Admin123!');
    }
  } catch (err) {
    console.error('Error creating default admin:', err);
  }
};

createDefaultAdmin();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/tenants', tenantRoutes);
app.use('/invoices', invoiceRoutes);
app.use('/receipts', receiptRoutes);
app.use('/users', userRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', message: 'Internal server error' });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));