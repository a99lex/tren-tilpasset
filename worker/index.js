const pageMetrics = {
  '/': 'app_visning',
  '/working-out-with-a-new-tattoo/': 'tatoveringsguide_visning',
  '/training-with-jumpers-knee/': 'kneguide_visning'
};

const redirects = {
  '/en': '/',
  '/en/': '/',
  '/en/working-out-with-a-new-tattoo/': '/working-out-with-a-new-tattoo/',
  '/en/training-with-jumpers-knee/': '/training-with-jumpers-knee/',
  '/trene-med-ny-tatovering/': '/working-out-with-a-new-tattoo/',
  '/trene-med-jumpers-knee/': '/training-with-jumpers-knee/'
};

function count(env, metric) {
  if (!env.DB) return Promise.resolve();
  return env.DB.prepare(
    'INSERT INTO usage_counts (day, metric, total) VALUES (date(\'now\'), ?, 1) ' +
    'ON CONFLICT(day, metric) DO UPDATE SET total = total + 1'
  ).bind(metric).run().catch(() => console.error('Unable to increment usage counter'));
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/usage' && request.method === 'POST') {
      if (request.headers.get('Origin') !== url.origin) return new Response(null, {status:403});
      ctx.waitUntil(count(env, 'okt_laget'));
      return new Response(null, {status:204});
    }

    if (!['GET','HEAD'].includes(request.method)) return new Response(null, {status:405});
    const redirect = redirects[url.pathname] ?? redirects[url.pathname + '/'] ??
      (pageMetrics[url.pathname + '/'] ? url.pathname + '/' : undefined);
    if (redirect) return Response.redirect(new URL(redirect + url.search, url), 301);
    const asset = assets[url.pathname];
    if (!asset) return new Response('Page not found.', {status:404});
    if (request.method === 'GET' && pageMetrics[url.pathname] &&
        !/bot|spider|crawl|preview/i.test(request.headers.get('User-Agent') || '')) {
      ctx.waitUntil(count(env, pageMetrics[url.pathname]));
      const referrer = request.headers.get('Referer') || '';
      if (/^https?:\/\/(?:www\.)?google\.[a-z.]+\//i.test(referrer)) ctx.waitUntil(count(env, 'google_inngang'));
    }
    const body = asset.body.replaceAll('__ORIGIN__', url.origin);
    return new Response(request.method === 'HEAD' ? null : body, {headers:{
      'Content-Type': asset.type + '; charset=utf-8',
      'Cache-Control': 'no-cache'
    }});
  }
};
