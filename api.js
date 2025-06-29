import {createClient} from './index.js';
import {profile as transitousProfile} from './p/transitous/index.js';
import {mapRouteParsers} from './lib/api-parsers.js';
import {createHafasRestApi as createApi} from 'hafas-rest-api';
import {parseString} from 'hafas-rest-api/lib/parse.js';


const modifyRoutes = (routes, hafas, config) => {
	for (let r in routes) {
		const r_func = routes[r];
		routes[r] = (req, res, next) => {
			if (req.params.id) {
				req.query._id = req.params.id;
				req.params.id = '00';
			}
			if (req.query.from) {
				req.query._from = req.query.from;
				req.query.from = '00';
			}
			if (req.query.to) {
				req.query._to = req.query.to;
				req.query.to = '00';
			}
			if (req.query.via) {
				req.query._via = req.query.via;
				req.query.via = '00';
			}
			r_func(req, res, next);
		}
		Object.assign(routes[r], r_func);
	}
	return routes
}

const mapRouteParsersWithIdAdapter = (route, parsers) => {
	return {
		...mapRouteParsers(route, parsers),
		_id: {
			type: 'string',
			parse: parseString,
		},
		_from: {
			type: 'string',
			parse: parseString,
		},
		_to: {
			type: 'string',
			parse: parseString,
		},
		_via: {
			type: 'string',
			parse: parseString,
		},
	}
}

const config = {
	hostname: process.env.HOSTNAME || 'localhost',
	port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
	name: 'motis-fptf-client',
	description: 'motis-fptf-client',
	homepage: 'https://github.com/motis-project/motis-fptf-client',
	version: '6',
	docsLink: 'https://github.com/motis-project/motis-fptf-client',
	openapiSpec: true,
	logging: true,
	aboutPage: true,
	enrichStations: true,
	etags: 'strong',
	csp: 'default-src \'none\'; style-src \'self\' \'unsafe-inline\'; img-src https:',
	mapRouteParsers: mapRouteParsersWithIdAdapter,
	modifyRoutes,
};

const profiles = {
	transitous: transitousProfile,
};

const start = async () => {
	const motis = createClient(
		profiles[process.env.MOTIS_PROFILE] || transitousProfile,
		process.env.USER_AGENT || 'link-to-your-project-or-email',
		config,
	);
	const api = await createApi(motis, config);

	api.listen(config.port, (err) => {
		if (err) {
			console.error(err);
		}
	});
};

start();
