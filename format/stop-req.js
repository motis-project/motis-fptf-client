
const formatStopReq = (ctx, stopRef) => {
	throw new Error('NotImplemented');

	const {profile} = ctx;

	return {
		endpoint: profile.stopEndpoint,
		path: stopRef,
		headers: getHeaders('application/x.db.vendo.mob.location.v3+json'),
		method: 'get',
	};
};

export {
	formatStopReq,
};
