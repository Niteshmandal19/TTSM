require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const orgRoutes = require('./routes/orgRoutes')
const filterRoutes = require('./routes/filterRoutes')



const app = express();
const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your React app's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/organization', orgRoutes);
app.use('/api/filters', filterRoutes);

// Database connection and sync
const startServer = async () => {
  try {
    // Sync database models
    await sequelize.sync({ 
      // alter: true // Uncomment this in development to auto-modify tables
    });
    console.log('Database models synchronized');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
  }
};

startServer();
