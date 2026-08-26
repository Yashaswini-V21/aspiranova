// Pure fetch/format helpers shared by the region server functions.
// Kept out of *.functions.ts so server-fn code splitting never strips them.

export type GeoHit = {
  id: number;
  name: string;
  country?: string;
  country_code?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  population?: number;
};

export async function countStations(lat: number, lon: number, apiKey: string | undefined) {
  if (!apiKey) return 0;
  try {
    const url = `https://api.openaq.org/v3/locations?coordinates=${lat.toFixed(4)},${lon.toFixed(
      4,
    )}&radius=25000&limit=100`;
    const res = await fetch(url, { headers: { "X-API-Key": apiKey } });
    if (!res.ok) return 0;
    const json = (await res.json()) as { results?: unknown[] };
    return Array.isArray(json.results) ? json.results.length : 0;
  } catch {
    return 0;
  }
}

export async function geocode(query: string): Promise<GeoHit[]> {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query,
    )}&count=6&language=en&format=json`,
  );
  if (!res.ok) return [];
  const json = (await res.json()) as { results?: GeoHit[] };
  return (json.results ?? []).slice(0, 6);
}

// US EPA AQI from a PM2.5 concentration, piecewise-linear breakpoints.
export function pm25ToAqi(pm: number) {
  const bp: Array<[number, number, number, number]> = [
    [0, 12, 0, 50],
    [12.1, 35.4, 51, 100],
    [35.5, 55.4, 101, 150],
    [55.5, 150.4, 151, 200],
    [150.5, 250.4, 201, 300],
    [250.5, 500.4, 301, 500],
  ];
  const seg = bp.find(([lo, hi]) => pm >= lo && pm <= hi) ?? bp[bp.length - 1]!;
  const [lo, hi, alo, ahi] = seg;
  return Math.round(((ahi - alo) / (hi - lo)) * (pm - lo) + alo);
}

export async function fetchDailyPm25(latitude: number, longitude: number) {
  try {
    const res = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=pm2_5&forecast_days=5`,
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { hourly?: { pm2_5?: (number | null)[] } };
    const series = (json.hourly?.pm2_5 ?? []).map((v) => (typeof v === "number" ? v : 0));
    if (series.length < 24) return null;

    const daily: number[] = [];
    for (let d = 0; d < 5; d++) {
      const slice = series.slice(d * 24, d * 24 + 24).filter((v) => v > 0);
      if (!slice.length) break;
      daily.push(Math.round((slice.reduce((a, b) => a + b, 0) / slice.length) * 10) / 10);
    }
    if (!daily.length) return null;

    const current = Math.round((series.find((v) => v > 0) ?? daily[0]!) * 10) / 10;
    return { currentPm25: current, currentAqi: pm25ToAqi(current), daily };
  } catch {
    return null;
  }
}
