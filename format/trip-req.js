
const formatTripReq = ({profile, opt}, id) => {
	const query = {
		tripId: id,
		detailedLegs: opt.polyline,
	};

	return {
		query,
	};
};

export {
	formatTripReq,
};
