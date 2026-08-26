import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { countStations, fetchDailyPm25, geocode } from "./openaq";

export type RegionMatch = {
  key: string;
  name: string;
  state: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  stationCount: number;
};

export type LiveAir = {
  currentPm25: number;
  currentAqi: number;
  daily: number[];
};

export const searchRegions = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ query: z.string().min(2).max(60) }).parse(data))
  .handler(async ({ data }): Promise<RegionMatch[]> => {
    const apiKey = process.env["OPENAQ_API_KEY"];
    const hits = await geocode(data.query);
    const counts = await Promise.all(hits.map((h) => countStations(h.latitude, h.longitude, apiKey)));

    return hits.map((h, i) => ({
      key: `oaq-${h.id}`,
      name: h.name,
      state: h.admin1 ?? "",
      country: h.country ?? "",
      countryCode: h.country_code ?? "",
      latitude: h.latitude,
      longitude: h.longitude,
      stationCount: counts[i] ?? 0,
    }));
  });

export const getLiveAir = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) =>
    z.object({ latitude: z.number(), longitude: z.number() }).parse(data),
  )
  .handler(async ({ data }): Promise<LiveAir | null> =>
    fetchDailyPm25(data.latitude, data.longitude),
  );

export const getStationCount = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) =>
    z.object({ latitude: z.number(), longitude: z.number() }).parse(data),
  )
  .handler(async ({ data }): Promise<number> =>
    countStations(data.latitude, data.longitude, process.env["OPENAQ_API_KEY"]),
  );
