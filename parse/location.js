const parseLocation = (ctx, l) => {
	const res = {
		type: 'location',
		latitude: l.lat,
		longitude: l.lon,
		id: l.id || l.stopId,
	};
	if (l.type == 'STOP' || l.stopId) {
		let s = {
			type: 'station',
			id: l.id || l.stopId,
			name: l.name,
			location: res,
		};
		return ctx.profile.enrichStation(ctx, s);
	}
	res.name = l.name;
	if (l.type == 'PLACE') {
		res.poi = true;
	}
	if (l.type == 'ADDRESS') {
		res.address = l.name; // TODO zip etc ?
	}
	return res;
};

const enrichStation = (ctx, stop, locations) => {
	const {common} = ctx;
	const locs = locations || common?.locations;
	const ifopt = ((stop.id + '_').split('_')[1] + '::').split(':')
		.slice(0, 3)
		.join(':');
	console.log(ifopt, Object.keys(locs)[0]);
	let rich = locs && locs[ifopt];
	if (rich) {
		stop.type = 'stop';
		stop.station = {...(rich.station || rich)};
		delete stop.station.lines;
		delete stop.station.facilities;
		delete stop.station.reisezentrumOpeningHours;
		if (stop.station.station) {
			delete stop.station.station;
		}
	}
	return stop;
};

export {
	parseLocation,
	enrichStation,
};
