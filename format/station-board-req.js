
const formatStationBoardReq = (ctx, station, type) => {
	const {profile, opt} = ctx;
	return {
		query: {
			time: opt.when.toISOString(),
			stopId: station,
			mode: profile.formatProductsFilter(ctx, opt.products || {}),
			n: opt.results || 250,
			radius: opt.includeRelatedStations ? 500 : undefined,
			arriveBy: type == 'arrivals',
			direction: 'LATER',
		},
	};
};

export {
	formatStationBoardReq,
};
