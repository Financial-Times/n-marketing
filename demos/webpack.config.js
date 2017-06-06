'use strict';

module.exports = {
	context: __dirname,
	entry: './src/demo.js',
	output: {
		path: __dirname + '/../public',
		filename: 'main.js'
	},
	resolve: {
		modules: [
			'bower_components',
			'node_modules'
		]
	}
}
