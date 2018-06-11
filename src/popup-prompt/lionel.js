import SlidingPopup from 'n-sliding-popup';
import Superstore from 'superstore';

import * as utils from './utils';
import { broadcast } from 'n-ui-foundations';

const promptLastSeenStorage = new Superstore('local', 'n-ui.subscription-offer-prompt');
const productSelectorStorage = new Superstore('session', 'next.product-selector');

const promptLastSeenStorageKey = 'last-closed';
const getPromptLastClosed = () => promptLastSeenStorage.get(promptLastSeenStorageKey);
const setPromptLastClosed = () => promptLastSeenStorage.set(promptLastSeenStorageKey, Date.now());

const getBarrierLastSeen = () => productSelectorStorage.get('last-seen');
const getBarrierMessaging = (flags) => flags.get('b2bCommsCohort') ? Promise.resolve('B2B') : productSelectorStorage.get('barrier-messaging');

/**
 * Show the prompt if
 *	* not logged in
 *	* not on a barrier page
 *	* the barrier has been seen in this session
 *	* the last barrier shown did not have B2B messaging
 *	* the prompt has not been closed, or was last closed more than 30 days ago
 */
const shouldPromptBeShown = (flags) => {
	return Promise.all([getBarrierLastSeen(), getBarrierMessaging(flags), getPromptLastClosed()])
			.then(([barrierLastSeen, barrierMessaging, promptLastClosed]) =>
				barrierLastSeen && barrierMessaging !=='B2B' && (!promptLastClosed || promptLastClosed + (1000 * 60 * 60 * 24 * 30) <= Date.now())
			);
};

const popupTemplate = ({ headingParagraph, heading, paragraph, buttonLabel, offerId, extraText = '' }) => `
		<div class="o-banner o-banner--small o-banner--marketing-secondary" data-o-component="o-banner">
		<div class="o-banner__outer">
			<div class="o-banner__inner" data-o-banner-inner="">
				<div class="o-banner__content o-banner__content--long">
					<header class="o-banner__heading">
						<p>${headingParagraph}</p>
						<h1>${heading}</h1>
					</header>
					<p>${paragraph}</p>
					<ul>
						<li>Global news and opinion from experts in 50+ countries</li>
						<li>Access on desktop and mobile</li>
						<li>Market-moving news, politics, tech, the arts and more</li>
					</ul>
				</div>
				<div class="o-banner__content o-banner__content--short">
					<header class="o-banner__heading">
						<p>${headingParagraph}</p>
						<h1>${heading}</h1>
					</header>
					<p>${paragraph}</p>
				</div>
				<div class="o-banner__actions">
					<div class="o-banner__action">
						<a href="https://www.ft.com/signup?offerId=${offerId}" class="o-banner__button subscription-prompt__subscribe-btn" data-trackable="subscribe">${buttonLabel}</a>
					</div>
				</div>
				<button class="n-sliding-popup-close" data-n-component="n-sliding-popup-close" data-trackable="close">
					<span class="n-sliding-popup-close-label">Close</span>
				</button>
				${extraText}
			</div>
		</div>
	</div>
	`;

const setTemplateContent = ({ discount, price, offerId, countryCode }) => {
	let headingParagraph;
	let heading;
	let paragraph;
	let buttonLabel;
	let extraText;

	if (countryCode.toLowerCase() === 'usa' ) {
		headingParagraph = 'Special US offer through July 31';
		heading = `Save over ${discount}%*`;
		paragraph = 'Pay only $12 per month for 12 months of Standard Digital access';
		buttonLabel = 'Subscribe';
		extraText = '<p class="remove-bottom-margin">*Available for new customers only</p>';
	} else {
		headingParagraph = 'Limited time only';
		heading = `You qualify for a special offer: Save ${discount}%`;
		paragraph = `Pay just ${price} per week for annual Digital access.`;
		buttonLabel = `Save ${discount}% now`;
	}

	return popupTemplate({ headingParagraph, heading, paragraph, buttonLabel, offerId, extraText });

};

const createPopupHTML = values =>
	utils.createElement('div', {
		'class': 'n-sliding-popup subscription-prompt',
		'data-n-component': 'o-sliding-popup',
		'data-n-sliding-popup-position': 'bottom left',
	}, setTemplateContent(values));


const createSubscriptionPrompt = values => {
	let focusedElementBeforePrompt;
	let focusableElementsStrings = ['.subscription-prompt__subscribe-btn', '.n-sliding-popup-close'];

	const subscriptionPrompt = createPopupHTML(values);
	let focusableElements = subscriptionPrompt.querySelectorAll(focusableElementsStrings);
	focusableElements = Array.prototype.slice.call(focusableElements);

	subscriptionPrompt.onClose = () => {
		setPromptLastClosed();
		broadcast('oTracking.event', {
			category: 'message',
			action: 'close',
			opportunity: {
				type: 'discount',
				subtype: 'slider_promo'
			},
			offers: [values.offerId]
		});

		if(focusedElementBeforePrompt !== undefined) {
			focusedElementBeforePrompt.focus();
		}
		subscriptionPrompt.removeEventListener('keydown', trapTab);
		focusableElements.forEach((elem) => {
			elem.setAttribute('tabindex', '-1');
		});
	};
	document.body.appendChild(subscriptionPrompt);

	let firstTabStop = focusableElements[0];
	let lastTabStop = focusableElements[focusableElements.length - 1];

	const trapTab = (e) => {
		if(e.keyCode === 9) { //TAB key
			if(e.shiftKey) {
				if(document.activeElement === firstTabStop) {
					e.preventDefault();
					lastTabStop.focus();
				}
			} else {
				if(document.activeElement === lastTabStop) {
					e.preventDefault();
					firstTabStop.focus();
				}
			}
		}

		if(e.keyCode === 27) { //ESC key
			slidingPopup.close();
		}
	};

	subscriptionPrompt.addEventListener('keydown', trapTab);
	const slidingPopup = new SlidingPopup(subscriptionPrompt);

	setTimeout(() => {
		slidingPopup.open();
		focusedElementBeforePrompt = document.activeElement;
		firstTabStop.focus();

		broadcast('oTracking.event', {
			category: 'message',
			action: 'show',
			opportunity: {
				type: 'discount',
				subtype: 'slider_promo'
			},
			offers: [values.offerId]
		});
	}, 2000);
	return slidingPopup;
};

const getPrice = (countryCode, withDiscount) => {
	let prices;
	if (withDiscount) {
		prices = {
			AUS: [429, 'AUD'],
			CAN: [429, 'USD'],
			CHE: [439, 'CHF'],
			GBR: [355, 'GBP'],
			HKG: [3295, 'HKD'],
			JPN: [583, 'JPN'],
			SGP: [555, 'SGD'],
			USA: [429, 'USD'],
			IND: [429, 'USD'],
			default: [395, 'EUR']
		};
	} else {
		prices = {
			AUS: [479, 'AUD'],
			CAN: [470, 'USD'], // This is different from API (479)
			CHE: [489, 'CHF'],
			GBR: [399, 'GBP'],
			HKG: [3690, 'HKD'], // This is different from API (3689)
			JPN: [65300, 'JPN'], // This is different from API (653)
			SGP: [619, 'SGD'],
			USA: [429, 'USD'],
			IND: [470, 'USD'],
			default: [439, 'EUR']
		};
	}
	return utils.toCurrency.apply(null, prices[countryCode] || prices.default);
};

const getSubscriptionPromptValues = (countryCode, withDiscount) => {
	const price = getPrice(countryCode, withDiscount);
	if (countryCode === 'USA' || withDiscount) {
		return { discount: 50, offerId: 'c1b046a6-4b46-dc66-9bed-9f77389b619a', price, countryCode };
	} else {
		return { discount: 25, offerId: 'c1773439-53dc-df3d-9acc-20ce2ecde318', price, countryCode };
	}
};

const render = (countryCode, withDiscount) => {
	// NOTE: for now, while pricing is inconsistent across slider, barrier and form, don't show it for these countries
	if (['SPM', 'ALA', 'BLM', 'MAF', 'AND', 'REU', 'GLP', 'MYT', 'MTQ', 'ZWE'].indexOf(countryCode) > -1) {
		return;
	}
	const subscriptionValues = getSubscriptionPromptValues(countryCode, withDiscount);
	return createSubscriptionPrompt(subscriptionValues);
};

const init = (flags) => {
	return shouldPromptBeShown(flags)
		.then(shouldShow => {
			if (shouldShow) {
				return fetch('https://www.ft.com/country', { credentials: 'same-origin' })
					.then(response => response.json())
					.then((countryCode = 'GBR') => {
						return render(countryCode, flags.get('priceFlashSale'));
					});
			}
		});
};

module.exports = {init, render};
