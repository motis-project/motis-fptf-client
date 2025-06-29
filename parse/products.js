const parseProducts = ({profile}, products) => {
	const res = {};
	for (let product of profile.products) {
		res[product.id] = Boolean(products.find(p => p == product.motis || p == product.motis_alt));
	}
	return res;
};

export {
	parseProducts,
};
