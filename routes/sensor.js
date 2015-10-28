var express = require('express');
var router = express.Router();
var async = require('async');
var Sensor = require('../models/sensor.js');
var SensorLog = require('../models/sensorLog.js');
var util = require('../lib/util.js');


/* GET home page. */
function getDetails (sensorIdentifier, renderCallback) {
  var chartData, history;

  async.parallel([
    function (callback) {
      Sensor.find({name: sensorIdentifier.name}, function (err, docs) {
        history = docs;
        callback();
      });
    }, function (callback) {
      Sensor.findOne(sensorIdentifier, function (err, doc) {
        var AdaterObj = util.getSensor(sensorIdentifier.type);

        chartData = new AdaterObj().toChart(doc);

        callback();
      });
    }], function () {
    renderCallback(chartData, history);
  });
}

//how to create without the route create? CRUD UX ?
//GET
//GET ID
//POST
//PUT ID
//DELETE ID
router.get('/create', function(req, res) {
  //sensor name
  //sensor description
  //sensor type (devices list)
  //sensor options (ajax on change type)
  //Cancel / Create
  var sensors = util.getSensors(), DevicesObj;

  DevicesObj = util.getSensor(sensors[0].type);

  res.render('sensor/create_update', {
    title: 'Create a sensor',
    sensors: sensors,
    options: new DevicesObj().getOptions()
  });
});

//used for create an sensor
router.post('/create', function (req, res) {
  var options = {}, data, SensorAdatper;

  Object.keys(req.body).forEach(function (key) {
    if (key.indexOf('options_') === 0) {
      options[key.replace('options_', '')] = req.body[key];
    }
  });

  data = {
    name: req.body.name,
    description: req.body.description,
    type: req.body.type,
    secretKey: req.body.secretKey,
    condition: req.body.condition,
    trigger: req.body.trigger,
    crontime: req.body.crontime,
    options: options
  };

  SensorAdatper = util.getSensor(data.type);
  data.name = new SensorAdatper(data).FANCY_NAME || data.name;

  new Sensor(data).save(function (err) {
    if(err) {
      console.error('ERROR:', err);
    }

    res.redirect('/sensor');

  });
});

router.get('/update/:id', function (req, res) {
  var sensors = util.getSensors();

  Sensor.findById(req.params.id, function (err, doc) {
    var DevicesObj = util.getSensor(doc.type);

    res.render('sensor/create_update', {
      title: 'Update ' + doc.name,
      model: doc,
      sensors: sensors,
      options: new DevicesObj(doc).getOptions()
    });
  });
});

//TODO should be put but form no working with put ???
//used for update an sensor
router.post('/update/:id', function (req, res) {
  Sensor.findById(req.params.id, function (err, doc) {
    var options = {}, SensorAdatper;

    Object.keys(req.body).forEach(function (key) {
      if (key.indexOf('options_') === 0) {
        options[key.replace('options_', '')] = req.body[key];
      }
    });

    doc.type = req.body.type;
    doc.description = req.body.description;
    doc.condition = req.body.condition;
    doc.trigger = req.body.trigger;
    doc.crontime = req.body.crontime;
    doc.options = options;
    SensorAdatper = util.getSensor(doc.type);
    doc.name = new SensorAdatper(doc).FANCY_NAME || req.body.name;

    doc.save(function (err) {
        if (err) {
          console.error('ERROR:', err);
        }

        res.redirect('/sensor');

    });
  });
});


router.get('/sync/:id', function(req, res) {
  'use strict';

  Sensor.findById(req.params.id, function (err, doc) {
    if(!err) {
      SensorLog.findOne({sensorId: req.params.id}, function (errLog) {
        if (!errLog) {
          var DevicesObj = util.getSensor(doc.type);

          new DevicesObj(doc).sync(function (data) {
            res.send(data);
          });
        } else {
          res.send(null);
        }
      });
    } else {
      //error not found
      res.send(null);
    }
  });
});

router.get('/', function(req, res) {
  'use strict';

  Sensor.find({}, function (err, docs) {
    var asyncArray = [];

    docs.forEach(function (doc, index) {
      var SensorAdapter = util.getSensor(doc.type);

      docs[index] = new SensorAdapter(doc);
      asyncArray.push(function(callback) {
        SensorLog.findOne({sensorId: doc._id}, function (err, docLog) {
          docs[index].log = docLog;
          callback();
        });
      });
    });

    async.parallel(asyncArray, function(){
      res.render('sensor/index', {
        title: 'Sensor',
        sensors: docs
      });
    });

  });
});

router.get('/:id/:month/:year', function(req, res, next) {
  var histories, model, modelLog, chartData, DevicesObj;

  async.parallel([function (callback) {
    Sensor.findById(req.params.id, function (err, doc) {
      DevicesObj = util.getSensor(doc.type);

      model = doc;
      SensorLog.findOne({sensorId: req.params.id}, function (err, docLog) {
        modelLog = docLog;
        //need to get the SensorLog where sensorId = id and order
        chartData = new DevicesObj(model).setModelLog(modelLog).toChart();
        callback();
      });
    });
  }, function (callback) {

    SensorLog
        .find({
          sensorId: req.params.id
        })
        .sort({
          year: -1,
          month: -1
        })
        .exec(function (err, docs) {
          histories = docs;
          callback();
        });
  }], function () {
    res.render('sensor/read', {
      title: 'Sensor ' + model.name,
      description: new DevicesObj().DESCRIPTION,
      model: model,
      histories: histories,
      chart: chartData
    });
  });
});

router.get('/:id', function(req, res, next) {
  'use strict';

  var histories, model, modelLog, chartData, DevicesObj;

  async.parallel([function (callback) {
    Sensor.findById(req.params.id, function (err, doc) {
      DevicesObj = util.getSensor(doc.type);

      model = doc;
      SensorLog
          .findOne({
            sensorId: req.params.id
          })
          .sort({
            year: -1,
            month: -1
          })
          .exec(function (err, docLog) {
            modelLog = docLog;
            //need to get the SensorLog where sensorId = id and order
            chartData = new DevicesObj(model).setModelLog(modelLog).toChart();
            callback();
          });
    });
  }, function (callback) {
    SensorLog
        .find({
          sensorId: req.params.id
        })
        .sort({
          year: -1,
          month: -1
        })
        .exec(function (err, docs) {
          histories = docs;
          callback();
        });
  }], function () {
    res.render('sensor/read', {
      title: 'Sensor ' + model.name,
      description: new DevicesObj().DESCRIPTION,
      model: model,
      histories: histories,
      chart: chartData
    });
  });


});


router.delete('/', function(req, res) {
  'use strict';

  Sensor.findById(req.body.id, function (err, doc) {
    if (!err) {
      doc.remove(function (errRemove) {
        if(!errRemove) {
          res.render(true);
        } else {
          res.render(false);
        }
      });
    } else {
      res.render(false);
    }
  });
});


module.exports = router;
