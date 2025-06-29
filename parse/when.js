const parseWhen = (ctx, date, timeS, timeR, cncl = false) => {
	const parse = ctx.profile.parseDateTime;
	let planned = timeS
		? parse(ctx, date, timeS, false)
		: null;
	let prognosed = timeR
		? parse(ctx, date, timeR, false)
		: null;
	let delay = null;

	if (planned && prognosed) {
		const tPlanned = parse(ctx, date, timeS, true);
		const tPrognosed = parse(ctx, date, timeR, true);
		delay = Math.round((tPrognosed - tPlanned) / 1000);
	}

	if (cncl) {
		return {
			when: null,
			plannedWhen: planned,
			prognosedWhen: prognosed,
			delay,
		};
	}
	return {
		when: prognosed || planned,
		plannedWhen: planned,
		delay,
	};
};

export {
	parseWhen,
};
