import baseProfile from './base.json' with { type: 'json' };
import {products} from '../../lib/products.js';

const profile = {
	...baseProfile,
	locale: 'en-EN',
	timezone: 'Europe/Berlin',

	products,
};

export {
	profile,
};
