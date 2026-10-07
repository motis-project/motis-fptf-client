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
		if (l.parentId) {
			s.type = 'stop';
			s.station = {
				type: 'station',
				id: l.parentId,
				name: l.name,
				location: res,
			};
		}
		return ctx.profile.enrichStation(ctx, s);
	}
	res.name = l.name;
	if (l.type == 'PLACE') {
		res.poi = true;
	}
	res.address = parseLocationAreas(l);
	// TODO zip etc ?
	return res;
};

const enrichStation = (ctx, stop, locations) => {
	const {common} = ctx;
	const locs = locations || common?.locations;
	const ifopt = ((stop.id + '_').split('_')[1] + '::').split(':')
		.slice(0, 3)
		.join(':');
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

// stolen from https://github.com/motis-project/motis/blob/29d8a61ae5e8f549e3bbb2fca930461ea8fd1b4f/ui/src/lib/AddressTypeahead.svelte#L35
const parseLocationAreas = (l) => {
	if ((l.areas?.length ?? 0) === 0) {
		return undefined;
	}
	const matchedArea = l.areas.find((a) => a.matched);
	const defaultArea = l.areas.find((a) => a.default);
	if (matchedArea?.name.match(/^[0-9]*$/)) {
		matchedArea.name += ' ' + defaultArea?.name;
	}

	const areas = new Set();

	l.areas.forEach((a, i) => {
		if (a.matched || a.unique || a.default || a.adminLevel === 2 || a.adminLevel === 4) {
			if (a.name !== l.name) {
				areas.add(i);
			}
		}
	});

	const sorted = Array.from(areas);
	sorted.sort((a, b) => b - a);

	return sorted.map((a) => l.areas[a].name)
		.join(', ');
};

export {
	parseLocation,
	enrichStation,
};
