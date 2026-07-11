const { readData, writeData } = require('./dbHelper');
const { v4: uuidv4 } = require('uuid');

class Service {
  static async find() {
    return readData('services.json');
  }

  static async findById(id) {
    const services = readData('services.json');
    return services.find(s => s.id === id);
  }

  static async create(serviceData) {
    const services = readData('services.json');
    const newService = {
      id: uuidv4(),
      name: serviceData.name,
      description: serviceData.description,
      price: serviceData.price,
      category: serviceData.category,
      icon: serviceData.icon || 'wrench',
      duration: serviceData.duration || '1 Hour',
      createdAt: new Date().toISOString()
    };
    services.push(newService);
    writeData('services.json', services);
    return newService;
  }
}

module.exports = Service;
