// Deterministic sample data for the Aspira MVP demo.
// Correlation-based estimates — not a clinically validated model.

export type Band = "calm" | "watch" | "elevated" | "urgent";

export type ForecastDay = {
  day: string;
  date: string;
  pm25: number;
  aqi: number;
  readiness: number;
};

export type Region = {
  id: string;
  name: string;
  state: string;
  population: string;
  sensors: number;
  currentAqi: number;
  currentPm25: number;
  readiness: number;
  driver: string;
  patientAction: string;
  clinicAction: string;
  visitVolume: "Normal" | "Elevated" | "High";
  forecast: ForecastDay[];
};

export function bandOf(score: number): Band {
  if (score >= 78) return "urgent";
  if (score >= 58) return "elevated";
  if (score >= 38) return "watch";
  return "calm";
}

export const bandLabel: Record<Band, string> = {
  calm: "Calm",
  watch: "Watch",
  elevated: "Elevated",
  urgent: "Urgent",
};

const days = ["Today", "Thu", "Fri", "Sat", "Sun"];
const dates = ["Aug 26", "Aug 27", "Aug 28", "Aug 29", "Aug 30"];

export function buildForecast(pm: number[]): ForecastDay[] {
  return pm.map((pm25, i) => ({
    day: days[i]!,
    date: dates[i]!,
    pm25,
    aqi: Math.round(Math.min(240, pm25 * 3.4 + 8)),
    readiness: Math.round(Math.min(96, Math.max(8, pm25 * 2.35 + 6))),
  }));
}

export function peakDay(forecast: ForecastDay[]): ForecastDay {
  return forecast.reduce((a, b) => (b.readiness > a.readiness ? b : a));
}

const baseRegions: Region[] = [

  {
    id: "spokane-wa",
    name: "Spokane",
    state: "Washington",
    population: "230k",
    sensors: 3,
    currentAqi: 74,
    currentPm25: 19.4,
    readiness: 81,
    driver:
      "Wildfire smoke drifting in from the Cascades pushes PM2.5 to roughly three times its baseline Thursday through Friday.",
    patientAction: "Refill your rescue inhaler before Thursday and keep windows closed Thu–Fri.",
    clinicAction: "Increase rescue inhaler and nebulizer stock by Wednesday evening.",
    visitVolume: "High",
    forecast: buildForecast([19.4, 32.1, 36.8, 24.5, 14.2]),
  },
  {
    id: "fresno-ca",
    name: "Fresno",
    state: "California",
    population: "545k",
    sensors: 5,
    currentAqi: 58,
    currentPm25: 14.1,
    readiness: 62,
    driver:
      "A valley inversion traps particulates overnight, holding PM2.5 elevated across the weekend.",
    patientAction: "Move outdoor exercise to the morning and carry your inhaler Fri–Sun.",
    clinicAction: "Add respiratory triage capacity Friday and Saturday.",
    visitVolume: "Elevated",
    forecast: buildForecast([14.1, 18.6, 22.4, 25.9, 21.0]),
  },
  {
    id: "phoenix-az",
    name: "Phoenix",
    state: "Arizona",
    population: "1.6M",
    sensors: 7,
    currentAqi: 41,
    currentPm25: 9.8,
    readiness: 34,
    driver: "Ozone climbs mid-afternoon, but particulate levels stay near seasonal normal.",
    patientAction: "No action needed — usual routine is fine this week.",
    clinicAction: "Maintain normal stock levels; no staffing change indicated.",
    visitVolume: "Normal",
    forecast: buildForecast([9.8, 11.2, 12.6, 10.4, 8.9]),
  },
  {
    id: "gary-in",
    name: "Gary",
    state: "Indiana",
    population: "68k",
    sensors: 0,
    currentAqi: 66,
    currentPm25: 17.2,
    readiness: 71,
    driver:
      "No official sensor nearby — the estimate leans on community check-ins, which have tripled since Monday.",
    patientAction: "Log how you're feeling today so neighbors get a sharper local signal.",
    clinicAction: "Treat as elevated: pre-position nebulizer supplies for the weekend.",
    visitVolume: "Elevated",
    forecast: buildForecast([17.2, 21.5, 26.3, 19.7, 13.8]),
  },
];

// Single source of truth: the headline Readiness Score is always the peak of
// the five-day forecast, so gauge, badge and table can never disagree.
export const regions: Region[] = baseRegions.map((r) => ({
  ...r,
  readiness: peakDay(r.forecast).readiness,
}));

export const defaultRegionId = regions[0]!.id;


export function getRegion(id: string): Region {
  return regions.find((r) => r.id === id) ?? regions[0]!;
}

export type Checkin = { label: string; weight: number; count: number };

export const checkinOptions = [
  { key: "fine", label: "Feeling fine", weight: 0 },
  { key: "mild", label: "Mild irritation", weight: 1 },
  { key: "inhaler", label: "Used my inhaler", weight: 2 },
  { key: "hard", label: "Hard to breathe", weight: 3 },
] as const;

export type Cell = {
  x: number;
  y: number;
  signal: number;
  sensor: boolean;
  label?: string;
};

// 12 x 7 abstract coverage grid for the community map.
export const coverageGrid: Cell[] = (() => {
  const cells: Cell[] = [];
  const sensors = new Set(["2-1", "8-1", "4-4", "10-5"]);
  for (let y = 0; y < 7; y++) {
    for (let x = 0; x < 12; x++) {
      const s = (Math.sin(x * 1.7 + y * 2.3) + Math.cos(x * 0.6 - y * 1.1)) / 2;
      cells.push({
        x,
        y,
        signal: Math.max(0, Math.min(1, 0.45 + s * 0.55)),
        sensor: sensors.has(`${x}-${y}`),
      });
    }
  }
  return cells;
})();

export type HistoryPoint = {
  date: string;
  predicted: number;
  actual: number;
  clinicLoad: number | null;
};

export const historySeries: HistoryPoint[] = [
  { date: "Aug 12", predicted: 34, actual: 31, clinicLoad: 30 },
  { date: "Aug 13", predicted: 38, actual: 42, clinicLoad: 40 },
  { date: "Aug 14", predicted: 51, actual: 49, clinicLoad: 55 },
  { date: "Aug 15", predicted: 66, actual: 71, clinicLoad: 70 },
  { date: "Aug 16", predicted: 79, actual: 76, clinicLoad: 85 },
  { date: "Aug 17", predicted: 72, actual: 68, clinicLoad: 75 },
  { date: "Aug 18", predicted: 55, actual: 52, clinicLoad: 50 },
  { date: "Aug 19", predicted: 41, actual: 38, clinicLoad: 40 },
  { date: "Aug 20", predicted: 36, actual: 40, clinicLoad: 35 },
  { date: "Aug 21", predicted: 44, actual: 47, clinicLoad: 45 },
  { date: "Aug 22", predicted: 58, actual: 55, clinicLoad: 60 },
  { date: "Aug 23", predicted: 69, actual: 74, clinicLoad: 70 },
  { date: "Aug 24", predicted: 77, actual: 73, clinicLoad: 80 },
  { date: "Aug 25", predicted: 81, actual: 79, clinicLoad: 85 },
];

export type AlertItem = {
  id: string;
  when: string;
  region: string;
  status: "Upcoming" | "Sent";
  headline: string;
  body: string;
  band: Band;
};

export const personalAlerts: AlertItem[] = [
  {
    id: "a1",
    when: "Wed 6:00 PM",
    region: "Spokane, WA",
    status: "Upcoming",
    headline: "Bad air expected Thursday–Friday",
    body: "Consider refilling your inhaler today and limiting outdoor activity those two days.",
    band: "urgent",
  },
  {
    id: "a2",
    when: "Aug 23",
    region: "Spokane, WA",
    status: "Sent",
    headline: "Air improving through the weekend",
    body: "Readiness dropping to calm by Sunday. Normal outdoor activity is fine again.",
    band: "calm",
  },
  {
    id: "a3",
    when: "Aug 16",
    region: "Spokane, WA",
    status: "Sent",
    headline: "Smoke event — 3 day window",
    body: "PM2.5 forecast to peak Saturday. Keep rescue medication within reach.",
    band: "elevated",
  },
];

export const clinicChecklist = [
  { id: "c1", label: "Restock rescue inhalers", due: "by Wed" },
  { id: "c2", label: "Check nebulizer consumables", due: "by Wed" },
  { id: "c3", label: "Brief front-desk on triage script", due: "by Thu" },
  { id: "c4", label: "Add one respiratory slot Thu–Fri", due: "by Thu" },
];
