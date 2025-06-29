import {parseRemarks} from './remarks.js';

const parseJourney = (ctx, j) => { // j = raw journey
	const {profile, opt} = ctx;
	const legs = [];
	// TODO direct
	for (const l of j.legs) {
		const leg = profile.parseJourneyLeg(ctx, l, null);
		
		legs.push(leg);
	}

	const res = {
		type: 'journey',
		legs,
		refreshToken: null,
	};

	if (opt.remarks) {
		res.remarks = parseRemarks(ctx, j);
	}

	return res;
};

export {
	parseJourney,
};
