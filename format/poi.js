const formatPoi = (p) => {
	// todo: use Number.isFinite()!
	if (p.type !== 'location' || !p.latitude || !p.longitude) {
		throw new TypeError('invalid POI');
	}
	return p.latitude + ',' + p.longitude;
};

export {
	formatPoi,
};
