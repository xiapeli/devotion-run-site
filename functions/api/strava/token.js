export async function onRequestPost(context) {
  const { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET } = context.env;

  if (!STRAVA_CLIENT_ID || !STRAVA_CLIENT_SECRET) {
    return jsonResponse({ error: 'Server not configured: missing Strava credentials' }, 500);
  }

  let body;
  try {
    body = await context.request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const { code } = body;
  if (!code || typeof code !== 'string') {
    return jsonResponse({ error: 'Authorization code is required' }, 400);
  }

  const params = new URLSearchParams();
  params.append('client_id', STRAVA_CLIENT_ID);
  params.append('client_secret', STRAVA_CLIENT_SECRET);
  params.append('code', code);
  params.append('grant_type', 'authorization_code');

  const stravaRes = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  const data = await stravaRes.json();

  if (!stravaRes.ok) {
    return jsonResponse(data, stravaRes.status);
  }

  return jsonResponse({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: data.expires_at,
    expires_in: data.expires_in,
    athlete: data.athlete,
  });
}

function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
