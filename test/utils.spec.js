import sinon from 'sinon';
import { expect } from 'chai';

const utils = require('../src/popup-prompt/utils');

describe('utils', function () {

	describe('toCurrency', function () {

		it('format a US currency', function () {
			const result = utils.toCurrency(429, 'USD');
			expect(result).to.eql('$4.29');
		});

	});

});
