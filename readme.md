# motis-fptf-client

**A client for [MOTIS](https://github.com/motis-project/motis) that is a drop-in replacement for [hafas-client](https://github.com/public-transport/hafas-client/) and/or [db-vendo-client](https://github.com/public-transport/db-vendo-client/), in short, everything that is more or less compatible with the [Friendly Public Transport Format (FPTF)](https://github.com/public-transport/friendly-public-transport-format).**

[![npm version](https://img.shields.io/npm/v/motis-fptf-client.svg)](https://www.npmjs.com/package/@motis-project/motis-fptf-client)
![ISC-licensed](https://img.shields.io/github/license/motis-project/motis-fptf-client.svg)

The following [FPTF](https://github.com/public-transport/friendly-public-transport-format)/[hafas-client](https://github.com/public-transport/hafas-client/) endpoints are supported (depending on the chosen profile, see below):

* `journeys()`
* `locations()`,
* `departures()`, `arrivals()` boards
* `reachableFrom()`

What doesn't work (yet):

* `refreshJourney()`
* `nearby()`
* `trip()`
* all other endpoints (`tripsByName()`, `radar()`, `journeysFromTrip()`, `remarks()`, `lines()`, `station()`, `stop()`)

By default, a [transitous](https://transitous.org) profile is included, but you can use it with any other MOTIS instance.


## Background

This project exists to ease transitioning from HAFAS-based APIs to open APIs run with open schedule/RT data. It uses [motis-client](https://www.npmjs.com/package/@motis-project/motis-client) to access the MOTIS API, use that if you want to access the full capabilities and features of MOTIS, use motis-fptf-client only when you want to replace/run in parallel with [hafas-client](https://github.com/public-transport/hafas-client/) and/or [db-vendo-client](https://github.com/public-transport/db-vendo-client/).

## Usage

Use it as a dependency, e.g. just replacing [hafas-client](https://github.com/public-transport/hafas-client/):

```
npm i motis-fptf-client
```

See an example in [api.js](api.js). It shows how you can use `motis-fptf-client` together with [hafas-rest-api](https://github.com/public-transport/hafas-rest-api/) and some hacks in order to run a [FPTF](https://github.com/public-transport/friendly-public-transport-format) API server:

```
docker run \
    -e USER_AGENT=my-awesome-program \
    -p 3000:3000 \
    ghcr.io/public-transport/motis-fptf-client
```

There are [community-maintained TypeScript typings available as `@types/hafas-client`](https://www.npmjs.com/package/@types/hafas-client). 

## Browser usage

`motis-fptf-client` should be mostly browser compatible. **Limitations:** Does not work with `enrichStations` option enabled.

## Related Projects

- [hafas-client](https://github.com/public-transport/hafas-client/) – including further related projects
- [db-vendo-client](https://github.com/public-transport/db-vendo-client/) - drop-in replacement to leverage the new DB APIs
- [hafas-rest-api](https://github.com/public-transport/hafas-rest-api/) – expose a hafas-client or motis-fptf-client instance as a REST API
- [db-rest](https://github.com/derhuerst/db-rest/) – for the legacy DB HAFAS endpoint
- [`*.transport.rest`](https://transport.rest/) – Public APIs wrapping some HAFAS endpoints.

## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, please [open an Issue](https://github.com/public-transport/motis-fptf-client/issues).

This project needs help! Check the [list of "help wanted" Issues](https://github.com/public-transport/motis-fptf-client/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22).

If you're contributing code, please read the [contribution guidelines](contributing.md).
