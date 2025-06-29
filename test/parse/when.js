import tap from 'tap';
import {parseWhen as parse} from '../../parse/when.js';
import {parseDateTime} from '../../parse/date-time.js';

const profile = {
	parseDateTime: parseDateTime,
	timezone: 'Europe/Berlin',
	locale: 'de-DE',
};
const ctx = {
	data: {},
	opt: {},
	profile,
};

tap.test('parseWhen works correctly', (t) => {
	const date = null;
	const timeS = '2019-06-06T16:30:00';
	const timeR = '2019-06-06T16:31:00';
	const expected = {
		when: '2019-06-06T16:31:00+02:00',
		plannedWhen: '2019-06-06T16:30:00+02:00',
		delay: 60, // seconds
	};

	t.same(parse(ctx, date, timeS, timeR), expected);

	// no realtime data
	t.same(parse(ctx, date, timeS, null), {
		...expected, when: expected.plannedWhen, delay: null,
	});

	// cancelled
	t.same(parse(ctx, date, timeS, timeR, true), {
		...expected,
		when: null,
		prognosedWhen: expected.when,
	});
	t.end();
});
