const restify = require('restify');
const mongoose = require('mongoose');
const config = require('./config');
const rjwt = require('restify-jwt-community');

const server = restify.createServer();
const corsMiddleware = require('restify-cors-middleware')

const cors = corsMiddleware({
  preflightMaxAge: 5, //Optional
  origins: ['*'],
  
  allowHeaders: ['Authorization'],
  exposeHeaders: ['API-Token-Expiry']
})

server.pre(cors.preflight)
server.use(cors.actual)
// Middleware
server.use(restify.plugins.bodyParser());

// Protect Routes
//server.use(rjwt({ secret: config.JWT_SECRET }).unless({ path: ['/auth'] }));

server.listen(config.PORT, () => {
  mongoose.set('useFindAndModify', false);
  mongoose.connect(
    config.MONGODB_URI,
    { 
        useNewUrlParser: true,
        useCreateIndex: true  
    }
  );
});

const db = mongoose.connection;

db.on('error', err => console.log(err));

db.once('open', () => {
  require('./routes/users')(server);
  require('./routes/admin_water_consumption')(server);
  require('./routes/projects')(server);
  require('./routes/device_details')(server);
  require('./routes/bills')(server);
  console.log(`Server started on port ${config.PORT}`);
});

