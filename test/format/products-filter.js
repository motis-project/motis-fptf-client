import tap from 'tap';
import {formatProductsFilter as format} from '../../format/products-filter.js';

const products = [
	{
		id: 'nationalExpress',
		mode: 'train',
		name: 'High Speed Train',
		short: 'ICE',
		motis: 'HIGHSPEED_RAIL',
		default: true,
	},
	{
		id: 'national',
		mode: 'train',
		name: 'Long Distance Train',
		motis: 'LONG_DISTANCE',
		motis_alt: 'NIGHT_RAIL',
		default: true,
	},
	{
		id: 'regionalExpress',
		mode: 'train',
		name: 'Regional Express',
		motis: 'REGIONAL_FAST_RAIL',
		default: false,
	},
];

const ctx = {
	common: {},
	opt: {},
	profile: {products},
};

tap.test('formatProductsFilter works without customisations', (t) => {
	const expected = ['HIGHSPEED_RAIL', 'LONG_DISTANCE', 'NIGHT_RAIL'];
	const filter = {};
	t.same(format(ctx, filter), expected);
	t.end();
});
