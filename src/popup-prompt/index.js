import * as utils from './utils';
import lionel from './lionel';

/*
Show the subscription offer prompt.
There are currently two offers:

 - "The Lionel Slider":
	 - OfferID:
		* USA: a9582121-87c2-09a7-0cc0-4caf594985d5
		* All: c1773439-53dc-df3d-9acc-20ce2ecde318
	 - Show if:
		* the barrier has been seen in this session
		* browser's' TLS version is > 1.0
		* this prompt has not been closed, or was last closed more than 30 days ago

General rules:
	- Show if:
		* not logged in
		* not on a barrier page
		* b2cMessagePrompt flag is true

This will make the general checks to decide if one of the sliders should
show and which one. And then allow the prompt logic to further decide.
*/

const isLoggedIn = utils.getCookie('FTSession');
const exclusions = ['.ft-subscription-panel', '.inline-barrier', '.sub-header--fastft'];

/*
@param {Object} flags -
*/
// TODO a11y: move focus to _any_ pop up
module.exports = function init ({flags, demoMode}) {
	if (demoMode) {
		return lionel.render('GBR', false, false);
	}
	const messagesEnabled = flags.get('b2cMessagePrompt');
	const isB2bUser = flags.get('b2bCommsCohort');
	const coexists = (elements) => elements.some(e => document.querySelector(e));
	const bottomMessagePresent = flags.get('messageSlotBottom');
	if (!isLoggedIn() && !isB2bUser && messagesEnabled && !coexists(exclusions) && !bottomMessagePresent) {
		return lionel.init(flags);
	}
};
