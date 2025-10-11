import distance from 'gps-distance';
import {enrichStation as basicEnrichStation} from '../../parse/location.js';


const enrichStation = (ctx, stop, locations) => {
	const {common} = ctx;
	const locs = locations || common?.locations;
	if (locs && locs[stop.name] && distance(locs[stop.name].location.latitude, locs[stop.name].location.longitude, stop.location.latitude, stop.location.longitude) * 1000 < 200) {
		let rich = locs[stop.name];
		delete stop.id;
		stop = {
			...rich,
			...stop,
		};
	} else if (!locs[stop.name]) {
		locs[stop.name] = stop;
	}
	return basicEnrichStation(ctx, stop, locations);
};

export {
	enrichStation,
};
