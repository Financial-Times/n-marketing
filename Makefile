include n.Makefile

unit-test:
	mocha --require test/setup 'test/*.spec.js' --recursive --inline-diffs

demo-build:
	webpack --config demos/webpack.config.js
	@$(DONE)

demo: demo-build
	@node demos/app
