import distance from 'gps-distance';

const parseJourneyLeg = (ctx, pt, date) => { // pt = raw leg
	const { profile, opt } = ctx;

	const res = {
		origin: profile.parseLocation(ctx, pt.from),
		destination: profile.parseLocation(ctx, pt.to),
	};

	const cancelledDep = profile.parseCancelled(pt.from);
	const dep = profile.parseWhen(ctx, date, pt.scheduledStartTime, pt.realTime ? pt.startTime : null, cancelledDep);
	res.departure = dep.when;
	res.plannedDeparture = dep.plannedWhen;
	res.departureDelay = dep.delay;
	if (dep.prognosedWhen) {
		res.prognosedDeparture = dep.prognosedWhen;
	}

	const cancelledArr = profile.parseCancelled(pt.to);
	const arr = profile.parseWhen(ctx, date, pt.scheduledEndTime, pt.realTime ? pt.endTime : null, cancelledArr);
	res.arrival = arr.when;
	res.plannedArrival = arr.plannedWhen;
	res.arrivalDelay = arr.delay;
	if (arr.prognosedWhen) {
		res.prognosedArrival = arr.prognosedWhen;
	}

	if (opt.polylines || opt.polyline) {
		res.polyline = profile.parsePolyline(ctx, pt.legGeometry);
	}

	const type = pt.mode;
	if (type == 'WALK') {
		res.public = true;
		res.walking = true;
		res.distance = pt.distance || Math.max(50, 1000 * distance(res.origin.latitude || res.origin.location?.latitude, res.origin.longitude || res.origin.location?.longitude, res.destination.latitude || res.destination.location?.latitude, res.destination.longitude || res.destination.location?.longitude));
	} else {
		res.tripId = pt.tripId;
		res.line = profile.parseLine(ctx, pt) || null;
		res.direction = pt.headsign;

		const arrPl = profile.parsePlatform(ctx, pt.to.scheduledTrack, pt.to.track, cancelledArr);
		res.arrivalPlatform = arrPl.platform;
		res.plannedArrivalPlatform = arrPl.plannedPlatform;
		if (arrPl.prognosedPlatform) {
			res.prognosedArrivalPlatform = arrPl.prognosedPlatform;
		}

		const depPl = profile.parsePlatform(ctx, pt.from.scheduledTrack, pt.from.track, cancelledDep);
		res.departurePlatform = depPl.platform;
		res.plannedDeparturePlatform = depPl.plannedPlatform;
		if (depPl.prognosedPlatform) {
			res.prognosedDeparturePlatform = depPl.prognosedPlatform;
		}

		if (opt.stopovers && pt.intermediateStops && pt.intermediateStops.length) {
			res.stopovers = pt.intermediateStops.map(s => profile.parseStopover(ctx, s, date));
			// filter stations the train passes without stopping, as this doesn't comply with fptf (yet)
			res.stopovers = res.stopovers.filter((x) => !x.passBy);
		}
		if (opt.remarks) {
			res.remarks = profile.parseRemarks(ctx, pt);
		}

		// TODO cycle, alternatives
	}

	if (cancelledDep || cancelledArr || pt.cancelled || pt.canceled) {
		res.cancelled = true;
		Object.defineProperty(res, 'canceled', { value: true });
	}
	return res;
};

export {
	parseJourneyLeg,
};
