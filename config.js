module.exports = {
  ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  URL: process.env.BASE_URL || 'http://localhost:3000',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://admin:admin123@ds123834.mlab.com:23834/newapp',
  //MONGODB_URI: process.env.MONGODB_URI || 'mongodb://admin:admin123@localhost:27017/zengap',
  JWT_SECRET: process.env.JWT_SECRET || 'secret1'
};
