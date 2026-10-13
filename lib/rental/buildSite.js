// listings.json → site.json (contract: docs/superpowers/specs/2026-10-07-rental-site-design.md)
// Same text runs in Node (tests) and in the n8n "Rental Site Data" Code node.
function key(a) {
  a = (a || '').toLowerCase().replace(/ /g, ' ').replace(/,/g, ' ');
  const m = a.match(/^\s*(?:\S+\/)?(\d+[a-z]?)\s+([a-z]+)/);
  const sub = a.includes('brookfield') ? 'brookfield' : a.includes('melton south') ? 'melton south' : 'other';
  return m ? `${m[1]}|${m[2]}|${sub}` : a.trim();
}

// Stored line -> [{ name, ring }]. A Polygon is one area; a MultiPolygon holds one polygon per area (one level deeper).
function areasOf(feature) {
  const g = feature && feature.geometry, p = (feature && feature.properties) || {};
  if (!g || !Array.isArray(g.coordinates) || !g.coordinates.length) return [];
  const rings = g.type === 'MultiPolygon' ? g.coordinates.map(c => c[0]) : [g.coordinates[0]];
  return rings.map((ring, i) => {
    const meta = ((p.areas || [])[i] || {}), area = { name: meta.name || (i ? `Area ${i + 1}` : p.name || 'Area 1'), ring };
    if (Object.prototype.hasOwnProperty.call(meta, 'suburbs')) area.suburbs = meta.suburbs;
    return area;
  });
}

// Public app must receive home position from rental-secrets; never publish it here.
const HOME = null;
function kmFromHome(lat, lon, home = HOME) {
  if (lat == null || lon == null || !home) return null;
  const R = 6371, rad = Math.PI / 180;
  const dLat = (lat - home[0]) * rad, dLon = (lon - home[1]) * rad;
  const value = Math.sin(dLat / 2) ** 2
    + Math.cos(home[0] * rad) * Math.cos(lat * rad) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(value)) * 10) / 10;
}

function bestMatch(house, review, conditions, source = null) {
  const c = conditions || {};
  const reviewed = !!review;
  const point = (group, name) => Number((c[group] || {})[name]) || 0;
  const living = reviewed ? point('living_areas', review.living) : 0;
  const study = reviewed ? point('study_4_desks', review.study_4_desks) : 0;
  const backyard = reviewed ? point('backyard', review.backyard) : 0;
  let rent = 0;
  if (house.rent_pw != null) {
    const tier = (c.rent_pw || []).find(item => house.rent_pw <= item.max);
    if (tier) rent = Number(tier.points) || 0;
  }
  const area = point('area', house.area);
  const red_flags = reviewed
    ? (review.red_flags || []).reduce((sum, flag) => sum + point('red_flags', flag), 0)
    : 0;
  const parts = { living, study, backyard, rent, area, red_flags };
  return { score: Object.values(parts).reduce((sum, value) => sum + value, 0), reviewed, source: reviewed ? source : null, parts };
}

function buildSite(L, ratingsOrNow = [], maybeNow = new Date(), home = HOME) {
  const ratings = Array.isArray(ratingsOrNow) ? ratingsOrNow : [];
  const now = ratingsOrNow instanceof Date ? ratingsOrNow : maybeNow;
  const ratingsByKey = new Map(ratings.map(rating => [rating.key, rating]));
  const w = L.watch || {};
  const cutoff = new Date(now.getTime() - 3 * 86400000).toLocaleDateString('en-CA', { timeZone: 'Australia/Melbourne' });
  const hist = {};
  for (const h of w.history || []) (hist[h.key] = hist[h.key] || []).push({ date: h.date, rent_pw: h.rent_pw, event: h.event });
  for (const v of Object.values(hist)) v.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  const rowBy = new Map((w.rows || []).map(r => [r.key, r]));
  const rankedBy = new Map((L.ranked || []).map(x => [key(x.address), x]));
  const keys = [...new Set([...rankedBy.keys(), ...rowBy.keys()])];

  const houses = keys.map(k => {
    const r = rowBy.get(k), x = rankedBy.get(k);
    const bbc = x && x.bed_bath_car ? x.bed_bath_car.split('/').map(n => (n === '' ? null : Number(n))) : [];
    const first_seen = (r && r.first_seen) || (x && x.listed_date) || null;
    const url = (r && r.url) || '';
    const house = {
      key: k,
      address: ((r || x).address || '').replace(/ /g, ' '),
      rank: x ? x.rank : null,
      status: r ? r.status : 'active',
      area: (r && r.area) || 'unknown',
      area_no: (r && r.area_no) ?? null,
      lat: r && r.lat != null ? r.lat : null,
      lon: r && r.lon != null ? r.lon : null,
      rent_pw: r ? r.rent_pw : x.rent_pw,
      // Ranked list first; houses found later by Rental Watch carry bed/bath/car on their watch row
      bed: bbc[0] ?? (r && r.bed) ?? null, bath: bbc[1] ?? (r && r.bath) ?? null, car: bbc[2] ?? (r && r.car) ?? null,
      first_seen,
      last_seen: (r && r.last_seen) || null,
      last_change: (r && r.last_change) || '',
      is_new: !!first_seen && first_seen >= cutoff,
      inspections: (r && r.inspections) || [],
      flags: (r && r.flags) || [],
      register: (r && r.register) || null, // registration for inspections, read once from the listing page
      listed_date: (x && x.listed_date) || (r && r.first_seen) || null,
      distance_km: x && x.drive_km != null ? x.drive_km : kmFromHome(r && r.lat, r && r.lon, home),
      distance_is_drive: !!(x && x.drive_km != null),
      review: x ? {
        score: x.score ?? null, living_areas: x.living_areas ?? null, living_score: x.living_score ?? null,
        yard_size: x.yard_size ?? null, backyard: x.backyard ?? '', notes: x.notes ?? '',
        inspection: x.inspection ?? '', drive_min: x.drive_min ?? null,
      } : null,
      links: {
        domain: x ? x.domain_url || null : (/domain\.com\.au/.test(url) ? url : null),
        rea: x ? x.rea_url || null : (/realestate\.com\.au/.test(url) ? url : null),
      },
      agency: (x && x.agency) || null,
      photos: x && x.photo_folder ? (x.photos || []).map(f => `rental-photos/${x.photo_folder}/${f}`) : ((r && r.photos) || []),
      history: hist[k] || [],
    };
    const humanReview = (L.review || {})[k] || null;
    const candidate = r && r.auto_review;
    const autoReview = candidate && candidate.living && candidate.study_4_desks && candidate.backyard
      ? candidate : null;
    const scoringReview = humanReview || autoReview;
    house.best_match = bestMatch(
      house,
      scoringReview,
      (L.conditions || {}).best_match,
      humanReview ? 'human' : autoReview ? 'auto' : null,
    );
    const rating = ratingsByKey.get(k);
    house.my_rating = Number(rating && rating.stars) || 0;
    house.inspected = (rating && rating.inspected) || '';
    return house;
  });
  houses.sort((a, b) => {
    if (a.best_match.score !== b.best_match.score) return b.best_match.score - a.best_match.score;
    const rentA = a.rent_pw == null ? Infinity : a.rent_pw;
    const rentB = b.rent_pw == null ? Infinity : b.rent_pw;
    if (rentA !== rentB) return rentA - rentB;
    if (a.rank != null && b.rank != null && a.rank !== b.rank) return a.rank - b.rank;
    return a.key.localeCompare(b.key);
  });

  return {
    version: 1,
    updated: w.updated || null,
    last_report: w.last_report || '',
    client: {
      home: L.home || null,
      current_rent_pw: L.current_rent_pw ?? null,
      needs: L.family_needs || [],
      backyard_key: L.backyard_rating_key || {},
    },
    target_areas: areasOf(L.target_area),
    target_area: (areasOf(L.target_area)[0] || {}).ring || [],
    houses,
    needs_review: houses
      .filter(h => h.status === 'active' && (h.area === 'inside' || h.area === 'edge') && !h.best_match.reviewed)
      .map(h => h.key),
    runs: (w.runs || []).slice(-30).reverse().map(run => ({
      date: run.date || null,
      changed: Number(run.changed) || 0,
      removed: Number(run.removed) || 0,
      added: Number(run.added) || 0,
      added_outside: Number(run.added_outside) || 0,
      out_rows: Number(run.out_rows) || 0,
      all_pages_ok: !!run.all_pages_ok,
    })),
  };
}

if (typeof module !== 'undefined') module.exports = { buildSite, bestMatch, key, kmFromHome };
