const isObj = element => element !== null && 'object' === typeof element && !Array.isArray(element);

const hasProp = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

const formatProductsFilter = (ctx, filter, key = 'motis') => {
	if (!isObj(filter)) {
		throw new TypeError('products filter must be an object');
	}
	const {profile} = ctx;

	const byProduct = {};
	const defaultProducts = {};
	for (let product of profile.products) {
		byProduct[product.id] = product;
		defaultProducts[product.id] = product.default;
	}
	filter = Object.assign({}, defaultProducts, filter);

	let products = [];
	let foundDeselected = false;
	for (let product in filter) {
		if (!hasProp(filter, product) || filter[product] !== true) {
			foundDeselected = true;
			continue;
		}
		if (!byProduct[product]) {
			throw new TypeError('unknown product ' + product);
		}
		products.push(byProduct[product][key]);
		if (byProduct[product][key+'_alt']) {
			products.push(byProduct[product][key+'_alt']);
		}
	}
	if (products.length === 0) {
		throw new Error('no products used');
	}
	if (!foundDeselected) {
		return ['TRANSIT'];
	}

	return products;
};

export {
	formatProductsFilter,
};
