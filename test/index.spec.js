import sinon from 'sinon';
import { expect } from 'chai';
import proxyquire from 'proxyquire';

describe('index', function () {
	let utilsStub;
	let lionelStub;
	let index;


	beforeEach(function () {
		utilsStub = {
			toCurrency: sinon.stub()
		};
		lionelStub = sinon.stub();

		index = proxyquire('../src/popup-prompt/index', {
			'./utils': {
				default: () => {
					return utilsStub;
				}
			},
			'./lionel': {
				lionel: () => lionelStub
			}
		})

	});

	afterEach(function () {
		utilsStub = null;
		lionelStub.restore();
	});


	describe('init lionel', function () {

		it('should do what...', function (done) {

			index({flags:'', demoMode:true})

		});


	});

});
