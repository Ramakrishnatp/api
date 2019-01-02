const errors = require('restify-errors');
const rjwt = require('restify-jwt-community');
const Admin_water_consumption = require('../models/Admin_water_consumption');
const config = require('../config');
var isodate = require('isodate');

module.exports = server => {
  // Get Admin Water Consumption
  server.get('/admin_water_consumption', //rjwt({ secret: config.JWT_SECRET }),
  async (req, res, next) => {
    try {
      const admin_water_consumption = await Admin_water_consumption.find({});
      res.send(admin_water_consumption);
      next();
    } catch (err) {
      return next(new errors.InvalidContentError(err));
    }
  });


  // Get Single Admin Water Consumption
  server.get('/admin_water_consumption/:id', rjwt({ secret: config.JWT_SECRET }),
  async (req, res, next) => {
    try {
      const admin_water_consumption = await Admin_water_consumption.findById(req.params.id);
      res.send(admin_water_consumption);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          `There is no User_water_consumption with the id of ${req.params.id}`
        )
      );
    }
  });

  server.get('/admin_water_consumptionwithuserid/:user_id', //rjwt({ secret: config.JWT_SECRET }),
  async (req, res, next) => {
    try {
      const admin_water_consumption = await Admin_water_consumption.findOne({user_id: req.params.user_id});
      res.send(admin_water_consumption);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          `There is no User_water_consumption with the user id of ${req.params.user_id}`
        )
      );
    }
  });

 server.get('/presentday_usage', async (req, res, next) => {
    try {
   
      var datetime = new Date().toISOString().slice(0, 10);
      var datestart = datetime+"T00:00:00.000Z";
      var dateend = datetime+"T23:59:53.000Z";
      console.log(datetime);
      
      pipeline = [
        {
            $match: {
               //created_At: {$gte: new Date('06/12/2018')},
             //  created_At: {$gt: new Date(datetime)},
             date: {$gte: isodate(datestart), $lt: isodate(dateend)}
                
  
            }
        },
        {
            $group: {
                _id: {$dayOfYear: '$date'},
                totalConsumption: {$sum: "$inlet1"}
            }
        },
		{
			$limit:1
		}
    ];
  
  const admin_water_consumption = await Admin_water_consumption. aggregate(pipeline);
     res.send(admin_water_consumption); 
  
      next();
    } catch (err) {
      return next(new errors.InvalidContentError(err));
    }
  });

  server.get('/oneweek_usage',// rjwt({ secret: config.JWT_SECRET }),
  async (req, res, next) => {
    try {    
      pipeline1 = [
        {
            $match: {
              'date': {'$gte': new Date((new Date().getTime() - (7 * 24 * 60 * 60 * 1000)))}
            }
        },
        {
            $group: {
              _id: {
                user_id: "$user_id",
                ThisWeek: {
                    //month: { $month: "$ord_date" },
                    week: { $week: "$date" },
                    //year: { $year: "$ord_date"}
                }
             },
                totalConsumption: {$sum: "$inlet1"}
            }
        },
		{
			$limit:1
		}
    ];
  
  //db.posts.find({created_on: {$gte: start, $lt: end}});
  //const user_water_consumptions = await User_water_consumptions. aggregate([ { $match: { date: { $in: [ new Date('2018-11-25'), new Date('2018-11-28') ] }}},{ $group: { _id: "$device_id", total: { $sum: "$inlet1" }}}]);
    
  const admin_water_consumption = await Admin_water_consumption.aggregate(pipeline1);
  
     res.send(admin_water_consumption);
  
      next();
    } catch (err) {
      return next(new errors.InvalidContentError(err));
    }  
  });
  
 

 server.get('/month_usage', //rjwt({ secret: config.JWT_SECRET }), 
  async (req, res, next) => {
    try {
   
      var datetime = new Date().toISOString().slice(0, 10);
      var datestart = datetime+"T00:00:00.0Z";
      var dateend = datetime+"T23:59:00.0Z";
      
      pipeline = [
        {
            $match: {
               //created_At: {$gte: new Date('06/12/2018')},
             //  created_At: {$gt: new Date(datetime)},
            // date: {$gte: isodate(datestart), $lt: isodate(dateend)}
			 'date': {'$gte': new Date((new Date().getTime() - (30 * 24 * 60 * 60 * 1000)))}
                
  
            }
        },
        {
            $group: {
              _id: {
                user_id: "$user_id",
                date: {
                    Month: { $month: "$date" },
                    //Week: { $dayOfMonth: "$date" },
                    //year: { $year: "$ord_date"}
                }
             },
                totalConsumption: {$sum: "$inlet1"}
            }
        },
		{
			$limit:1
		}
    ];
  
  const admin_water_consumption = await Admin_water_consumption.aggregate(pipeline);
     res.send(admin_water_consumption); 
  
      next();
    } catch (err) {
      return next(new errors.InvalidContentError(err));
    }
  });
  // Between Usage

  server.get('/betweendays_usage', //rjwt({ secret: config.JWT_SECRET }),
  async (req, res, next) => {
	    
    try {
	console.log("requst" );
     // var datetime = new Date().toISOString().slice(0, 10);
     // var datestart = "2018-12-10";
     // var dateend = "2018-12-19";
		const{tomonth, frommonth} = req.body; 
		console.log(tomonth);
      date = new Date().toISOString().slice(0, 10);
      //console.log(date);
      pipeline4 = [
        {
          $match: {
                 date: {$gte: tomonth, $lte: frommonth}
            }
        },
        
        {
            $group: {
                _id: {device_id: '$device_id', user_id: '$user_id'},
                totalConsumption: {$sum: "$inlet1"}
            }
        }
      ];
  
    const admin_water_consumption = await Admin_water_consumption.aggregate(pipeline4);
     res.send(admin_water_consumption);
  
      next();
    } catch (err) {
      return next(new errors.InvalidContentError(err));
    }
  });

  

  // Add Admin Water Consumption
  server.post(
    '/admin_water_consumption',
    //rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      // Check for JSON
      if (!req.is('application/json')) {
        return next(
          new errors.InvalidContentError("Expects 'application/json'")
        );
      }

      const { device_id, inlet, user_id } = req.body;

      const admin_water_consumption = new Admin_water_consumption({
        device_id,
        inlet,
        user_id      
      });

      try {
        const newAdmin_water_consumption = await admin_water_consumption.save();
        res.send(201);
        next();
      } catch (err) {
        return next(new errors.InternalError(err.message));
      }
    }
  );

  // Update Admin Water Consumption
  server.put(
    '/admin_water_consumption/:id',
    rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      // Check for JSON
      if (!req.is('application/json')) {
        return next(
          new errors.InvalidContentError("Expects 'application/json'")
        );
      }

      try {
        const admin_water_consumption = await Admin_water_consumption.findOneAndUpdate(
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
    '/admin_water_consumption/:id',
    rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      try {
        const admin_water_consumption = await Admin_water_consumption.findOneAndRemove({
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
  
  server.get('/15days_usage', async (req, res, next) => {
    try {
  
      var datetime = new Date().toISOString().slice(0, 10);
      //var datestart = datetime+"T00:00:00.0Z";
      //var dateend = datetime+"T23:59:00.0Z";
      
      pipeline1 = [
        {
            $match: {
              //'created_At': {'$gte': new Date((new Date().getTime() - 1000*60*60*24*30))}
              'date': {'$gte': new Date((new Date().getTime() - (15 * 24 * 60 * 60 * 1000)))}
  
                
            }
        },
        {
            $group: {
            //  _id:{device_id:"$device_id", datetime: {date: "$date"}},
                _id:{datetime:{$substr:["$date",5,5]}},
                totalConsumption: {$sum: "$inlet1"}
            }
        }
    ];
    const admin_water_consumption = await Admin_water_consumption. aggregate(pipeline1).sort({ _id: -1 });
     res.send(admin_water_consumption);
  
      next();
    } catch (err) {
      return next(new errors.InvalidContentError(err));
    }
  });


  
  
  
  server.get('/last30days_usage', async (req, res, next) => {
    try {
  
      var datetime = new Date().toISOString().slice(0, 10);
      //var datestart = datetime+"T00:00:00.0Z";
      //var dateend = datetime+"T23:59:00.0Z";
      
      pipeline1 = [
        {
            $match: {
              //'created_At': {'$gte': new Date((new Date().getTime() - 1000*60*60*24*30))}
              'date': {'$gte': new Date((new Date().getTime() - (30 * 24 * 60 * 60 * 1000)))}
  
                
            }
        },
        {
            $group: {
            //  _id:{device_id:"$device_id", datetime: {date: "$date"}},
                _id:{device_id:"$device_id",datetime:{$substr:["$date",0,10]}},
                totalConsumption: {$sum: "$inlet1"}
            }
        }
    ];
    const admin_water_consumption = await Admin_water_consumption. aggregate(pipeline1).sort({ _id: -1 });
     res.send(admin_water_consumption);
  
      next();
    } catch (err) {
      return next(new errors.InvalidContentError(err));
    }
  });


};




