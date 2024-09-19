import { coreApi } from "./api";
import { GeoJSON } from "../../../domain/interfaces/geo";

export const geoApi = coreApi.injectEndpoints({
  endpoints: (builder) => ({
    getDistrict: builder.query<GeoJSON, { index: number }>({
      query: (params) => `/geo/district?id=${params.index}`,
      keepUnusedDataFor: 5,
    }),
    getRegion: builder.query<GeoJSON, { index: number }>({
      query: (params) => `/geo/region?id=${params.index}`,
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetDistrictQuery, useGetRegionQuery } = geoApi;
