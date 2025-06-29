
const formatNearbyReq = (ctx, location) => {
	throw new Error('NotImplemented');
	

	const {profile, opt} = ctx;
	if (opt.distance > 10000) {
		throw new Error('maximum supported distance by this endpoint is 10000');
	}
	// TODO location types
	return {
		endpoint: profile.nearbyEndpoint,
		body: {
			area: {
				coordinates: {
					longitude: location.longitude,
					latitude: location.latitude,
				},
				radius: opt.distance || 10000,
			},
			maxResults: opt.results,
			products: profile.formatProductsFilter(ctx, opt.products || {}, 'dbnav'),
		},
		headers: getHeaders('application/x.db.vendo.mob.location.v3+json'),
		method: 'post',
	};
};

export {
	formatNearbyReq,
};
