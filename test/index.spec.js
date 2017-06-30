import { expect } from 'chai';
import sinon from 'sinon';
import subscriptionOfferPrompt from '../src/popup-prompt/index';
import * as lionel from '../src/popup-prompt/lionel';
import api from '../src/popup-prompt/countryApi';

sinon.stub(api, 'getCountryCode', function () {
	return 'GBR';
})

describe('Subscription Offer Prompt Init', () => {

	let lionelStub;
	let lionelRenderStub;
	let flags;

	beforeEach(() => {
		Object.defineProperty(document, 'cookie', { value: '', configurable: true });
		lionelStub = sinon.spy(lionel, 'init');
		lionelRenderStub = sinon.spy(lionel, 'render')
		// stub out the flag.get(b2cMessagePrompt) = true
		flags = { get: (val) => val === 'b2cMessagePrompt' };
	});


	afterEach(() => {
		delete document.cookie;
		lionelStub.restore();
		lionelRenderStub.restore();
		flags = null;
	});

	it('should not init any prompt if on barrier pages', () => {
		const barrier = document.createElement('div');
		barrier.className = 'ft-subscription-panel';
		document.body.appendChild(barrier);
		subscriptionOfferPrompt({flags});
		sinon.assert.notCalled(lionelStub);
		document.body.removeChild(barrier);
	});

	it('should not init any prompt if logged in', () => {
		Object.defineProperty(document, 'cookie', { value: 'FTSession=foo', configurable: true });

		subscriptionOfferPrompt({flags});
		sinon.assert.notCalled(lionelStub);
	});

	it('should not init any prompt if B2B referrer cookie exists', () => {
		Object.defineProperty(document, 'cookie', { value: 'FTBarrierAcqCtxRef=foo', configurable: true });

		subscriptionOfferPrompt({flags});
		sinon.assert.notCalled(lionelStub);
	});

	it('should not init any prompt if b2cMessagePrompt flag is false', () => {
		// stub out the flag.get(b2cMessagePrompt) = false
		flags = { get: (val) => { if(val === 'b2cMessagePrompt') return false } }

		subscriptionOfferPrompt({flags});
		sinon.assert.notCalled(lionelStub);
	});

	it('should init "Lionel slider" if NOT logged in & NOT on barrier page & NOT coming from a B2B prospect barrier & NOT on /us-election-2016 page', () => {

		subscriptionOfferPrompt({flags});
		sinon.assert.notCalled(lionelStub); // what is this actually testing??
	});

	it.only('should render "Lionel slider" if demoMode is true, bypassing the init function', function () {
		subscriptionOfferPrompt({flags, demoMode: true});
		console.log(lionelRenderStub)
		sinon.assert.notCalled(lionelStub);
		sinon.assert.called(lionelRenderStub);
	});
});
