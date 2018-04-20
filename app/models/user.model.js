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
	lastName: mongoose.Schema.Types.String,
	verifyLink: mongoose.Schema.Types.String,
	verificationLevel: {type: mongoose.Schema.Types.Number, default: 0 }
}, {
	timestamps: true
});

UserSchema.methods.update = function(data) {
	let keys = Object.keys(data)
	if (keys.includes('traderName'))
		this.verificationLevel = 2;
	keys.forEach(key => {
		this[key] = data[key]
	})
}

UserSchema.methods.verifyEmail = function() {
	this.verificationLevel = 1;
	this.verifyLink = undefined;
}

module.exports = mongoose.model('User', UserSchema);
module.exports.UserSchema = UserSchema;
