var express = require('express');
var router = express.Router();
var async = require('async');
var Action = require('../models/action.js');
var util = require('../lib/util.js');

router.get('/create', function(req, res) {
  'use strict';

  var actions = util.getActions(),
      ActionObj = util.getAction(actions[0].type);

  res.render('action/create_update', {
    title: 'Create an action',
    actions: actions,
    options: new ActionObj().getOptions()
  });
});

//used for create an sensor
router.post('/create', function (req, res) {
  'use strict';

  var options = {}, data, ActionAdatper;

  Object.keys(req.body).forEach(function (key) {
    if (key.indexOf('options_') === 0) {
      options[key.replace('options_', '')] = req.body[key];
    }
  });
  data = {
    type: req.body.type,
        options: options
  };

  ActionAdatper = util.getAction(data.type);
  data.name = new ActionAdatper(data).FANCY_NAME;

  new Action(data).save(function (err) {
    if(err) {
      console.error('ERROR:', err);
    }

    res.redirect('/action');

  });
});

router.get('/update/:id', function (req, res) {
  'use strict';

  var actions = util.getActions();

  Action.findById(req.params.id, function (err, doc) {
    var DevicesObj = util.getAction(doc.type);

    res.render('action/create_update', {
      title: 'Update ' + doc.name,
      model: doc,
      actions: actions,
      options: new DevicesObj(doc).getOptions()
    });
  });
});

router.post('/update/:id', function (req, res) {
  'use strict';

  Action.findById(req.params.id, function (err, doc) {
    var options = {}, ActionAdatper;

    Object.keys(req.body).forEach(function (key) {
      if (key.indexOf('options_') === 0) {
        options[key.replace('options_', '')] = req.body[key];
      }
    });

    doc.type = req.body.type;
    doc.options = options;
    ActionAdatper = util.getAction(doc.type);
    doc.name = new ActionAdatper(doc).FANCY_NAME;

    doc.save(function (errSave) {
        if (errSave) {
          console.error('ERROR:', errSave);
        }

        res.redirect('/action');

    });
  });
});


router.get('/', function(req, res) {
  'use strict';

  Action.find({}, function (err, docs) {
    docs.forEach(function (doc, index) {
      var ActionAdatper = util.getAction(doc.type);
      docs[index] = new ActionAdatper(doc);
    });
    res.render('action/index', {
      title: 'Action',
      actions: docs
    });
  });
});
/*
router.get('/:id', function(req, res, next) {
  'use strict';

  var histories, model, modelLog, chartData, DevicesObj;

  async.parallel([function (callback) {
    Action.findById(req.params.id, function (err, doc) {
      DevicesObj = util.getAction(doc.type);

      model = doc;
      ActionLog.findOne({sensorId: req.params.id}, function (err, docLog) {
        modelLog = docLog;
        //need to get the ActionLog where sensorId = id and order
        chartData = new DevicesObj(model).setModelLog(modelLog).toChart();
        callback();
      });
    });
  }, function (callback) {
    ActionLog.find({sensorId: req.params.id}, function (err, docs) {
      histories = docs;
      callback();
    });
  }], function () {
    res.render('action/read', {
      title: 'Action ' + model.name,
      description: new DevicesObj().DESCRIPTION,
      model: model,
      histories: histories,
      chart: chartData
    });
  });


});
*/


router.delete('/', function(req, res) {
  'use strict';

  Action.findById(req.body.id, function (err, doc) {
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
