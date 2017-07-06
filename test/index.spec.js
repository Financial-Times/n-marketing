import { expect } from 'chai';
import sinon from 'sinon';
import subscriptionOfferPrompt from '../src/popup-prompt/index';
import api from '../src/popup-prompt/countryApi';


sinon.stub(api, 'getCountryCode', function () {
	return 'GBR';
});

describe('Subscription Offer Prompt Init', () => {

	let flags;

	beforeEach(() => {
		Object.defineProperty(document, 'cookie', { value: '', configurable: true });
		// stub out the flag.get(b2cMessagePrompt) = true
		flags = { get: (val) => val === 'b2cMessagePrompt' };
	});


	afterEach(() => {
		delete document.cookie;
		flags = null;
	});

	it('should not init any prompt if on barrier pages', () => {
		const barrier = document.createElement('div');
		barrier.className = 'ft-subscription-panel';
		document.body.appendChild(barrier);
		subscriptionOfferPrompt({flags});
		expect(document.body.innerHTML).to.not.contain('subscription-prompt--flag');
		document.body.removeChild(barrier);
	});

	it('should not init any prompt if logged in', () => {
		Object.defineProperty(document, 'cookie', { value: 'FTSession=foo', configurable: true });

		subscriptionOfferPrompt({flags});
		expect(document.body.innerHTML).to.not.contain('subscription-prompt--flag');
	});

	it('should not init any prompt if B2B referrer cookie exists', () => {
		Object.defineProperty(document, 'cookie', { value: 'FTBarrierAcqCtxRef=foo', configurable: true });

		subscriptionOfferPrompt({flags});
		expect(document.body.innerHTML).to.not.contain('subscription-prompt--flag');
	});

	it('should not init any prompt if b2cMessagePrompt flag is false', () => {
		// stub out the flag.get(b2cMessagePrompt) = false
		flags = { get: (val) => { if(val === 'b2cMessagePrompt') return false } }
		subscriptionOfferPrompt({flags});
		expect(document.body.innerHTML).to.not.contain('subscription-prompt--flag');
	});

	it('should render "Lionel slider" if demoMode is true', function () {
		subscriptionOfferPrompt({flags, demoMode: true});
		expect(document.body.innerHTML).to.contain('subscription-prompt--flag');
	});
});
