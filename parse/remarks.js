const parseRemarks = (ctx, ref, isArrival) => {
	const severity = {
		UNKNOWN_SEVERITY: 'hint',
		INFO: 'hint',
		WARNING: 'warning',
		SEVERE: 'warning',
	};
	const r = ref.alerts?.map(a => ({summary: a.headerText, text: a.descriptionText, type: severity[a.severityLevel || 'UNKNOWN_SEVERITY']})) || [];
	if (ref.pickupDropoffType == 'NOT_ALLOWED') {
		const inDisallowed = ctx.profile.lang == 'de' ? 'Einstieg nicht möglich' : 'Entry not possible';
		const outDisallowed = ctx.profile.lang == 'de' ? 'Ausstieg nicht möglich' : 'Exit not possible';
		const cancelled = ctx.profile.lang == 'de' ? 'Halt entfällt' : 'Stop cancelled';
		const inOutDisallowed = ref.cancelled ? cancelled : isArrival ? outDisallowed : inDisallowed;
		r.push({
			code: 'inOutDisallowed',
			summary: inOutDisallowed,
			text: inOutDisallowed,
			type: 'warning',
		});
	}
	return r;
};

const parseCancelled = (ref) => {
	return ref.canceled
		|| ref.cancelled || ref.pickupDropoffType == 'NOT_ALLOWED' || ref.pickupType == 'NOT_ALLOWED' && ref.dropoffType == 'NOT_ALLOWED';
};

export {
	parseRemarks,
	parseCancelled,
};
