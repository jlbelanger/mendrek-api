require('babel-register')({
	presets: ['env'],
});

module.exports = require('./bin/www'); // eslint-disable-line import/extensions
