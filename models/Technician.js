const { readData } = require('./dbHelper');

class Technician {
  static async find() {
    return readData('technicians.json');
  }

  static async findById(id) {
    const technicians = readData('technicians.json');
    return technicians.find(t => t.id === id);
  }
}

module.exports = Technician;
