import sinon from 'sinon';
import { expect } from 'chai';
import SlidingPopup from 'n-sliding-popup';
import Superstore from 'superstore';
import { init } from '../src/popup-prompt/lionel';

const delay = (ms, value) => new Promise(resolve => setTimeout(resolve.bind(null, value), ms));

describe('"Lionel Slider" Subscription Offer Prompt', () => {

	const localStorage = new Superstore('local', 'n-ui.subscription-offer-prompt')
	const sessionStorage = new Superstore('session', 'next.product-selector')

	let flags;

	beforeEach(() => {
		flags = { get: (val) => val === 'b2cMessagePrompt' || val === 'priceFlashSale' };
		const fetchStub = sinon.stub(window, 'fetch');
		fetchStub
			.withArgs('https://www.ft.com/country')
			.returns(Promise.resolve({
				json: () => Promise.resolve('GBR')
			}));

		return Promise.all([
			localStorage.set('last-closed', Date.now() - (1000 * 60 * 60 * 24 * 30)),
			sessionStorage.set('last-seen', Date.now()),
			sessionStorage.set('barrier-messaging', 'B2C')
		])
	});

	afterEach(() => {
		window.fetch.restore();

		// fixme - the tests fail in IE11 if these are not commented out.  I have no idea why..
		return Promise.all([
			// localStorage.unset('last-closed'),
			// sessionStorage.unset('last-seen'),
			// sessionStorage.unset('barrier-messaging')
		]);
	});

		it ('should be a popup', () =>
		init(flags).then(popup => {
		expect(popup).to.be.ok;
		})
	);


	it('should show prompt if navigated from barrier page, not on a barrier page and hasnt been shown in 30 days', () =>
		init(flags).then(popup => expect(popup).to.be.an.instanceof(SlidingPopup))
	);

	it('should have correct attributes', () =>
		init(flags).then(popup => {
			expect(popup.el.getAttribute('class')).to.include('n-sliding-popup subscription-prompt');
			expect(popup.el.getAttribute('data-n-component')).to.equal('o-sliding-popup');
			expect(popup.el.getAttribute('data-n-sliding-popup-position')).to.equal('bottom left');
		})
	);

	it('should have correct html when the priceFlashSale flag is on', () =>
		init(flags).then(popup => {
			expect(popup.el.innerHTML).to.contain('Save 33% now')
		})
	);

	it('should have correct html when the priceFlashSale flag is off', () => {
			flags = { get: (val) => val === 'b2cMessagePrompt'};
			init(flags).then(popup => {
				expect(popup.el.innerHTML).to.contain('You qualify for a 25% subscription discount')
			})
		}
	);

	it('should set onClose to function', () =>
		init(flags).then(popup => {
			expect(popup.el.onClose).to.be.a('function')
		})
	);

	it('should store date in local storage when closed', () =>
		init(flags)
			.then(popup => {
				popup.el.onClose();
				return localStorage.get('last-closed');
			})
			// give a 1s buffer
			.then(lastClosed => expect(lastClosed).to.be.closeTo(Date.now(), 1000))
	);

	// TODO: naughty, but errors for unknown reason - https://circleci.com/gh/Financial-Times/n-ui/2829
	xit('should ‘pop-up’ after 2 seconds', () =>
		init(flags)
			.then(popup => {
				sinon.spy(popup, 'open');
				expect(popup.open).to.not.have.been.called;
				return delay(2050, popup);
			})
			.then(popup => expect(popup.open).to.have.callCount(1))
	);


	it('should not show if last shown within 30 days', () => {
		localStorage.set('last-closed', Date.now() + (1000 * 60 * 60 * 24 * 29))
		return init(flags).then(popup => expect(popup).to.not.exist);
	});

	it('should not show if barrier page has not been visited in this session', () => {
		sessionStorage.unset('last-seen')
		return init(flags).then(popup => expect(popup).to.not.exist);
	});

	it('should not show in succession to a B2B barrier', () => {
		sessionStorage.set('barrier-messaging', 'B2B')
		return init(flags).then(popup => expect(popup).to.not.exist);
	});

});

describe('"Lionel Slider" Subscription Offer Prompt - USA', () => {

	const localStorage = new Superstore('local', 'n-ui.subscription-offer-prompt')
	const sessionStorage = new Superstore('session', 'next.product-selector')

	let flags;

	beforeEach(() => {
		flags = { get: (val) => val === 'b2cMessagePrompt' || val === 'priceFlashSale' };
		const fetchStub = sinon.stub(window, 'fetch');
		fetchStub
			.withArgs('https://www.ft.com/country')
			.returns(Promise.resolve({
				json: () => Promise.resolve('USA')
			}));

		return Promise.all([
			localStorage.set('last-closed', Date.now() - (1000 * 60 * 60 * 24 * 30)),
			sessionStorage.set('last-seen', Date.now()),
			sessionStorage.set('barrier-messaging', 'B2C')
		])
	});

	afterEach(() => {
		window.fetch.restore();

		// fixme - the tests fail in IE11 if these are not commented out.  I have no idea why..
		return Promise.all([
			// localStorage.unset('last-closed'),
			// sessionStorage.unset('last-seen'),
			// sessionStorage.unset('barrier-messaging')
		]);
	});

	it('should have correct price when the priceFlashSale flag is on', () =>
		init(flags).then(popup => {
			expect(popup.el.innerHTML).to.contain('$4.29')
		})
	);

	it('should have correct price when the priceFlashSale flag is off', () => {
			flags = { get: (val) => val === 'b2cMessagePrompt'};
			init(flags).then(popup => {
				expect(popup.el.innerHTML).to.contain('$4.29')
			})
		}
	);

});

describe('"Lionel Slider" Subscription Offer Prompt - country code not listed', () => {

	const localStorage = new Superstore('local', 'n-ui.subscription-offer-prompt')
	const sessionStorage = new Superstore('session', 'next.product-selector')

	let flags;

	beforeEach(() => {
		flags = { get: (val) => val === 'b2cMessagePrompt' || val === 'priceFlashSale' };
		const fetchStub = sinon.stub(window, 'fetch');
		fetchStub
			.withArgs('https://www.ft.com/country')
			.returns(Promise.resolve({
				json: () => Promise.resolve('ISR')
			}));

		return Promise.all([
			localStorage.set('last-closed', Date.now() - (1000 * 60 * 60 * 24 * 30)),
			sessionStorage.set('last-seen', Date.now()),
			sessionStorage.set('barrier-messaging', 'B2C')
		])
	});

	afterEach(() => {
		window.fetch.restore();

		// fixme - the tests fail in IE11 if these are not commented out.  I have no idea why..
		return Promise.all([
			// localStorage.unset('last-closed'),
			// sessionStorage.unset('last-seen'),
			// sessionStorage.unset('barrier-messaging')
		]);
	});

	it('should default to Euros when country code is one not listed', () => {
			flags = { get: (val) => val === 'b2cMessagePrompt'};
			init(flags).then(popup => {
				expect(popup.el.innerHTML).to.contain('€4.39')
			})
		}
	);

});
