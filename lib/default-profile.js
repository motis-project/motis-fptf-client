import {request} from '../lib/request.js';
import {products} from '../lib/products.js';

import {parseDateTime} from '../parse/date-time.js';
import {parsePlatform} from '../parse/platform.js';
import {parseProducts} from '../parse/products.js';
import {parseWhen} from '../parse/when.js';
import {parseDeparture} from '../parse/departure.js';
import {parseArrival} from '../parse/arrival.js';
import {parseTrip} from '../parse/trip.js';
import {parseJourneyLeg} from '../parse/journey-leg.js';
import {parseJourney} from '../parse/journey.js';
import {parseLine} from '../parse/line.js';
import {parseLocation, enrichStation} from '../parse/location.js';
import {parseStop} from '../parse/parse-stop.js';
import {parsePolyline} from '../parse/polyline.js';
import {parseOperator} from '../parse/operator.js';
import {parseRemarks, parseCancelled} from '../parse/remarks.js';
import {parseStopover} from '../parse/stopover.js';
import {parseTickets, parsePrice} from '../parse/tickets.js';

import {formatJourneysReq} from '../format/journeys-req.js';
import {formatRefreshJourneyReq} from '../format/journeys-req.js';
import {formatTripReq} from '../format/trip-req.js';
import {formatNearbyReq} from '../format/nearby-req.js';
import {formatLocationsReq} from '../format/locations-req.js';
import {formatStopReq} from '../format/stop-req.js';
import {formatStationBoardReq} from '../format/station-board-req.js';
import {formatAddress} from '../format/address.js';
import {formatDate} from '../format/date.js';
import {formatProductsFilter} from '../format/products-filter.js';
import {formatPoi} from '../format/poi.js';
import {formatStation} from '../format/station.js';
import {formatTime, formatTimeOfDay} from '../format/time.js';
import {formatLocation} from '../format/location.js';
import {formatTransfers} from '../format/transfers.js';

const DEBUG = (/(^|,)hafas-client(,|$)/).test(typeof process !== 'undefined' ? process.env.DEBUG || '' : '');
const logRequest = DEBUG
	? (_, req, reqId) => console.error(String(req.body))
	: () => { };
const logResponse = DEBUG
	? (_, res, body, reqId) => console.error(body)
	: () => { };

const id = (_ctx, x) => x;
const notImplemented = (_ctx, _x) => {
	throw new Error('NotImplemented');
};

const defaultProfile = {
	DEBUG,
	request,
	products,
	transformReqBody: id,
	transformReq: id,
	randomizeUserAgent: false,
	logRequest,
	logResponse,

	formatJourneysReq,
	formatRefreshJourneyReq,
	formatTripReq,
	formatNearbyReq,
	formatLocationsReq,
	formatStopReq,
	formatStationBoardReq,
	transformJourneysQuery: id,

	parseDateTime,
	parsePlatform,
	parseProducts,
	parseWhen,
	parseDeparture,
	parseArrival,
	parseTrip,
	parseJourneyLeg,
	parseJourney,
	parseLine,
	parseStationName: id,
	parseLocation,
	enrichStation,
	parsePolyline,
	parseOperator,
	parseRemarks,
	parseCancelled,
	parseStopover,
	parsePrice,
	parseTickets,
	parseStop,

	formatAddress,
	formatDate,
	formatLocation,
	formatPoi,
	formatProductsFilter,
	formatStation,
	formatTime,
	formatTimeOfDay,
	formatTransfers,
	formatRectangle: id,
	formatCoord: notImplemented,
	formatLocationFilter: notImplemented,


	journeysOutFrwd: true,
	departuresGetPasslist: false,
	departuresStbFltrEquiv: true,
	trip: true,
	radar: false,
	refreshJourney: true,
	journeysFromTrip: false,
	refreshJourneyUseOutReconL: false,
	tripsByName: false,
	remarks: false,
	remarksGetPolyline: false,
	reachableFrom: true,
	lines: false,
};

export {
	defaultProfile,
};
