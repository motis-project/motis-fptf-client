import polyline from '@mapbox/polyline';

const PRECISION = 6;

const parsePolyline = (ctx, p) => { // p = raw polylineGroup
	const points = polyline.decode(p.points, PRECISION);

	const res = points.map(ll => ({
		type: 'Feature',
		geometry: {
			type: 'Point',
			coordinates: [ll[1], ll[0]],
		},
	}));

	return {
		type: 'FeatureCollection',
		features: res,
	};
};

export {
	parsePolyline,
};
