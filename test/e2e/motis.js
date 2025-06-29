import tap from 'tap';
import isRoughlyEqual from 'is-roughly-equal';

import {createWhen} from './lib/util.js';
import {createClient} from '../../index.js';
import {profile as tProfile} from '../../p/transitous/index.js';
import {
	createValidateStation,
	createValidateTrip,
} from './lib/validators.js';
import {createValidateFptfWith as createValidate} from './lib/validate-fptf-with.js';
import {testJourneysStationToStation} from './lib/journeys-station-to-station.js';
import {testJourneysStationToAddress} from './lib/journeys-station-to-address.js';
import {testJourneysStationToPoi} from './lib/journeys-station-to-poi.js';
import {testEarlierLaterJourneys} from './lib/earlier-later-journeys.js';
import {testLegCycleAlternatives} from './lib/leg-cycle-alternatives.js';
import {testRefreshJourney} from './lib/refresh-journey.js';
import {journeysFailsWithNoProduct} from './lib/journeys-fails-with-no-product.js';
import {testDepartures} from './lib/departures.js';
import {testArrivals} from './lib/arrivals.js';
import {testJourneysWithDetour} from './lib/journeys-with-detour.js';
import {testReachableFrom} from './lib/reachable-from.js';

const isObj = o => o !== null && 'object' === typeof o && !Array.isArray(o);
const minute = 60 * 1000;

const T_MOCK = 1756456784 * 1000; // Fri Aug 29 2025 08:39:44 GMT+0000
const when = createWhen(tProfile.timezone, tProfile.locale, T_MOCK);

const cfg = {
	when,
	stationCoordsOptional: true, // TODO
	products: tProfile.products,
	minLatitude: 46.673100,
	maxLatitude: 55.030671,
	minLongitude: 6.896517,
	maxLongitude: 16.180237,
};

const validate = createValidate(cfg);

const assertValidPrice = (t, p) => {
	t.ok(p);
	if (p.amount !== null) {
		t.equal(typeof p.amount, 'number');
		t.ok(p.amount > 0);
	}
	if (p.hint !== null) {
		t.equal(typeof p.hint, 'string');
		t.ok(p.hint);
	}
};

const assertValidTickets = (test, tickets) => {
	test.ok(Array.isArray(tickets));
	for (let fare of tickets) {
		test.equal(typeof fare.name, 'string', 'Mandatory field "name" is missing or not a string');
		test.ok(fare.name);

		test.ok(isObj(fare.priceObj), 'Mandatory field "priceObj" is missing or not an object');
		test.equal(typeof fare.priceObj.amount, 'number', 'Mandatory field "amount" in "priceObj" is missing or not a number');
		test.ok(fare.priceObj.amount > 0);
		if ('currency' in fare.priceObj) {
			test.equal(typeof fare.priceObj.currency, 'string');
		}

		// Check optional fields
		if ('addData' in fare) {
			test.equal(typeof fare.addData, 'string');
		}
		if ('addDataTicketInfo' in fare) {
			test.equal(typeof fare.addDataTicketInfo, 'string');
		}
		if ('addDataTicketDetails' in fare) {
			test.equal(typeof fare.addDataTicketDetails, 'string');
		}
		if ('addDataTravelInfo' in fare) {
			test.equal(typeof fare.addDataTravelInfo, 'string');
		}
		if ('addDataTravelDetails' in fare) {
			test.equal(typeof fare.firstClass, 'boolean');
		}
	}
};

const client = createClient(tProfile, 'public-transport/hafas-client:test', {enrichStations: true});

const berlinHbf = 'de-DELFI_de:11000:900003200:1:50';
const münchenHbf = 'de-DELFI_de:09162:100';
const jungfernheide = 'de-DELFI_de:11000:900020201';
const blnSchwedterStr = 'de-DELFI_de:11000:900110505::3';
const westhafen = 'de-VBB_de:11000:900001201:1:51';
const wedding = 'de-VBB_de:11000:900009104:1:51';
const württembergallee = 'de-DELFI_de:11000:900026153::1';
const regensburgHbf = '8000309';
const blnOstbahnhof = '8010255';
const blnTiergarten = '8089091';
const blnJannowitzbrücke = '8089019';
const potsdamHbf = '8012666';
const berlinSüdkreuz = '8011113';
const kölnHbf = '8000207';


tap.test('journeys – Berlin Schwedter Str. to München Hbf', async (t) => {
	const res = await client.journeys(blnSchwedterStr, münchenHbf, {
		results: 4,
		departure: when,
		stopovers: true,
	});

	await testJourneysStationToStation({
		test: t,
		res,
		validate,
		fromId: blnSchwedterStr,
		toId: münchenHbf,
	});
	// todo: find a journey where there pricing info is always available
	for (let journey of res.journeys) {
		if (journey.price) {
			assertValidPrice(t, journey.price);
		}
		if (journey.tickets) {
			assertValidTickets(t, journey.tickets);
		}
	}
	t.end();
});

tap.skip('refreshJourney – valid tickets', async (t) => {
	const T_MOCK = 1710831600 * 1000; // 2024-03-19T08:00:00+01:00
	const when = createWhen(tProfile.timezone, tProfile.locale, T_MOCK);

	const journeysRes = await client.journeys(berlinHbf, münchenHbf, {
		results: 4,
		departure: when,
		stopovers: true,
	});
	const refreshWithoutTicketsRes = await client.refreshJourney(journeysRes.journeys[0].refreshToken, {
		tickets: false,
	});
	const refreshWithTicketsRes = await client.refreshJourney(journeysRes.journeys[0].refreshToken, {
		tickets: true,
	});
	for (let res of [refreshWithoutTicketsRes, refreshWithTicketsRes]) {
		if (res.journey.tickets !== undefined) {
			assertValidTickets(t, res.journey.tickets);
		}
	}

	t.end();
});

// todo: journeys, only one product

tap.test('journeys – fails with no product', async (t) => {
	await journeysFailsWithNoProduct({
		test: t,
		fetchJourneys: client.journeys,
		fromId: blnSchwedterStr,
		toId: münchenHbf,
		when,
		products: tProfile.products,
	});
	t.end();
});

tap.test('Berlin Schwedter Str. to Torfstraße 17', async (t) => {
	const torfstr = {
		type: 'location',
		address: 'Torfstraße 17',
		latitude: 52.5416823,
		longitude: 13.3491223,
	};
	const res = await client.journeys(blnSchwedterStr, torfstr, {
		results: 3,
		departure: when,
	});

	await testJourneysStationToAddress({
		test: t,
		res,
		validate,
		fromId: blnSchwedterStr,
		to: torfstr,
	});
	t.end();
});

tap.test('Berlin Schwedter Str. to ATZE Musiktheater', async (t) => {
	const atze = {
		type: 'location',
		id: '991598902',
		poi: true,
		name: 'Berlin, Atze Musiktheater für Kinder (Kultur und U',
		latitude: 52.542417,
		longitude: 13.350437,
	};
	const res = await client.journeys(blnSchwedterStr, atze, {
		results: 3,
		departure: when,
	});

	await testJourneysStationToPoi({
		test: t,
		res,
		validate,
		fromId: blnSchwedterStr,
		to: atze,
	});
	t.end();
});

tap.skip('journeys: via works – with detour', async (t) => {
	// Going from Westhafen to Wedding via Württembergallee without detour
	// is currently impossible. We check if the routing engine computes a detour.
	const res = await client.journeys(westhafen, wedding, {
		via: württembergallee,
		results: 1,
		departure: when,
		stopovers: true,
	});

	await testJourneysWithDetour({
		test: t,
		res,
		validate,
		detourIds: [württembergallee],
	});
	t.end();
});

// todo: walkingSpeed "Berlin - Charlottenburg, Hallerstraße" -> jungfernheide
// todo: without detour


// todo: with the DB endpoint, earlierRef/laterRef is missing queries many days in the future
tap.skip('earlier/later journeys, Jungfernheide -> München Hbf', async (t) => {
	await testEarlierLaterJourneys({
		test: t,
		fetchJourneys: client.journeys,
		validate,
		fromId: jungfernheide,
		toId: münchenHbf,
		when,
	});

	t.end();
});

if (!process.env.VCR_MODE) {
	tap.test('journeys – leg cycle & alternatives', async (t) => {
		await testLegCycleAlternatives({
			test: t,
			fetchJourneys: client.journeys,
			fromId: blnTiergarten,
			toId: blnJannowitzbrücke,
			when,
		});
		t.end();
	});
}

tap.skip('refreshJourney', async (t) => {
	const T_MOCK = 1710831600 * 1000; // 2024-03-19T08:00:00+01:00
	const when = createWhen(tProfile.timezone, tProfile.locale, T_MOCK);
	const validate = createValidate({...cfg, when});

	await testRefreshJourney({
		test: t,
		fetchJourneys: client.journeys,
		refreshJourney: client.refreshJourney,
		validate,
		fromId: jungfernheide,
		toId: münchenHbf,
		when,
	});
	t.end();
});


tap.skip('journeysFromTrip – U Mehringdamm to U Naturkundemuseum, reroute to Spittelmarkt.', async (t) => {
	const blnMehringdamm = '730939';
	const blnStadtmitte = '732541';
	const blnNaturkundemuseum = '732539';
	const blnSpittelmarkt = '732543';

	const isU6Leg = leg => leg.line && leg.line.name
		&& leg.line.name.toUpperCase()
			.replace(/\s+/g, '') === 'U6';

	const sameStopOrStation = (stopA) => (stopB) => {
		if (stopA.id && stopB.id && stopA.id === stopB.id) {
			return true;
		}
		const statA = stopA.stat && stopA.stat.id || NaN;
		const statB = stopB.stat && stopB.stat.id || NaN;
		return statA === statB || stopA.id === statB || stopB.id === statA;
	};
	const departureOf = st => Number(new Date(st.departure || st.scheduledDeparture));
	const arrivalOf = st => Number(new Date(st.arrival || st.scheduledArrival));

	// `journeysFromTrip` only supports queries *right now*, so we can't use `when` as in all
	// other tests. To make the test less brittle, we pick a connection that is served all night. 🙄
	const when = new Date();
	const validate = createValidate({...cfg, when});

	const findTripBetween = async (stopAId, stopBId, products = {}) => {
		const {journeys} = await client.journeys(stopAId, stopBId, {
			departure: new Date(when - 10 * minute),
			transfers: 0, products,
			results: 8, stopovers: false, remarks: false,
		});
		for (const j of journeys) {
			const l = j.legs.find(isU6Leg);
			if (!l) {
				continue;
			}
			const t = await client.trip(l.tripId, {
				stopovers: true, remarks: false,
			});

			const pastStopovers = t.stopovers
				.filter(st => departureOf(st) < Date.now()); // todo: <= ?
			const hasStoppedAtA = pastStopovers
				.find(sameStopOrStation({id: stopAId}));
			const willStopAtB = t.stopovers
				.filter(st => arrivalOf(st) > Date.now()) // todo: >= ?
				.find(sameStopOrStation({id: stopBId}));

			if (hasStoppedAtA && willStopAtB) {
				const prevStopover = pastStopovers.reduce((a, b) => (departureOf(a) > departureOf(b) ? a : b));
				return {trip: t, prevStopover};
			}
		}
		return {trip: null, prevStopover: null};
	};

	// Find a vehicle from U Mehringdamm to U Stadtmitte (to the north) that is currently
	// between these two stations.
	const {trip, prevStopover} = await findTripBetween(blnMehringdamm, blnStadtmitte, {
		regionalExpress: false, regional: false, suburban: false,
	});
	t.ok(trip, 'precondition failed: trip not found');
	t.ok(prevStopover, 'precondition failed: previous stopover missing');

	// todo: "Error: Suche aus dem Zug: Vor Abfahrt des Zuges"
	const newJourneys = await client.journeysFromTrip(trip.id, prevStopover, blnSpittelmarkt, {
		results: 3, stopovers: true, remarks: false,
	});

	// Validate with fake prices.
	const withFakePrice = (j) => {
		const clone = Object.assign({}, j);
		clone.price = {amount: 123, currency: 'EUR'};
		return clone;
	};
	// todo: there is no such validator!
	validate(t, newJourneys.map(withFakePrice), 'journeysFromTrip', 'newJourneys');

	for (let i = 0; i < newJourneys.length; i++) {
		const j = newJourneys[i];
		const n = `newJourneys[${i}]`;

		const legOnTrip = j.legs.find(l => l.tripId === trip.id);
		t.ok(legOnTrip, n + ': leg with trip ID not found');
		t.equal(legOnTrip.stopovers[legOnTrip.stopovers.length - 1].stop.id, blnStadtmitte);
	}
});

tap.skip('trip details', async (t) => {
	const res = await client.journeys(berlinHbf, münchenHbf, {
		results: 1, departure: when,
	});

	const p = res.journeys[0].legs.find(l => !l.walking);
	t.ok(p.tripId, 'precondition failed');
	t.ok(p.line.name, 'precondition failed');

	const tripRes = await client.trip(p.tripId, {when});

	const validate = createValidate(cfg, {
		trip: (cfg) => {
			const validateTrip = createValidateTrip(cfg);
			const validateTripWithFakeDirection = (val, trip, name) => {
				validateTrip(val, {
					...trip,
					direction: trip.direction || 'foo', // todo, see #49
				}, name);
			};
			return validateTripWithFakeDirection;
		},
	});
	validate(t, tripRes, 'tripResult', 'tripRes');

	t.end();
});

tap.test('departures at Berlin Schwedter Str.', async (t) => {
	const res = await client.departures(blnSchwedterStr, {
		duration: 5, when,
	});

	await testDepartures({
		test: t,
		res,
		validate,
		ids: res.departures.map(d => d.stop.id),
	});
	t.end();
});

tap.test('departures with station object', async (t) => {
	const res = await client.departures({
		type: 'station',
		id: jungfernheide,
		name: 'Berlin Jungfernheide',
		location: {
			type: 'location',
			latitude: 1.23,
			longitude: 2.34,
		},
	}, {when});

	validate(t, res, 'departuresResponse', 'res');
	t.end();
});

tap.test('arrivals at Berlin Schwedter Str.', async (t) => {
	const res = await client.arrivals(blnSchwedterStr, {
		duration: 5, when,
	});

	await testArrivals({
		test: t,
		res,
		validate,
		ids: res.arrivals.map(d => d.stop.id),
	});
	t.end();
});

tap.skip('nearby Berlin Jungfernheide', async (t) => {
	const nearby = await client.nearby({
		type: 'location',
		latitude: 52.530273,
		longitude: 13.299433,
	}, {
		results: 2, distance: 400,
	});

	validate(t, nearby, 'locations', 'nearby');

	t.equal(nearby.length, 2);

	const s0 = nearby[0];
	t.equal(s0.id, jungfernheide);
	t.equal(s0.name, 'Berlin Jungfernheide');
	t.ok(isRoughlyEqual(0.0005, s0.location.latitude, 52.530408));
	t.ok(isRoughlyEqual(0.0005, s0.location.longitude, 13.299424));
	t.ok(s0.distance >= 0);
	t.ok(s0.distance <= 100);

	t.end();
});

tap.test('locations named Jungfernheide', async (t) => {
	const locations = await client.locations('Jungfernheide', {
		results: 20,
	});

	validate(t, locations, 'locations', 'locations');
	t.ok(locations.length <= 20);
	t.ok(locations.some((l) => {
		return l.station && l.station.id === jungfernheide || l.id === jungfernheide;
	}), 'Jungfernheide not found');

	t.end();
});

/*
tap.test('stop', async (t) => {
	const s = await client.stop(regensburgHbf);

	validate(t, s, ['stop', 'station'], 'stop');
	t.equal(s.id, regensburgHbf);

	t.end();
});

tap.test('line with additionalName', async (t) => {
	const {departures} = await client.departures(potsdamHbf, {
		when,
		duration: 12 * 60, // 12 minutes
		products: {bus: false, suburban: false, tram: false},
	});
	t.ok(departures.some(d => d.line && d.line.additionalName));
	t.end();
});
*/

tap.test('reachableFrom', {timeout: 20 * 1000}, async (t) => {
	const torfstr17 = {
		type: 'location',
		address: 'Torfstraße 17',
		latitude: 52.5416823,
		longitude: 13.3491223,
	};

	await testReachableFrom({
		test: t,
		reachableFrom: client.reachableFrom,
		address: torfstr17,
		when,
		maxDuration: 15,
		validate,
	});
	t.end();
});
