const { readData, writeData } = require('./dbHelper');

class Booking {
  static async find() {
    return readData('bookings.json');
  }

  static async findById(id) {
    const bookings = readData('bookings.json');
    return bookings.find(b => b.id === id);
  }

  static async findByUser(userId) {
    const bookings = readData('bookings.json');
    return bookings.filter(b => b.userId === userId);
  }

  static async create(bookingData) {
    const bookings = readData('bookings.json');
    const newBooking = {
      id: 'BK-' + Math.floor(100000 + Math.random() * 900000), // Friendly Booking reference code
      userId: bookingData.userId,
      userName: bookingData.userName,
      userEmail: bookingData.userEmail,
      serviceId: bookingData.serviceId,
      serviceName: bookingData.serviceName,
      servicePrice: bookingData.servicePrice,
      bookingDate: bookingData.bookingDate,
      bookingTimeSlot: bookingData.bookingTimeSlot,
      address: bookingData.address,
      contactPhone: bookingData.contactPhone,
      status: 'pending',
      technicianId: null,
      technicianName: null,
      createdAt: new Date().toISOString()
    };
    bookings.push(newBooking);
    writeData('bookings.json', bookings);
    return newBooking;
  }

  static async updateStatus(id, status, technicianId = null, technicianName = null) {
    const bookings = readData('bookings.json');
    const bookingIndex = bookings.findIndex(b => b.id === id);
    if (bookingIndex === -1) return null;

    bookings[bookingIndex].status = status;
    if (technicianId) {
      bookings[bookingIndex].technicianId = technicianId;
      bookings[bookingIndex].technicianName = technicianName;
    }
    writeData('bookings.json', bookings);
    return bookings[bookingIndex];
  }
}

module.exports = Booking;
