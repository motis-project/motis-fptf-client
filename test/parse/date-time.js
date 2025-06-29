import tap from 'tap';
import {parseDateTime as parse} from '../../parse/date-time.js';

const ctx = {
	common: {},
	opt: {},
	profile: {
		timezone: 'Europe/Berlin',
		locale: 'de-DE',
	},
};

tap.test('date & time parsing returns a timestamp', (t) => {
	const iso = parse(ctx, null, '2019-08-19T20:30:00', false);
	const ts = parse(ctx, null, '2019-08-19T20:30:00', true);
	t.equal(ts, Number(new Date(iso)));
	t.equal(ts, 1566239400 * 1000);
	t.end();
});

tap.test('date & time parsing uses profile.timezone', (t) => {
	const iso = parse({
		...ctx,
		profile: {...ctx.profile, timezone: 'Europe/Moscow'},
	}, null, '2019-08-19T20:30:00', false);
	t.equal(iso, '2019-08-19T20:30:00+03:00');
	t.end();
});
