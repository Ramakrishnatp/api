const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const Admin_water_consumptionSchema = new mongoose.Schema({
  device_id: {
    type: String,
    required: true,
    trim: true
  },
  inlet1: {
    type: Number,
    required: true
  },
  user_id: {
    type: mongoose.Schema.ObjectId,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }, device_location: {
    type: String,
  }
});

Admin_water_consumptionSchema.plugin(timestamp);

const Admin_water_consumption = mongoose.model('Admin_water_consumption', Admin_water_consumptionSchema);
module.exports = Admin_water_consumption;