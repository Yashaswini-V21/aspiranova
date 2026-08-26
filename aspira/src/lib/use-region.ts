import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { buildForecast, getRegion, peakDay, type Region } from "./aspira-data";
import { getLiveAir, getStationCount, type RegionMatch } from "./region.functions";
import { loadSelectedRegion, saveSelectedRegion } from "./selected-region.functions";


export type SelectedRegion = {
  key: string;
  name: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  stationCount: number;
};

/** Pinned demo regions — curated data, always available for fast demo access. */
export const pinnedRegions: (SelectedRegion & { demoId: string })[] = [
  {
    key: "spokane-wa",
    demoId: "spokane-wa",
    name: "Spokane",
    state: "Washington",
    country: "United States",
    latitude: 47.6588,
    longitude: -117.426,
    stationCount: 3,
  },
  {
    key: "fresno-ca",
    demoId: "fresno-ca",
    name: "Fresno",
    state: "California",
    country: "United States",
    latitude: 36.7378,
    longitude: -119.7871,
    stationCount: 5,
  },
  {
    key: "phoenix-az",
    demoId: "phoenix-az",
    name: "Phoenix",
    state: "Arizona",
    country: "United States",
    latitude: 33.4484,
    longitude: -112.074,
    stationCount: 7,
  },
  {
    key: "gary-in",
    demoId: "gary-in",
    name: "Gary",
    state: "Indiana",
    country: "United States",
    latitude: 41.5934,
    longitude: -87.3464,
    stationCount: 0,
  },
];

export const defaultSelected: SelectedRegion = pinnedRegions[0]!;

const CLIENT_KEY = "aspira.client-id";

function getClientId() {
  if (typeof window === "undefined") return null;
  try {
    let id = localStorage.getItem(CLIENT_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(CLIENT_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

/** Shared selected-region state, persisted in Lovable Cloud. */
export function useSelectedRegion() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["selected-region"],
    queryFn: async (): Promise<SelectedRegion> => {
      const clientId = getClientId();
      if (!clientId) return defaultSelected;
      const stored = await loadSelectedRegion({ data: { clientId } });
      return stored ?? defaultSelected;
    },
    staleTime: 60_000,
  });

  const mutation = useMutation({
    mutationFn: async (region: SelectedRegion) => {
      const clientId = getClientId();
      if (!clientId) return region;
      await saveSelectedRegion({ data: { clientId, region } });
      return region;
    },
    onMutate: (region) => {
      qc.setQueryData(["selected-region"], region);
    },
  });


  const select = useCallback(
    (region: SelectedRegion | RegionMatch) => {
      const next: SelectedRegion = {
        key: region.key,
        name: region.name,
        state: region.state,
        country: region.country,
        latitude: region.latitude,
        longitude: region.longitude,
        stationCount: region.stationCount,
      };
      mutation.mutate(next);
    },
    [mutation],
  );

  return { selected: query.data ?? defaultSelected, isLoading: query.isLoading, select };
}

function describe(peak: number, name: string) {
  if (peak >= 78)
    return {
      driver: `Particulate load in ${name} is forecast to climb well above its baseline over the next five days.`,
      patientAction: `Refill rescue medication now and keep windows closed on the peak days in ${name}.`,
      clinicAction: "Increase rescue inhaler and nebulizer stock ahead of the peak day.",
      visitVolume: "High" as const,
    };
  if (peak >= 58)
    return {
      driver: `PM2.5 in ${name} stays moderately elevated, enough to matter for sensitive airways.`,
      patientAction: "Move outdoor exercise to the early morning and carry your inhaler.",
      clinicAction: "Add respiratory triage capacity around the peak day.",
      visitVolume: "Elevated" as const,
    };
  return {
    driver: `Particulate levels in ${name} stay close to seasonal normal this week.`,
    patientAction: "No action needed — your usual routine is fine this week.",
    clinicAction: "Maintain normal stock levels; no staffing change indicated.",
    visitVolume: "Normal" as const,
  };
}

/**
 * The single source of truth for every page: selected region + live OpenAQ
 * station count + forecast. Pinned demo regions keep their curated series.
 */
export function useRegion() {
  const { selected, select, isLoading } = useSelectedRegion();
  const pinned = pinnedRegions.find((p) => p.key === selected.key);

  const stations = useQuery({
    queryKey: ["stations", selected.key],
    queryFn: () => getStationCount({ data: { latitude: selected.latitude, longitude: selected.longitude } }),
    enabled: selected.latitude !== 0 || selected.longitude !== 0,
    staleTime: 15 * 60_000,
  });

  const air = useQuery({
    queryKey: ["air", selected.key],
    queryFn: () => getLiveAir({ data: { latitude: selected.latitude, longitude: selected.longitude } }),
    enabled: !pinned,
    staleTime: 15 * 60_000,
  });

  const stationCount = stations.data ?? selected.stationCount;

  let region: Region;
  if (pinned) {
    region = { ...getRegion(pinned.demoId), sensors: stationCount };
  } else if (air.data) {
    const forecast = buildForecast(air.data.daily);
    const peak = peakDay(forecast).readiness;
    region = {
      id: selected.key,
      name: selected.name,
      state: selected.state || selected.country,
      population: "—",
      sensors: stationCount,
      currentAqi: air.data.currentAqi,
      currentPm25: air.data.currentPm25,
      readiness: peak,
      forecast,
      ...describe(peak, selected.name),
    };
  } else {
    const base = getRegion("spokane-wa");
    region = {
      ...base,
      id: selected.key,
      name: selected.name,
      state: selected.state || selected.country,
      sensors: stationCount,
    };
  }

  return {
    selected,
    select,
    region,
    stationCount,
    limitedCoverage: stationCount < 2,
    isLoading: isLoading || air.isLoading || stations.isLoading,
  };
}

export const ASPIRA_DISCLAIMER =
  "Readiness Scores are correlation-based estimates built from published PM2.5-to-respiratory-impact research, primarily from North American wildfire studies. Estimates may be less precise in regions with different pollution profiles or monitoring density. Aspira is not a clinically validated forecasting tool and does not replace medical advice.";
