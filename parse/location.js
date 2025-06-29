const parseLocation = (ctx, l) => {
	const {profile} = ctx;
	const res = {
		type: 'location',
		latitude: l.lat,
		longitude: l.lon,
		id: l.id || l.stopId,
	};
	if (l.type == 'STOP' || l.stopId) {
		return {
			type: 'station',
			id: l.id || l.stopId,
			name: l.name,
			location: res
		};
	}
	res.name = l.name;
	if (l.type == 'PLACE') {
		res.poi = true;
	}
	if (l.type == 'ADDRESS') {
		res.address = l.name; // TODO zip etc ?
	}
	return res;
}

const enrichStation = (ctx, stop, locations) => {
	// TODO
	const {common} = ctx;
	const locs = locations || common?.locations;
	const rich = locs && (locs[stop.id] || locs[stop.name]);
	if (rich) {
		delete stop.type;
		delete stop.id;
		stop = {
			...rich,
			...stop,
		};
		delete stop.lines;
		delete stop.facilities;
		delete stop.reisezentrumOpeningHours;
		if (stop.station) {
			stop.station = {...stop.station};
			delete stop.station.lines;
			delete stop.station.facilities;
			delete stop.station.reisezentrumOpeningHours;
		}
	}
	return stop;
};

export {
	parseLocation,
	enrichStation,
};
