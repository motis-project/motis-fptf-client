const formatJourneysReq = (ctx, from, to, when, outFrwd, journeysRef) => {
	const {profile, opt} = ctx;

	from = profile.formatLocation(profile, from, 'from');
	to = profile.formatLocation(profile, to, 'to');
	const filters = profile.formatProductsFilter({profile}, opt.products || {}, 'motis');
	// TODO routingMode
	const query = {
		fromPlace: from,
		toPlace: to,
		via: opt.via
				? [profile.formatLocation(profile, opt.via, 'opt.via')]
				: undefined,
		time: when.toISOString(),
		maxTransfers: opt.transfers == -1 ? undefined: opt.transfers,
		minTransferTime: opt.transferTime || undefined,
		detailedTransfers: false,
		transitModes: filters,
		numItineraries: opt.results,
		pageCursor: journeysRef,
		arriveBy: !outFrwd,
		requireBikeTransport: opt.bike,
		// walkingSpeed
		pedestrianProfile: opt.accessibility == 'none' ? 'FOOT' : 'WHEELCHAIR'
	};
	// TODO opt.notOnlyFastRoutes
	return {
		query: query,
	};
};

const formatRefreshJourneyReq = (ctx, refreshToken) => {
	throw new Error('NotImplemented');
};

export {
	formatJourneysReq,
	formatRefreshJourneyReq,
};
