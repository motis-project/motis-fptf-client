const parseOperator = (ctx, zugattrib) => {
	return {
		type: 'operator',
		id: zugattrib.agencyId,
		name: zugattrib.agencyName,
	};
};

export {
	parseOperator,
};
