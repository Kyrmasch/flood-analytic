import { IPaginatedResponse } from "../../interfaces/data";
import { coreApi } from "./api";

export const dataApi = coreApi.injectEndpoints({
  endpoints: (builder) => ({
    getData: builder.query<
      IPaginatedResponse<any>,
      { tablename: string; limit: number; offset: number }
    >({
      query: (props) =>
        `/data/${props.tablename}?limit=${props.limit}&offset=${props.offset}`,
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetDataQuery } = dataApi;
