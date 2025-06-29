const formatAddress = (a) => {
	if (a.type !== 'location' || !a.latitude || !a.longitude) {
		throw new TypeError('invalid address');
	}
	return a.latitude+','+a.longitude;
};

export {
	formatAddress,
};
