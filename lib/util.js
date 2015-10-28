/*global __dirname*/
var fs = require('fs');

var PATH_SENSORS = '../devices/sensors/',

    PATH_ACTIONS = '../devices/actions/';

// export the class
module.exports = {
    addZero: function(n){
        'use strict';
        return n < 10 ? '0' + n : '' + n;
    },
    getSensors: function () {
        'use strict';

        var sensors = [],
            Sensor,
            sensor;

        fs.readdirSync(PATH_SENSORS).forEach(function (file) {
            if (~file.indexOf('.js') && file !== 'abstract.js'){
                Sensor = require(PATH_SENSORS + file);
                sensor = new Sensor();

                sensors.push({
                    type: file.replace('.js', ''),
                    name: sensor.NAME,
                    description: sensor.DESCRIPTION
                });
            }
        });

        return sensors;
    },
    getSensor: function (sensor) {
        'use strict';

        return require(PATH_SENSORS + sensor.toLowerCase() + '.js');
    },
    getActions: function () {
        'use strict';

        var actions = [],
            Action,
            action;

        fs.readdirSync(PATH_ACTIONS).forEach(function (file) {
            if (~file.indexOf('.js') && file.toLowerCase().indexOf('abstract') === -1){
                Action = require(PATH_ACTIONS + file);
                action = new Action();

                actions.push({
                    type: file.replace('.js', ''),
                    name: action.NAME,
                    description: action.DESCRIPTION
                });
            }
        });

        return actions;
    },
    getAction: function (action) {
        'use strict';

        return require(PATH_ACTIONS + action.toLowerCase() + '.js');
    }
};
