

const parseStop = (ctx, l, id) => {
	const {profile, common, opt} = ctx;

	if (!l) {
		return null;
	}
	let stop = {
		type: 'station',
		id: id,
		name: l.haltName,
	};

	stop.products = profile.parseProducts(ctx, l.produktGattungen?.map(p => p.produktGattung));
	if (opt.linesOfStops) {
		stop.lines = l.produktGattungen?.flatMap(p => {
			const foundProduct = profile.products.find(pp => pp.dbnav == p.produktGattung);
			return p.produkte?.map(l => {
				return {
					type: 'line',
					name: l.name,
					productName: l.name && l.name.split(' ')[0] || undefined,
					mode: foundProduct?.mode,
					product: foundProduct?.id,
					public: true,
				};
			});
		});
	}

	if (common && common.locations && common.locations[stop.id]) {
		delete stop.type;
		stop = {
			...common.locations[stop.id],
			...stop,
		};
	}

	// TODO isMeta
	// TODO entrances
	return stop;
};

export {
	parseStop,
};
