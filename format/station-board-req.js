
const formatStationBoardReq = (ctx, station, type) => {
	const {profile, opt} = ctx;
	return {
		query: {
			time: opt.when.toISOString(),
			stopId: station, 
			mode: profile.formatProductsFilter(ctx, opt.products || {}),
			n: opt.results || 10,
			radius: opt.includeRelatedStations ? 500 : undefined, 
			arriveBy: type == 'arrivals'
		}
	};
};

export {
	formatStationBoardReq,
};
