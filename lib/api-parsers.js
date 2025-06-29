const parseArrayOr = (parseEntry) => {
	return (key, val) => {
		if (Array.isArray(val)) {
			return val.map(e => parseEntry(key, e));
		}
		return parseEntry(key, val);
	};
};

const mapRouteParsers = (route, parsers) => {
	return parsers;
};

export {
	mapRouteParsers,
	parseArrayOr,
};
