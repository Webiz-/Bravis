var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

var Account = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String}
});

Account.plugin(passportLocalMongoose);

// Seed a user
module.exports = mongoose.model('Account', Account);
