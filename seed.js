const mongoose = require('mongoose');
require('dotenv').config();

const Service = require('./models/Service');
const Technician = require('./models/Technician');
const User = require('./models/User');
const Booking = require('./models/Booking');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ac_repair_db';

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected!');

  console.log('Seeding database...');

  // 1. Clear existing data
  await Promise.all([
    Service.deleteMany({}),
    Technician.deleteMany({}),
    User.deleteMany({}),
    Booking.deleteMany({})
  ]);
  console.log('✔ Cleared existing collections.');

  // 2. Services
  const services = [
    {
      _id: 'srv-install-split',
      id: 'srv-install-split',
      name: 'Installation split AC',
      description: 'Professional mounting, connection, piping, and complete performance testing for split AC systems.',
      price: '₹1,500',
      category: 'Installation',
      icon: 'plus-circle',
      duration: '2 Hours'
    },
    {
      _id: 'srv-uninstall-split',
      id: 'srv-uninstall-split',
      name: 'Uninstalled split AC',
      description: 'Safe split air conditioner dismounting, pipe capping, and refrigerant recovery.',
      price: '₹500',
      category: 'Installation',
      icon: 'minus-circle',
      duration: '1 Hour'
    },
    {
      _id: 'srv-install-window',
      id: 'srv-install-window',
      name: 'Installation Window AC',
      description: 'Window air conditioner mounting, secure wall/window fitting, and sealing.',
      price: '₹600',
      category: 'Installation',
      icon: 'plus-circle',
      duration: '1.5 Hours'
    },
    {
      _id: 'srv-uninstall-window',
      id: 'srv-uninstall-window',
      name: 'Uninstalled window AC',
      description: 'Safe window air conditioner dismounting, frame removal, and clean-up.',
      price: '₹400',
      category: 'Installation',
      icon: 'minus-circle',
      duration: '1 Hour'
    },
    {
      _id: 'srv-jet-service',
      id: 'srv-jet-service',
      name: 'Jet service',
      description: 'Deep high-pressure water pump wash for filters, cooling coils, drain tray, and condenser.',
      price: '₹500',
      category: 'Cleaning',
      icon: 'wind',
      duration: '1 Hour'
    },
    {
      _id: 'srv-gas-full',
      id: 'srv-gas-full',
      name: 'Gas charging full',
      description: 'Complete system leakage diagnostic, joint brazing, vacuumization, and full refrigerant recharge.',
      price: '₹3,200',
      category: 'Repair',
      icon: 'cloud-lightning',
      duration: '2 Hours'
    },
    {
      _id: 'srv-gas-topup',
      id: 'srv-gas-topup',
      name: 'Gas top up',
      description: 'Refueling low refrigerant levels to restore optimal cooling and pressure.',
      price: '₹1,700',
      category: 'Repair',
      icon: 'cloud-lightning',
      duration: '1 Hour'
    }
  ];
  await Service.insertMany(services);
  console.log('✔ Seeded services.');

  // 3. Technicians
  const technicians = [
    { _id: 'tech-amaan', id: 'tech-amaan', name: 'Amaan Khan', phone: '+91 9719316515', rating: 5.0, status: 'active' }
  ];
  await Technician.insertMany(technicians);
  console.log('✔ Seeded technicians.');

  // 4. Users (including Admins)
  // Password hashing is handled automatically by User schema pre-save hook
  await User.create([
    {
      name: 'Sharoz Admin',
      email: 'sharoz@mail.com',
      password: 'sharoz@122',
      role: 'admin'
    },
    {
      name: 'Amaan Admin',
      email: 'amaan@mail.com',
      password: 'khan@786',
      role: 'admin'
    },
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user'
    }
  ]);
  console.log('✔ Seeded users (Admin 1: sharoz@mail.com / sharoz@122, Admin 2: amaan@mail.com / khan@786, User: john@example.com / password123).');

  console.log('Seed completed successfully!');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Error seeding data:', err);
  mongoose.disconnect();
});
