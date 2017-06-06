const popupPrompt = require('../../src/popup-prompt');

const flags = {
	get: (str) => str === 'b2cMessagePrompt'
};

popupPrompt({flags, demoMode: true});
