import {parseBoolean} from 'hafas-rest-api/lib/parse.js';

const parseArrayOr = (parseEntry) => {
	return (key, val) => {
		if (Array.isArray(val)) {
			return val.map(e => parseEntry(key, e));
		}
		return parseEntry(key, val);
	};
};

const mapRouteParsers = (route, parsers) => {
	if (route.includes('journey')) {
		return {
			...parsers,
			noCompulsoryReservation: {
				description: 'Only return journeys that without compulsory reservation',
				type: 'boolean',
				default: false,
				parse: parseBoolean,
			},
		};
	}
	return parsers;
};

export {
	mapRouteParsers,
	parseArrayOr,
};
