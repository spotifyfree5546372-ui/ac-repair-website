const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  _id: { type: String }, // custom BK-XXXXXX string generated pre-save
  id: { type: String },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  serviceId: { type: String, required: true },
  serviceName: { type: String, required: true },
  servicePrice: { type: String, required: true },
  bookingDate: { type: String, required: true },
  bookingTimeSlot: { type: String, required: true },
  address: { type: String, required: true },
  contactPhone: { type: String, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'assigned', 'completed', 'rejected'] },
  technicianId: { type: String, default: null },
  technicianName: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

// Pre-save hook to generate human-friendly booking IDs
bookingSchema.pre('save', function(next) {
  if (!this._id) {
    const bookingId = 'BK-' + Math.floor(100000 + Math.random() * 900000);
    this._id = bookingId;
    this.id = bookingId;
  }
  next();
});

// Helper statics for controller compatibility
bookingSchema.statics.findByUser = function(userId) {
  return this.find({ userId });
};

bookingSchema.statics.updateStatus = function(id, status, technicianId = null, technicianName = null) {
  const updateData = { status };
  if (technicianId) {
    updateData.technicianId = technicianId;
    updateData.technicianName = technicianName;
  }
  return this.findByIdAndUpdate(id, updateData, { new: true });
};

module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
