var mongoose = require('mongoose');

var Schema = mongoose.Schema({
    name: { type: String, required: true },
    crontime: { type: String, required: true },
    triggers: { type: Array },
    actions: { type: Array }
});

module.exports = mongoose.model('Scenario', Schema);