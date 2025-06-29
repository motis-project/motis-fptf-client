import slugg from 'slugg';

const parseLine = (ctx, p) => {
	const profile = ctx.profile;
	const fahrtNr = p.tripId.split('_').slice(2).join('_');
	const res = {
		type: 'line',
		id: slugg(p.tripId),
		fahrtNr: fahrtNr,
		name: p.routeShortName,
		public: true,
	};

	//res.adminCode = adminCode;
	const foundProduct = profile.products.find(pp => pp.motis == p.mode || pp.motis_alt == p.mode);
	res.mode = foundProduct?.mode;
	res.product = foundProduct?.id;
	res.productName = p.routeShortName.replace(/\d/g, '') || foundProduct?.name;

	res.operator = profile.parseOperator(ctx, p);
	return res;
};

export {
	parseLine,
};
