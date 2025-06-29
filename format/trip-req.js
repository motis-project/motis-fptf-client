
const formatTripReq = ({profile, opt}, id) => {
	throw new Error('NotImplemented');

	return {
		endpoint: profile.tripEndpoint,
		path: encodeURIComponent(id),
		headers: getHeaders('application/x.db.vendo.mob.zuglauf.v2+json'),
		method: 'get',
	};
};

export {
	formatTripReq,
};
