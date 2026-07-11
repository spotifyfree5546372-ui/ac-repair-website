const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

async function seed() {
  console.log('Seeding mock database...');

  // 1. Services
  const services = [
    {
      id: 'srv-install-split',
      name: 'Installation split AC',
      description: 'Professional mounting, connection, piping, and complete performance testing for split AC systems.',
      price: '₹1,500',
      category: 'Installation',
      icon: 'plus-circle',
      duration: '2 Hours'
    },
    {
      id: 'srv-uninstall-split',
      name: 'Uninstalled split AC',
      description: 'Safe split air conditioner dismounting, pipe capping, and refrigerant recovery.',
      price: '₹500',
      category: 'Installation',
      icon: 'minus-circle',
      duration: '1 Hour'
    },
    {
      id: 'srv-install-window',
      name: 'Installation Window AC',
      description: 'Window air conditioner mounting, secure wall/window fitting, and sealing.',
      price: '₹600',
      category: 'Installation',
      icon: 'plus-circle',
      duration: '1.5 Hours'
    },
    {
      id: 'srv-uninstall-window',
      name: 'Uninstalled window AC',
      description: 'Safe window air conditioner dismounting, frame removal, and clean-up.',
      price: '₹400',
      category: 'Installation',
      icon: 'minus-circle',
      duration: '1 Hour'
    },
    {
      id: 'srv-jet-service',
      name: 'Jet service',
      description: 'Deep high-pressure water pump wash for filters, cooling coils, drain tray, and condenser.',
      price: '₹500',
      category: 'Cleaning',
      icon: 'wind',
      duration: '1 Hour'
    },
    {
      id: 'srv-gas-full',
      name: 'Gas charging full',
      description: 'Complete system leakage diagnostic, joint brazing, vacuumization, and full refrigerant recharge.',
      price: '₹3,200',
      category: 'Repair',
      icon: 'cloud-lightning',
      duration: '2 Hours'
    },
    {
      id: 'srv-gas-topup',
      name: 'Gas top up',
      description: 'Refueling low refrigerant levels to restore optimal cooling and pressure.',
      price: '₹1,700',
      category: 'Repair',
      icon: 'cloud-lightning',
      duration: '1 Hour'
    }
  ];
  fs.writeFileSync(path.join(DATA_DIR, 'services.json'), JSON.stringify(services, null, 2));
  console.log('✔ Seeded services.');

  // 2. Technicians
  const technicians = [
    { id: 'tech-amaan', name: 'Amaan Khan', phone: '+91 9719316515', rating: 5.0, status: 'active' }
  ];
  fs.writeFileSync(path.join(DATA_DIR, 'technicians.json'), JSON.stringify(technicians, null, 2));
  console.log('✔ Seeded technicians.');

  // 3. Users (including Admin)
  const adminPasswordHash = await bcrypt.hash('adminpassword', 10);
  const userPasswordHash = await bcrypt.hash('password123', 10);
  const users = [
    {
      id: 'user-admin',
      name: 'Admin User',
      email: 'admin@acservice.com',
      password: adminPasswordHash,
      role: 'admin',
      createdAt: new Date().toISOString()
    },
    {
      id: 'user-john',
      name: 'John Doe',
      email: 'john@example.com',
      password: userPasswordHash,
      role: 'user',
      createdAt: new Date().toISOString()
    }
  ];
  fs.writeFileSync(path.join(DATA_DIR, 'users.json'), JSON.stringify(users, null, 2));
  console.log('✔ Seeded users (Admin: admin@acservice.com / adminpassword, User: john@example.com / password123).');

  // 4. Empty bookings
  fs.writeFileSync(path.join(DATA_DIR, 'bookings.json'), JSON.stringify([], null, 2));
  console.log('✔ Reset bookings list.');

  console.log('Seed completed successfully!');
}

seed().catch(err => {
  console.error('Error seeding data:', err);
});
