function str2ab(pem: string): ArrayBuffer {
  const b64 = pem.replace(/-----.* PRIVATE KEY-----/g, '').replace(/\n/g, '');
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return bytes.buffer;
}

async function getAccessToken() {
  const privateKey = (process.env.GOOGLE_PRIVATE_KEY || '').replace(
    /\\n/g,
    '\n',
  );
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL!;
  const now = Math.floor(Date.now() / 1000);

  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };

  const payload = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const toBase64 = (obj: object) =>
    btoa(JSON.stringify(obj))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

  const encHeader = toBase64(header);
  const encPayload = toBase64(payload);
  const toSign = `${encHeader}.${encPayload}`;

  const key = await crypto.subtle.importKey(
    'pkcs8',
    str2ab(privateKey),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const sigBuffer = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    new TextEncoder().encode(toSign),
  );
  const signature = btoa(String.fromCharCode(...new Uint8Array(sigBuffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const jwt = `${toSign}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const json: any = await res.json();
  if (!json.access_token) throw new Error('Failed to obtain access token');
  return json.access_token;
}

export async function getSheetValues(range: string): Promise<any[][]> {
  const token = await getAccessToken();
  const sheetId = process.env.GOOGLE_SHEET_ID!;

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) throw new Error(`Sheet fetch failed: ${res.statusText}`);
  const json: any = await res.json();
  return json.values || [];
}
