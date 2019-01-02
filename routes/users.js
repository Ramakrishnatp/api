const errors = require('restify-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rjwt = require('restify-jwt-community');
const User = require('../models/User');
const auth = require('../auth');
const config = require('../config');

module.exports = server => {
  // Register User
  server.post('/register', (req, res, next) => {
    const { user_name, user_email, user_password, user_mobile, user_location, user_building_name, user_address, user_society_name, user_house_number, user_created_by, user_role, user_profile, user_status, user_image, customers_category,city,street } = req.body;

    const user = new User({
      user_name,
      user_email,
      user_password,
      user_mobile,
      user_location,
      user_building_name,
      user_address,
      user_society_name,
      user_house_number,
      user_created_by,
      user_role,
      user_profile,
      user_status,
      user_image,
      customers_category,
      city,
      street
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.user_password, salt, async (err, hash) => {
        // Hash Password
        user.user_password = hash;
        // Save User
        try {
          const newUser = await user.save();
          res.send({});
          next();
        } catch (err) {
          return next(new errors.InternalError(err.message));
        }
      });
    });
  });

  // Auth User
  server.post('/auth', async (req, res, next) => {
    const { user_email, user_password } = req.body;

    try {
      // Authenticate User
      const user = await auth.authenticate(user_email, user_password);

      // Create JWT
      const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
        expiresIn: '365d'
      });

      const { iat, exp } = jwt.decode(token);
      // Respond with token
      //res.json(user_role);
      res.send({ iat, exp, token: 'Bearer ' + token });

      next();
    } catch (err) {
      // User unauthorized
      return next(new errors.UnauthorizedError(err));
    }
  });

  server.get('/profile', rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
    console.log(req);
    try {
      const user = await User.find();
      res.send(user);
      next();

    } catch (err) {
      return next(new errors.InvalidContentError(err));
    }
  });

  //Get User

  server.get('/users', rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
    try {
      const user = await User.find();
      res.send(user);
      next();

    } catch (err) {
      return next(new errors.InvalidContentError(err));
    }
  });

  // Get Single User
  server.get('/users/:id', rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {

    try {
      const user = await User.findById(req.params.id);
      res.send(user);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          `There is no customer with the id of ${req.params.id}`
        )
      );
    }
  });

  // Update Customer
  server.put(
    '/users/:id',
    rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      // Check for JSON
      if (!req.is('application/json')) {
        return next(
          new errors.InvalidContentError("Expects 'application/json'")
        );
      }

      try {
        const user = await User.findOneAndUpdate(
          { _id: req.params.id },
          req.body
        );
        res.send(200);
        next();
      } catch (err) {
        return next(
          new errors.ResourceNotFoundError(
            `There is no customer with the id of ${req.params.id}`
          )
        );
      }
    }
  );

  server.get('/userwithproject',
    rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      try {
        const user = await User.aggregate([
          {
            $lookup:
            {
              from: "projects",
              localField: "user_society_name",
              foreignField: "project_name",
              as: "projectname"
            }
          }
        ]);
        res.send(user);
        next();
      } catch (err) {
        return next(new errors.InvalidContentError(err));
      }
    });
  server.get('/profile/:user_email', async (req, res, next) => {
    console.log(req.params);
    try {
      const user = await User.findOne({ user_email: req.params.user_email });
      res.send(user);
      next();
    } catch (err) {
      return next(new errors.InvalidContentError(`There is no User with the email of ${req.params.user_email}`));
    }
  });
  server.get('/userbyrole/:user_role', async (req, res, next) => {
    try {
      const user = await User.find({ user_role: req.params.user_role });
      res.send(user);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          `There is no customer with the user_role of ${req.params.user_role}`
        )
      );
    }
  });
  server.get('/userDevices',
    //rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      try {
        const user = await User.aggregate([
          {
            $match: {
              $and: [
                { user_role: { $eq: 'cust' } },
              ]
            }
          },
          {
            $lookup:
            {
              from: "bills",
              localField: "_id.str",
              foreignField: "user_id.str",
              as: "user_bills"
            }
          },
        ]);
        res.send(user);
        next();

      } catch (err) {
        return next(new errors.InvalidContentError(err));
      }
    });
  server.get('/userWaterConsumption',
    rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      try {
        const user = await User.aggregate([
          {
            $match: {
              $and: [
                { user_role: { $eq: 'cust' } },
              ]
            }
          }, {
            $lookup: {
              from: "admin_water_consumptions",
              localField: "_id",
              foreignField: "user_id",
              as: "user_water"
            }
          }

        ]);
        res.send(user);
        next();

      } catch (err) {
        return next(new errors.InvalidContentError(err));
      }
    });
  // server.get('/userWaterConsumption',
  //   //rjwt({ secret: config.JWT_SECRET }),
  //   async (req, res, next) => {
  //     try {
  //       const user = await User.aggregate([
  //         {
  //           $match: {
  //             $and: [
  //               { user_role: { $eq: 'cust' } },
  //             ]
  //           }
  //         },
  //         {
  //           $lookup:
  //           {
  //             from: "admin_water_consumptions",
  //             localField: "_id.str",
  //             foreignField: "user_id.str",
  //             as: "user_water"
  //           }
  //         },
  //       ]);
  //       res.send(user);
  //       next();
  //     } catch (err) {
  //       return next(new errors.InvalidContentError(err));
  //     }
  //   });
};
