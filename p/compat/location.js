import {enrichStation as basicEnrichStation} from '../../parse/location.js';


const enrichStation = (ctx, stop, locations) => {
	if (stop.station) {
		stop.id = stop.station.id;
	}
	return basicEnrichStation(ctx, stop, locations);
};

export {
	enrichStation,
};
