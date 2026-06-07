// Netlify Function: server-side Airbnb iCal proxy
// Fetches the Airbnb calendar feed server-side (no browser CORS limits),
// keeps the private iCal tokens off the public page, and caches briefly.
//
// Endpoint:  /.netlify/functions/ical?listing=residence
//            /.netlify/functions/ical?listing=suite

const LISTINGS = {
  residence: 'https://www.airbnb.com/calendar/ical/1448873183102250785.ics?t=a82ba9aa46d04528a592f07bb65d7999',
  suite: 'https://www.airbnb.com/calendar/ical/1701614279495081800.ics?t=026d236e2b6a4f5f98bded722a045677',
};

exports.handler = async (event) => {
  const listing = (event.queryStringParameters && event.queryStringParameters.listing) || '';
  const url = LISTINGS[listing];
  if (!url) {
    return { statusCode: 400, body: 'Unknown listing. Use ?listing=residence or ?listing=suite' };
  }
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Ferrer Sunshine Estates calendar sync)' },
    });
    if (!res.ok) {
      return { statusCode: 502, body: 'Upstream calendar error: ' + res.status };
    }
    const text = await res.text();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        // Cache at the edge for 15 min so we don't hammer Airbnb
        'Cache-Control': 'public, max-age=900',
      },
      body: text,
    };
  } catch (e) {
    return { statusCode: 502, body: 'Calendar fetch failed' };
  }
};
