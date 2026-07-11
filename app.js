const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const { setUserLocals } = require('./middleware/auth');
const indexRoutes = require('./routes/indexRoutes');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ac_repair_db';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✔ Connected to MongoDB successfully.'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Set up View Engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'ac-session-fallback-secret-999!',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    secure: false // Set to true in production if HTTPS is active
  }
}));

// Set User context for templates
app.use(setUserLocals);

// Route mapping
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/bookings', bookingRoutes);
app.use('/admin', adminRoutes);

// Error page handling for undefined routes
app.use((req, res) => {
  res.status(404).render('error', { 
    title: '404 - Page Not Found', 
    message: 'The page you are looking for does not exist.' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
