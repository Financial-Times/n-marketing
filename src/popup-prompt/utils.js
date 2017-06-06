const padLeft = (string, length, character = '0') => {
	string = String(string);
	if (string.length === length) {
		return string;
	}
	let newString = '';
	length -= string.length;
	while (length--) {
		newString += character;
	}
	return newString + string;
}

module.exports.getCookie = (key) => () => (document.cookie.match(`(^|;)\\s*${key}=([^;]+)`) || [])[2];

module.exports.createElement = (tag, attributes, html) => {
	const element = document.createElement(tag);
	Object.keys(attributes || {}).forEach((key) => element.setAttribute(key, attributes[key]));
	element.innerHTML = html;
	return element;
}

// use Number#toLocaleString when we drop Safari 9 support
module.exports.toCurrency = (amount, countryCode) => {
	const currencySymbol = {
		GBP: '£',
		EUR: '€',
		USD: '$',
		AUD: '$',
		HKD: '$',
		SGD: '$',
		JPY: '¥',
	}[countryCode] || countryCode;
	amount = Math.round(amount);
	let string = `${currencySymbol}${Math.floor(amount / 100)}`;
	if (countryCode !== 'JPY') {
		string += `.${padLeft(Math.floor(amount % 100), 2)}`;
	}
	return string;
}
