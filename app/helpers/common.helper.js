'use strict';

const shortid = require('short-id');
const nodemailer = require('nodemailer');

shortid.configure({
	length: 5
});

let generateShortId = function() {
	return shortid.generate();
};

let validateEmail = function(email) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

let validatePassword = function(password) {
	if (password.length < 6)
		return false
	return true
}

let sendEmail = async function(message) {
	return new Promise((resolve, reject) => {
		let nodemailer = require('nodemailer');
		let transporter = nodemailer.createTransport({
				service: 'Gmail',
				auth: {
						user: 'hanschen812@gmail.com',
						pass: 'iambug123'
				}
		});

		let mailOptions = {
				from: 'hanschen812@gmail.com', // sender address
				to: message.recipe, // list of receivers
				subject: message.subject, // Subject line
				html: message.content // html body
		};

		transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					console.log(error);
					reject(error);
				} else {
					console.log('Message sent: %s', info.messageId);
					console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
					resolve('email sent')
				}
		});
	})
}

module.exports = {
	generateShortId,
	validateEmail,
	validatePassword,
	sendEmail
}
