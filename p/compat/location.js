import distance from 'gps-distance';
import {enrichStation as basicEnrichStation} from '../../parse/location.js';


const enrichStation = (ctx, stop, locations) => {
	const {common} = ctx;
	const locs = locations || common?.locations;
	if (locs && locs[stop.name] && locs[stop.name].ts && locs[stop.name].ts + 1000 * 60 * 10 > Date.now()) {
		if (distance(locs[stop.name].location.latitude, locs[stop.name].location.longitude, stop.location.latitude, stop.location.longitude) * 1000 < 200) {
			let rich = locs[stop.name];
			stop = {
				...stop,
				id: rich.id,
			};
		}
	} else if (locs) {
		locs[stop.name] = {
			id: stop.id,
			location: stop.location,
			ts: Date.now(),
		};
	}
	return basicEnrichStation(ctx, stop, locations);
};

export {
	enrichStation,
};
