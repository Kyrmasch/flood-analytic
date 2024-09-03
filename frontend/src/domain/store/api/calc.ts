import { coreApi } from "./api";

export const calcApi = coreApi.injectEndpoints({
  endpoints: (builder) => ({
    getCalc: builder.query<{ result: [] }, null>({
      query: () => `/calc/calc`,
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetCalcQuery } = calcApi;
