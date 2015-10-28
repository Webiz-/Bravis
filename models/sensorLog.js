var mongoose = require('mongoose');

var Schema = mongoose.Schema({
    sensorId: { type: String, required: true },
    year: { type: String },
    month: { type: String },
    data: { type: Array }
});

module.exports = mongoose.model('SensorLog', Schema);
