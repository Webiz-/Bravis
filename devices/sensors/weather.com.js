/*global require, module*/
var request = require('request'),
    Abstract = require('./abstract.js'),
    util = require('util'),
    i18n = require('i18n');

var NAME = i18n.__('Weather.com'),

    DESCRIPTION = i18n.__('Check for rain on the next period, trigger is chance to rain (0 - 100)'),

    ICON = '/images/sensors/rain-48.png',

    KEY = 'e4ae967808a9831a',//should be on a folder apikey...

    URL = 'http://api.wunderground.com/api/%s/forecast/lang:FR/q/%s.json';

function WEATHER(model) {
    'use strict';

    this.NAME = NAME;

    this.DESCRIPTION = DESCRIPTION;

    this.ICON = ICON;

    this.model = model;

    if(this.model) {
        this.FANCY_NAME = util.format(i18n.__('Tomorrow chance to rain %s %s% at %s'), this.model.condition, this.model.trigger, this.model.options.location);
    }
}

WEATHER.prototype = new Abstract();

/**
 * Get the value from the remote host
 * @param callback
 */
WEATHER.prototype.sync = function (callback) {
    'use strict';

    var that = this, value, state;

    request(util.format(URL, KEY, this.model.options.location), function (error, response, body) {
        if (!error && response.statusCode === 200) {
            body = JSON.parse(body);

            value = parseInt(body.forecast.txt_forecast.forecastday[0].pop, 10);
            state = that.getState(value);

            that.save({
                value: value,
                state: state
            }, function () {
                callback({
                    value: value,
                    state: state
                });
            });
        } else {
            console.log(body);
            console.error('ERROR');
            console.error(error);
            callback({
                value: false,
                state: false
            });
        }
    });
};

/**
 * Retrieve all the Options to configure the devices
 * @returns {Array}
 */
WEATHER.prototype.getOptions = function () {
    'use strict';

    return [{
        label: i18n.__('Location'),
        name: 'location',
        placeholder: 'France/Paris',
        type: 'text'
    }];
};

// export the class
module.exports = WEATHER;
