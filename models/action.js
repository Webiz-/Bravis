var mongoose = require('mongoose');

var Schema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    type: { type: String, required: true },
    options: {type: Object}
});

module.exports = mongoose.model('Action', Schema);