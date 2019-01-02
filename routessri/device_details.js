const errors = require('restify-errors');
const rjwt = require('restify-jwt-community');
const Device_details = require('../models/Device_details');
const config = require('../config');

module.exports = server => {
  // Get device_details
  server.get('/device_details', rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
    try {
      const device_details = await Device_details.find({});
      res.send(device_details);
      next();
    } catch (err) {
      return next(new errors.InvalidContentError(err));
    }
  });

  // Get Single Device_details
  server.get('/device_details/:id', rjwt({ secret: config.JWT_SECRET }),
  async (req, res, next) => {
    try {
      const device_details = await Device_details.findById(req.params.id);
      res.send(device_details);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          `There is no Device_details with the id of ${req.params.id}`
        )
      );
    }
  });

    // Get Device_details with user id
    server.get('/device_detailswithuserid/:user_id', //rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      try {
        const device_details = await Device_details.findOne({user_id: req.params.user_id});
        res.send(device_details);
        next();
      } catch (err) {
        return next(
          new errors.ResourceNotFoundError(
            `There is no Device_details with the user id of ${req.params.user_id}`
          )
        );
      }
    });

    server.get('/devicewithuser', 
    //rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      try {
        const device_details = await Device_details.aggregate([
          { $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "UserBills"
     }}
    //  {
    //   $unwind: {
    //       path: "$user_id",
    //       //preserveNullAndEmptyArrays: false
    //   }}
          
       ]);
        res.send(device_details);
        next();
        
      } catch (err) {
        return next(new errors.InvalidContentError(err));
      }
    });


  // Add Device_details
  server.post(
    '/device_details',
    //rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      // Check for JSON
      if (!req.is('application/json')) {
        return next(
          new errors.InvalidContentError("Expects 'application/json'")
        );
      }

      const { device_id, user_id, device_type,device_location, device_status } = req.body;

      const device_details = new Device_details({
        device_id,
        user_id,
        device_type,
        device_location,
        device_status        
      });

      try {
        const newDevice_details = await device_details.save();
        res.send(device_details);
        next();
      } catch (err) {
        return next(new errors.InternalError(err.message));
      }
    }
  );

  // Update Device_details
  server.put(
    '/device_details/:id',
    rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      // Check for JSON
      if (!req.is('application/json')) {
        return next(
          new errors.InvalidContentError("Expects 'application/json'")
        );
      }

      try {
        const device_details = await Device_details.findOneAndUpdate(
          { _id: req.params.id },
          req.body
        );
        res.send(200);
        next();
      } catch (err) {
        return next(
          new errors.ResourceNotFoundError(
            `There is no Device_details with the id of ${req.params.id}`
          )
        );
      }
    }
  );

  // Delete Device_details
  server.del(
    '/device_details/:id',
    rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      try {
        const device_details = await Device_details.findOneAndRemove({
          _id: req.params.id
        });
        res.send(204);
        next();
      } catch (err) {
        return next(
          new errors.ResourceNotFoundError(
            `There is no Device_details with the id of ${req.params.id}`
          )
        );
      }
    }
  );
};
