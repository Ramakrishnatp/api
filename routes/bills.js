const errors = require('restify-errors');
const rjwt = require('restify-jwt-community');
const Bills = require('../models/Bills');
const config = require('../config');

module.exports = server => {
  // Get Bills
  server.get('/bills', rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      try {
        const bills = await Bills.find({});
        res.send(bills);
        next();
      } catch (err) {
        return next(new errors.InvalidContentError(err));
      }
    });

  // Get Single Bills
  server.get('/bills/:id', rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      try {
        const bills = await Bills.findById(req.params.id);
        res.send(bills);
        next();
      } catch (err) {
        return next(
          new errors.ResourceNotFoundError(
            `There is no Bills with the id of ${req.params.id}`
          )
        );
      }
    });

  // Get Device_details with user id
  server.get('/billswithuserid/:user_id', rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      try {
        const bills = await Bills.findOne({ user_id: req.params.user_id });
        res.send(bills);
        next();
      } catch (err) {
        return next(
          new errors.ResourceNotFoundError(
            `There is no Bills with the user id of ${req.params.user_id}`
          )
        );
      }
    });

  //Bills with UserID
  server.get('/userbills',
    rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      try {
        const bills = await Bills.aggregate([
          {
            $lookup: {
              from: "users",
              localField: "user_id",
              foreignField: "_id",
              as: "UserBills"
            }
          }
          //  ,{
          //   $unwind: {
          //       path: "$user_id",
          //       //preserveNullAndEmptyArrays: false
          //   }}

        ]);
        res.send(bills);
        next();

      } catch (err) {
        return next(new errors.InvalidContentError(err));
      }
    });


  // Add Bills
  server.post(
    '/bills',
    rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      // Check for JSON
      if (!req.is('application/json')) {
        return next(
          new errors.InvalidContentError("Expects 'application/json'")
        );
      }
      console.log(req.body);
      const { device_id, user_id, units, rate, total, device_location } = req.body;

      const bills = new Bills({
        device_id,
        user_id,
        units,
        rate,
        total,
        device_location
      });

      try {
        const newBills = await bills.save();
        res.send(bills);
        next();
      } catch (err) {
        return next(new errors.InternalError(err.message));
      }
    }
  );

  // Update Device_details
  server.put(
    '/bills/:id',
    rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      // Check for JSON
      if (!req.is('application/json')) {
        return next(
          new errors.InvalidContentError("Expects 'application/json'")
        );
      }

      try {
        const bills = await Bills.findOneAndUpdate(
          { _id: req.params.id },
          req.body
        );
        res.send(200);
        next();
      } catch (err) {
        return next(
          new errors.ResourceNotFoundError(
            `There is no Bills with the id of ${req.params.id}`
          )
        );
      }
    }
  );

  // Delete Device_details
  server.del(
    '/bills/:id',
    rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      try {
        const bills = await Bills.findOneAndRemove({
          _id: req.params.id
        });
        res.send(204);
        next();
      } catch (err) {
        return next(
          new errors.ResourceNotFoundError(
            `There is no Bills with the id of ${req.params.id}`
          )
        );
      }
    }
  );

};
