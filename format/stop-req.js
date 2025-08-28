
const formatStopReq = (ctx, stopRef) => {
	return {
		query: {
			stopId: stopRef,
			n: 0,
		},
	};
};

export {
	formatStopReq,
};
