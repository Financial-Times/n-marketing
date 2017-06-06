include n.Makefile

# unit-test:
	# mocha 'test/*.spec.js' --recursive --inline-diffs

demo-build:
	@node-sass demos/src/demo.scss public/main.css --include-path bower_components
	webpack --config demos/webpack.config.js
	@$(DONE)

demo: demo-build
	@node demos/app
