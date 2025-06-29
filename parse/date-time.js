import {DateTime, IANAZone} from 'luxon';
import {luxonIANAZonesByProfile as timezones} from '../lib/luxon-timezones.js';

const parseDateTime = (ctx, date, time, timestamp = false) => {
	const {profile} = ctx;

	let timezone;
	if (timezones.has(profile)) {
		timezone = timezones.get(profile);
	} else {
		timezone = new IANAZone(profile.timezone);
		timezones.set(profile, timezone);
	}

	let dt = DateTime.fromISO(time, {
		locale: profile.locale,
		zone: timezone,
	});
	return timestamp
		? dt.toMillis()
		: dt.toISO({suppressMilliseconds: true});
};

export {
	parseDateTime,
};
