const ARRIVAL = 'a';
const DEPARTURE = 'd';

const createParseArrOrDep = (prefix) => {
	if (prefix !== ARRIVAL && prefix !== DEPARTURE) {
		throw new Error('invalid prefix');
	}

	const parseArrOrDep = (ctx, d) => { // d = raw arrival/departure

		
		const {profile, opt} = ctx;
		const cancelled = profile.parseCancelled(d);
		const res = {
			tripId: d.tripId,
			stop: profile.parseLocation(ctx, d.place),
			...profile.parseWhen(
				ctx,
				null,
				prefix == ARRIVAL ? d.place.scheduledArrival : d.place.scheduledDeparture,
				d.realTime ? (prefix == ARRIVAL ? d.place.arrival : d.place.departure) : null,
				cancelled),
			...profile.parsePlatform(ctx, d.place.scheduledTrack, d.place.track, cancelled),
			direction: d.headsign,
			provenance: null,
			line: profile.parseLine(ctx, d) || null,
			remarks: [],
			origin: null,
			destination: null,
			// loadFactor: profile.parseArrOrDepWithLoadFactor(ctx, d)
		};

		if (cancelled) {
			res.cancelled = true;
			Object.defineProperty(res, 'canceled', {value: true});
		}

		if (opt.remarks) {
			res.remarks = profile.parseRemarks(ctx, d, prefix == ARRIVAL);
		}
		console.log(res);

		// TODO stopovers
		return res;
	};

	return parseArrOrDep;
};

export {
	createParseArrOrDep,
};
