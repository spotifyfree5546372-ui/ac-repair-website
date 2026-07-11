const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Custom string identifier (e.g. 'srv-install-split')
  id: { type: String, required: true },  // Kept for EJS template compatibility
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  category: { type: String, required: true },
  icon: { type: String, default: 'wrench' },
  duration: { type: String, required: true }
});

module.exports = mongoose.models.Service || mongoose.model('Service', serviceSchema);
