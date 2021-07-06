const functions = require('firebase-functions');
const fs = require('fs');

let config;
if (process.env.NODE_ENV !== 'production') {
	config = functions.config().env;
} else {
	config = functions.config().prod;
}

if (process.env.NODE_ENV !== 'production') {
	if (fs.existsSync('./env.json')) {
		const env = require('./env.json');

		config = env;
	}
} else if (process.env.NODE_ENV === 'production') {
	if (fs.existsSync('./prod.json')) {
		const env = require('./prod.json');

		config = env;
	}
}

module.exports = config;
