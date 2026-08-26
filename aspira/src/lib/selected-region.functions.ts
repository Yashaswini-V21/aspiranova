import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type StoredRegion = {
  key: string;
  name: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  stationCount: number;
};

const clientIdSchema = z.object({ clientId: z.string().uuid() });

const regionSchema = clientIdSchema.extend({
  region: z.object({
    key: z.string().min(1).max(120),
    name: z.string().min(1).max(120),
    state: z.string().max(120).default(""),
    country: z.string().max(120).default(""),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    stationCount: z.number().int().min(0).max(100000),
  }),
});

export const loadSelectedRegion = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => clientIdSchema.parse(data))
  .handler(async ({ data }): Promise<StoredRegion | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("selected_region")
      .select("region_key,name,state,country,latitude,longitude,station_count")
      .eq("client_id", data.clientId)
      .maybeSingle();

    if (error) {
      console.error("[selected_region] load failed", error);
      throw new Error("Unable to load the selected region.");
    }
    if (!row) return null;

    return {
      key: row.region_key,
      name: row.name,
      state: row.state ?? "",
      country: row.country ?? "",
      latitude: row.latitude ?? 0,
      longitude: row.longitude ?? 0,
      stationCount: row.station_count ?? 0,
    };
  });

export const saveSelectedRegion = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => regionSchema.parse(data))
  .handler(async ({ data }): Promise<StoredRegion> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { region } = data;
    const { error } = await supabaseAdmin.from("selected_region").upsert(
      {
        client_id: data.clientId,
        region_key: region.key,
        name: region.name,
        state: region.state,
        country: region.country,
        latitude: region.latitude,
        longitude: region.longitude,
        station_count: region.stationCount,
      },
      { onConflict: "client_id" },
    );

    if (error) {
      console.error("[selected_region] save failed", error);
      throw new Error("Unable to save the selected region.");
    }
    return region;
  });
