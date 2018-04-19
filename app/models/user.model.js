'use strict';

const _ = require('lodash');

const UserSchema = new mongoose.Schema({
	email: mongoose.Schema.Types.String,
	password: mongoose.Schema.Types.String,
	traderName: mongoose.Schema.Types.String,
	referralCode: mongoose.Schema.Types.String,
	country: mongoose.Schema.Types.String,
	dob: mongoose.Schema.Types.String,
	firstName: mongoose.Schema.Types.String,
	lastName: mongoose.Schema.Types.String
}, {
	timestamps: true
});

UserSchema.methods.update = function(data) {
	this.email = data.email;
}

module.exports = mongoose.model('User', UserSchema);
module.exports.UserSchema = UserSchema;
