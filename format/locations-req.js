
const formatLocationsReq = (ctx, query) => {
	const {profile, opt} = ctx;

	let type = undefined;
	if (opt.stops && !opt.addresses && !opt.poi) {
		type = 'STOP';
	}
	if (!opt.stops && opt.addresses && !opt.poi) {
		type = 'ADDRESS';
	}
	if (!opt.stops && !opt.addresses && opt.poi) {
		type = 'PLACE';
	}

	return {
		query: {
			text: query,
			language: opt.language,
			type: type
		},
	};
};

export {
	formatLocationsReq,
};
