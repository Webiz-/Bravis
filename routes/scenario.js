var express = require('express');
var router = express.Router();
var async = require('async');
var Sensor = require('../models/sensor.js');
var Action = require('../models/action.js');
var Scenario = require('../models/scenario.js');
var util = require('../lib/util.js');
var fs = require('fs');

var CronJob = require('cron').CronJob;


// index
router.get('/', function(req, res, next) {
  Scenario.find({}, function (err, docs) {
      var asyncTask = [];

      docs.forEach(function(doc, indexDoc){
          doc.triggers.forEach(function (trigger, index){
              asyncTask.push(function (callback) {
                  Sensor.findById(trigger, function (err, doc) {
                      var SensorObj =  util.getSensor(doc.type);
                      docs[indexDoc].triggers[index] = new SensorObj(doc);
                      callback();
                  });
              });
          });

          doc.actions.forEach(function (action, index){
              asyncTask.push(function (callback) {
                  Action.findById(action, function (err, doc) {
                      var ActionObj =  util.getAction(doc.type);
                      docs[indexDoc].actions[index] = new ActionObj(doc);
                      callback();
                  });
              });
          });
      });

      async.parallel(asyncTask, function () {
          res.render('scenario/index', {
              title: 'Scenarios',
              models: docs
          });
      });


  });
});

// create
router.get('/create', function(req, res) {
    'use strict';

    var sensors, actions,

     getSensors = function (callback) {
         Sensor.find({}, function (err, docs) {
             sensors = docs;
             callback();
         });
     },

    getActions = function (callback) {
        Action.find({}, function (err, docs) {
            actions = docs;
            callback();
        });
    };

    async.parallel([
        getSensors,
        getActions
    ], function(){
        res.render('scenario/create_update', {
            title: 'Create a scenario',
            sensors: sensors,
            actions: actions
        });
    });
});

router.post('/create', function (req, res) {
  new Scenario({
    name: req.body.name,
    crontime: req.body.crontime,
    triggers: req.body['triggers[]'],
    actions: req.body.actions
  }).save(function (err) {
        if(err) {
          console.error('ERROR:', err);
        }

        res.send(true);
      });
});

// update
router.get('/update/:id', function (req, res) {
    'use strict';

    var sensors, actions,

        getSensors = function (callback) {
            Sensor.find({}, function (err, docs) {
                sensors = docs;
                callback();
            });
        },

        getActions = function (callback) {
            Action.find({}, function (err, docs) {
                actions = docs;
                callback();
            });
        };

    async.parallel([
        getSensors,
        getActions
    ], function(){
        Scenario.findById(req.params.id, function (err, doc) {

            res.render('scenario/create_update', {
                title: 'Update ' + doc.name,
                model: doc,
                sensors: sensors,
                actions: actions
            });
        });
    });


});

//TODO should be put but form no working with put ???
router.post('/update/:id', function (req, res) {
    Scenario.findById(req.params.id, function (err, doc) {

        doc.name = req.body.name;
        doc.crontime = req.body.crontime;
        doc.triggers = req.body['triggers[]'];
        doc.actions = req.body.actions;

        doc.save(function (err) {
            if (err) {
                console.error('ERROR:', err);
            }

            res.send(true);

        });
    });
});

// get
router.get('/:id', function (req, res) {
    console.log(req.params.id);
    Scenario.findById(req.params.id, function (err, doc) {
        res.render('scenario/read', {
            title: 'Update ' + doc.name,
            model: doc
        });
    });
});

// delete
router.delete('/', function(req, res) {
    'use strict';

    Scenario.findById(req.body.id, function (err, doc) {
        doc.remove(function (errDb) {
            res.render(!errDb);
        });
    });
});

module.exports = router;
