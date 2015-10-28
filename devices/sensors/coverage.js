/*global require, module*/
var request = require('request'),
    parseString = require('xml2js').parseString,
    Abstract = require('./abstract.js'),
    util = require('util'),
    i18n = require('i18n');

var NAME = i18n.__('Yr.no'),

    DESCRIPTION = i18n.__('Check if the next 8 hours it will rain'),

    ICON = '/images/sensors/rain-48.png';

function YR(model) {
    'use strict';

    this.NAME = NAME;

    this.DESCRIPTION = DESCRIPTION;

    this.ICON = ICON;

    this.model = model;

    if(this.model) {
        this.FANCY_NAME = util.format(i18n.__('Next 8h if condition %s %s% at %s'), this.model.condition, this.model.trigger, this.model.options.url);
    }
}

YR.prototype = new Abstract();

/**
 * Get the value from the remote host
 * @param callback
 */
YR.prototype.sync = function (callback) {
    'use strict';

    var that = this;

    request(this.model.options.url, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            parseString(body, function (err, result) {
                var jsonXml,
                    times,
                    currentTimeSymbol,
                    nextTimeSymbol,
                    value, state;

                if (!err) {
                    jsonXml = JSON.parse(JSON.stringify(result));
                    times = jsonXml.weatherdata.forecast[0].tabular[0].time;

                    currentTimeSymbol = times[0].symbol[0].$.number;
                    nextTimeSymbol = times[1].symbol[0].$.number;

                    value = Math.max(currentTimeSymbol, nextTimeSymbol);
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
                    console.error(err);
                    callback({
                        value: false,
                        state: false
                    });
                }
            });
        } else {
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
YR.prototype.getOptions = function () {
    'use strict';

    return [{
        label: i18n.__('Url'),
        name: 'url',
        placeholder: i18n.__('The XML url from yr.no sample: http://www.yr.no/place/France/%C3%8Ele-de-France/Saint-Cyr-l\'%C3%89cole/forecast.xml'),
        type: 'text'
    }];
};

// export the class
module.exports = YR;
