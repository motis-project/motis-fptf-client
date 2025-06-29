import tap from 'tap';

import {createClient} from '../../index.js';
import {profile as tProfile} from '../../p/transitous/index.js';

const client = createClient(tProfile, 'public-transport/hafas-client:test', {enrichStations: false});

tap.test('exposes the profile', (t) => {
	t.ok(client.profile);
	t.equal(client.profile.endpoint, tProfile.endpoint);
	t.end();
});
