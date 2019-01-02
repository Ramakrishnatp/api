const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const BillsSchema = new mongoose.Schema({
  device_id: {
    type: String,
    required: true,
    trim: true
  },

  user_id: {
    type: mongoose.Schema.ObjectId,
    required: true
  },

  units: {
    type: Number,
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
});

BillsSchema.plugin(timestamp);

const Bills = mongoose.model('Bills', BillsSchema);
module.exports = Bills;