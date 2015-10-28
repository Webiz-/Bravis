var SensorLog = require('../../models/sensorLog.js'),
    util = require('../../lib/util');

function Abstract(model) {
    'use strict';

    this.model = model;
}


Abstract.prototype.setModelLog = function (modelLog) {
    'use strict';

    this.modelLog = modelLog;

    return this;
};

Abstract.prototype.getModelLog = function () {
    'use strict';

    return this.modelLog;
};

//should get from object extended
Abstract.prototype.save = function (data, callback) {
    'use strict';

    var sensorIdentifier = {
        sensorId: this.model._id,
        year: new Date().getFullYear(),
        month: util.addZero(new Date().getMonth() + 1)
    };

    SensorLog.findOne(sensorIdentifier, function (err, doc) {

        if (!doc) {
            doc = new SensorLog(sensorIdentifier);
            doc.data = [];
        }

        //push new data an the model
        doc.data.push({
            time: Date.now(),
            state: data.state,
            value: data.value
        });

        doc.save(function (err) {
            if (err) {
                console.error('ERROR!');
            }

            callback();
        });
    });
};

Abstract.prototype.getState = function (value) {
    'use strict';

    var state = false;

    switch(this.model.condition) {
        case '>':
            state = value > this.model.trigger;
            break;
        case '<':
            state = value < this.model.trigger;
            break;
        case '==':
            state = value === this.model.trigger;
            break;
        case '!=':
            state = value !== this.model.trigger;
            break;
        case '>=':
            state = value >= this.model.trigger;
            break;
        case '<=':
            state = value <= this.model.trigger;
            break;
        default:
            state = value > this.model.trigger;
            break;
    }

    return state;

};

/**
 * Return the chart object
 * @returns {Object} - The chart object
 */
Abstract.prototype.toChart = function () {
    'use strict';

    var categories = [];
    var values = [];

    function formatDate(timestamp) {
        var date = new Date(timestamp);
        var dd = date.getDate();
        var mm = date.getMonth() + 1; //January is 0!
        var yyyy = date.getFullYear();
        var hours = date.getHours();
        var minutes = date.getMinutes();

        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0 ' + mm;
        }

        return mm + '/' + dd + '/' + yyyy + ' ' + hours + ':' + minutes;
    }

    if (this.getModelLog()) {
        this.getModelLog().data.forEach(function (point) {
            categories.push(formatDate(point.time));
            values.push({
                y: parseInt(point.value, 10),
                color: point.state ? '#2E7D32' : '#C62828'
            });
        });
    }

    return {
        title: {
            text: ''
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            min: 0,
            gridLineColor: '#197F07',
            gridLineWidth: 0,
            lineWidth: 1,
            plotLines: [{
                color: '#d84315',
                width: 1,
                value: this.model.trigger,
                dashStyle: 'dash'
            }, {
                color: '#000000',
                width: 1,
                value: 0
            }]
        },
        credits: {
            enabled: false
        },
        series: [{
            type: 'column',
            name: 'Value',
            data: values
        }]
    };
};

/**
 * Get the last value from the database
 */
Abstract.prototype.getLastValue = function () {
    'use strict';

    return this.getModelLog() && this.getModelLog().data && this.getModelLog().data[0] || null;
};

/**
 * Retrieve all the Options to configure the devices
 * @returns {Array}
 */
Abstract.prototype.getOptions = function () {
    'use strict';

    return [];

};

Abstract.prototype.sync = function (callback) {
    'use strict';

    callback({
        value: false,
        state: false
    });
};

module.exports = Abstract;
