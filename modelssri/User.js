const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const UserSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
    trim: true
  },
  user_email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  user_password: {
    type: String,
    required: true
  },
  user_mobile: {
    type: Number,
    default: 0
  },
  user_location: {
    type: String,
    required: true,
    trim: true
  },
  user_building_name: {
    type: String,
    required: true,
    trim: true
  },
  user_address: {
    type: String,
    required: true,
    trim: true
  },
  user_project_name: {
    type: String,
    required: true,
    trim: true
  },
  user_house_number: {
    type: String,
    required: true,
    trim: true
  },
  user_created_by: {
    type: String,
    required: true,
    trim: true
  },
  user_role: {
    type: String,
    required: true,
    trim: true
  },
  user_profile: {
    type: String
  },
  user_status:{
    type: String,
    default: 'Active'
  }
});

UserSchema.plugin(timestamp);

const User = mongoose.model('User', UserSchema);
module.exports = User;
