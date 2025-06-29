import {DateTime, IANAZone} from 'luxon';
import {luxonIANAZonesByProfile as timezones} from '../lib/luxon-timezones.js';

const getTimezone = (profile) => {
	let timezone;
	if (timezones.has(profile)) {
		timezone = timezones.get(profile);
	} else {
		timezone = new IANAZone(profile.timezone);
		timezones.set(profile, timezone);
	}
	return timezone;
};

const formatTime = (profile, when, includeOffset = false) => {
	const timezone = getTimezone(profile);

	return DateTime
		.fromMillis(Number(when), {
			locale: profile.locale,
			zone: timezone,
		})
		.startOf('second')
		.toISO({includeOffset: includeOffset, suppressMilliseconds: true});
};

const formatTimeOfDay = (profile, when) => {
	const timezone = getTimezone(profile);

	return DateTime
		.fromMillis(Number(when), {
			locale: profile.locale,
			zone: timezone,
		})
		.toFormat('HH:mm');
};

export {
	formatTime,
	formatTimeOfDay,
};


