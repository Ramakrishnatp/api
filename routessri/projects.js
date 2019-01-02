const errors = require('restify-errors');
const rjwt = require('restify-jwt-community');
const Projects = require('../models/Projects');
const config = require('../config');

module.exports = server => {
  // Get Admin Water Consumption
  server.get('/projects', //rjwt({ secret: config.JWT_SECRET }),
  async (req, res, next) => {
    try {
      const projects = await Projects.find({});
      res.send(projects);
      next();
    } catch (err) {
      return next(new errors.InvalidContentError(err));
    }
  });



  // Get Single Admin Water Consumption
  server.get('/projects/:id', rjwt({ secret: config.JWT_SECRET }),
  async (req, res, next) => {
    try {
      const projects = await Projects.findById(req.params.id);
      res.send(projects);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          `There is no User_water_consumption with the id of ${req.params.id}`
        )
      );
    }
  });

  // Add Admin Water Consumption
  server.post(
    '/projects',
   // rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      // Check for JSON
      if (!req.is('application/json')) {
        return next(
          new errors.InvalidContentError("Expects 'application/json'")
        );
      }

      const { project_name, city, state, country, address } = req.body;

      const projects = new Projects({
        project_name, 
        city, 
        state, 
        country, 
        address      
      });

      try {
        const newProjects = await projects.save();
        //res.send(body);
        res.send(projects);
        next();
      } catch (err) {
        return next(new errors.InternalError(err.message));
      }
    }
  );

  // Update Admin Water Consumption
  server.put(
    '/projects/:id',
    //rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      // Check for JSON
      if (!req.is('application/json')) {
        return next(
          new errors.InvalidContentError("Expects 'application/json'")
        );
      }

      try {
        const projects = await Projects.findOneAndUpdate(
          { _id: req.params.id },
          req.body
        );
        res.send(200);
        next();
      } catch (err) {
        return next(
          new errors.ResourceNotFoundError(
            `There is no user_water_consumption with the id of ${req.params.id}`
          )
        );
      }
    }
  );

  // Delete Admin Water Consumption
  server.del(
    '/projects/:id',
    //rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      try {
        const projects = await Projects.findOneAndRemove({
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


