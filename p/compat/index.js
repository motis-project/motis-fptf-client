import baseProfile from './base.json' with { type: 'json' };
import {products} from '../../lib/products.js';
import {enrichStation} from './location.js';

const profile = {
	...baseProfile,
	locale: 'en-EN',
	timezone: 'Europe/Berlin',

	baseUrl: process.env.MOTIS_BASE_URL || baseProfile.baseUrl,
	enrichStation,
	products,
};

export {
	profile,
};
