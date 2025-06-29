const PARTIAL_FARE_HINT = 'Teilpreis / partial fare';

const parsePrice = (ctx, raw) => {
	const p = raw.angebotsPreis || raw.angebote?.preise?.gesamt?.ab || raw.abPreis;
	if (p?.betrag) {
		const partialFare = raw.hasTeilpreis ?? raw.angebote?.preise?.istTeilpreis ?? raw.teilpreis;
		return {
			amount: p.betrag,
			currency: p.waehrung,
			hint: partialFare ? PARTIAL_FARE_HINT : null,
			partialFare: partialFare,
		};
	}
	return undefined;
};

const parseTickets = (ctx, j) => {
	if (!ctx.opt.tickets) {
		return undefined;
	}
	let tickets = undefined;
	let price = parsePrice(ctx, j);
	let ang = j.reiseAngebote
		|| j.angebote?.angebotsCluster?.flatMap(c => c.angebotsSubCluster
			.flatMap(c => c.angebotsPositionen
				.flatMap(p => [
					p.einfacheFahrt?.standard?.reisePosition,
					p.einfacheFahrt?.upsellEntgelt?.einfacheFahrt?.reisePosition,
				].filter(p => p)
					.map(p => {
						p.reisePosition.teilpreis = Boolean(p.teilpreisInformationen?.length);
						return p.reisePosition;
					})),
			),
		);
	if (ang && ang.length > 0) { // if refreshJourney()
		tickets = ang
			.filter(s => s.typ == 'REISEANGEBOT' && !s.angebotsbeziehungList?.flatMap(b => b.referenzen)
				.find(r => r.referenzAngebotsoption == 'PFLICHT'))
			.map((s) => {
				const p = {
					name: s.name,
					priceObj: {
						amount: Math.round(s.preis?.betrag * 100),
						currency: s.preis?.waehrung,
					},
					firstClass: s.klasse == 'KLASSE_1' || s.premium || Boolean(s.nutzungsInformationen?.find(i => i.klasse == 'KLASSE_1')),
					partialFare: s.teilpreis,
				};
				if (s.teilpreis) {
					p.addData = PARTIAL_FARE_HINT;
				}
				const conds = s.konditionsAnzeigen || s.konditionen;
				if (conds) {
					p.addDataTicketInfo = conds.map(a => a.anzeigeUeberschrift || a.bezeichnung)
						.join('. ');
					p.addDataTicketDetails = conds.map(a => a.textLang || a.details)
						.join(' ');
				}
				if (s.leuchtturmInfo || s.leuchtturmText) {
					p.addDataTravelInfo = s.leuchtturmInfo?.text || s.leuchtturmText;
				}
				return p;
			});
		if (ctx.opt.generateUnreliableTicketUrls) {
			// TODO
		}

	} else if (price) { // if journeys()
		tickets = [{
			name: 'from',
			priceObj: {
				amount: Math.round(price.amount * 100),
				currency: price.currency,
			},
		}];
	}
	return tickets;
};

export {
	parsePrice,
	parseTickets,
};
