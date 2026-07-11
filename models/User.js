const { readData, writeData } = require('./dbHelper');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

class User {
  static async find() {
    return readData('users.json');
  }

  static async findOne(query) {
    const users = readData('users.json');
    return users.find(u => {
      for (let key in query) {
        if (u[key] !== query[key]) return false;
      }
      return true;
    });
  }

  static async findById(id) {
    const users = readData('users.json');
    return users.find(u => u.id === id);
  }

  static async create(userData) {
    const users = readData('users.json');
    
    // Hash password if it exists
    let passwordHash = userData.password;
    if (userData.password) {
      passwordHash = await bcrypt.hash(userData.password, 10);
    }

    const newUser = {
      id: uuidv4(),
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: passwordHash,
      role: userData.role || 'user',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeData('users.json', users);
    return newUser;
  }

  static async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }
}

module.exports = User;
