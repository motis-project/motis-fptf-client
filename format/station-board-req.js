
const formatStationBoardReq = (ctx, station, type) => {
	const {profile, opt} = ctx;
	return {
		query: {
			time: opt.when.toISOString(),
			stopId: station,
			mode: profile.formatProductsFilter(ctx, opt.products || {}),
			radius: opt.includeRelatedStations ? 300 : undefined,
			arriveBy: type == 'arrivals',
			direction: 'LATER',
			window: opt.duration * 60,
		},
	};
};

export {
	formatStationBoardReq,
};
