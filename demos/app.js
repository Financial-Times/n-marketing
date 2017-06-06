'use strict';

const express = require('@financial-times/n-internal-tool');

const app = module.exports = express({
	name: 'public',
	systemCode: 'n-marketing-demo',
	withFlags: false,
	withHandlebars: true,
	withNavigation: false,
	withAnonMiddleware: false,
	hasHeadCss: false,
	viewsDirectory: '/demos/templates',
	partialsDirectory: process.cwd(),
	directory: process.cwd(),
	demo: true,
	s3o: false,
});

app.get('/', (req, res) => {
	res.render('index',{layout: 'wrapper'});
});

const PORT = process.env.PORT || 5005;

const listen = app.listen(PORT);

listen
	.then(() => console.log(`demo running on port ${PORT}`))
	.catch(error => console.log(error));
