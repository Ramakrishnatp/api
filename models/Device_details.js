const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const Device_detailsSchema = new mongoose.Schema({
  device_id: {
    type: String,
    required: true,
    trim: true
  },

  user_id: {
    type: String,
    required: true
  },

  device_type: {
    type: String,
    required: true
  },

  device_location: {
    type: String,
    required: true
  },

  device_status: {
    type: String,
    default: 'Active'
  }
});

Device_detailsSchema.plugin(timestamp);

const Device_details = mongoose.model('Device_details', Device_detailsSchema);
module.exports = Device_details;