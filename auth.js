const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.authenticate = (user_email, user_password) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Get user by email
      const user = await User.findOne({ user_email });

      // Match Password
      bcrypt.compare(user_password, user.user_password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          resolve(user);
        } else {
          // Pass didn't match
          reject('Authentication Failed');
        }
      });
    } catch (err) {
      // Email not found
      reject('Authentication Failed');
    }
  });
};
