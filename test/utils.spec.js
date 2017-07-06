import { expect } from 'chai';
const utils = require('../src/popup-prompt/utils');
const padLeft = utils.padLeft;
const toCurrency = utils.toCurrency;
const createElement = utils.createElement;

describe('utils', function () {

	describe('createElement', () => {

		it('creates given element type', () => {
			expect(createElement('div').tagName).to.equal('DIV');
			expect(createElement('section').tagName).to.equal('SECTION');
		});

		it('assigns attribute from given attribute hash', () => {
			expect(createElement('div', { 'data-foo': 'bar' }).getAttribute('data-foo')).to.equal('bar');
		});

		it('assigns innerHTML to given html', () => {
			const el = createElement('div', {}, '<strong>Foo</strong>');
			expect(el.children.length).to.equal(1);
			expect(el.children[0].tagName).to.equal('STRONG');
			expect(el.children[0].textContent).to.equal('Foo');
		});

	});

	describe('padLeft', () => {

		it('returns a string', () =>
			expect(padLeft('')).to.be.a('string')
		);

		it('adds 0s to string by length', () => {
			expect(padLeft('', 10)).to.equal('0000000000');
			expect(padLeft('foo', 10)).to.equal('0000000foo');
		});

		it('pad character can be overriden', () => {
			expect(padLeft('', 10, '!')).to.equal('!!!!!!!!!!');
			expect(padLeft('foo', 10, '!')).to.equal('!!!!!!!foo');
		});

	});

	describe('toCurrency', () => {

		it('returns a string', () =>
			expect(toCurrency(1000, 'GBP')).to.be.a('string')
		);

		it('returns a string representing amount as pence', () =>
			expect(toCurrency(1000, 'GBP')).to.contain('10.00')
		);

		it('does not do any rounding on large currency', () =>
			expect(toCurrency(1999, 'GBP')).to.contain('19.99')
		);

		it('rounds off any decimal points given', () =>
			expect(toCurrency(1999.65, 'GBP')).to.contain('20.00')
		);

		it('returns £ prefixed for GBP', () =>
			expect(toCurrency(1000, 'GBP')).to.equal('£10.00')
		);

		it('returns € prefixed for EUR', () =>
			expect(toCurrency(1000, 'EUR')).to.equal('€10.00')
		);

		it('returns $ prefixed for USD', () =>
			expect(toCurrency(1000, 'USD')).to.equal('$10.00')
		);

		it('returns $ prefixed for AUD', () =>
			expect(toCurrency(1000, 'AUD')).to.equal('$10.00')
		);

		it('returns $ prefixed for HKD', () =>
			expect(toCurrency(1000, 'HKD')).to.equal('$10.00')
		);

		it('returns $ prefixed for SGD', () =>
			expect(toCurrency(1000, 'SGD')).to.equal('$10.00')
		);

		it('returns ¥ prefixed for JPY, without decimals', () =>
			expect(toCurrency(1000, 'JPY')).to.equal('¥10')
		);

	});

});
