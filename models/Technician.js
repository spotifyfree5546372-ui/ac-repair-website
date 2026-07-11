const mongoose = require('mongoose');

const technicianSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Custom string identifier (e.g. 'tech-amaan')
  id: { type: String, required: true },  // Kept for compatibility
  name: { type: String, required: true },
  phone: { type: String, required: true },
  rating: { type: Number, default: 5.0 },
  status: { type: String, default: 'active' }
});

module.exports = mongoose.models.Technician || mongoose.model('Technician', technicianSchema);
