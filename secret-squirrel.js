module.exports = {
	files: {
		allow: [],
		allowOverrides: []
	},
	strings: {
		deny: [],
		denyOverrides: [
			'a9582121-87c2-09a7-0cc0-4caf594985d5', // src/popup-prompt/index.js:10, src/popup-prompt/lionel.js:162 old offerId for USA
			'c1773439-53dc-df3d-9acc-20ce2ecde318', // src/popup-prompt/index.js:11, src/popup-prompt/lionel.js:212
			'c1b046a6-4b46-dc66-9bed-9f77389b619a' // offerId for current USA banner src/popup-prompt/index.js:11, src/popup-prompt/lionel.js:210
		]
	}
};
