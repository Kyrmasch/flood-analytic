import { ITableMeta } from "../../interfaces/meta";
import { coreApi } from "./api";

export const metaApi = coreApi.injectEndpoints({
  endpoints: (builder) => ({
    getMeta: builder.query<ITableMeta, { tablename: string }>({
      query: (props) => `/meta/model/${props.tablename}`,
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetMetaQuery } = metaApi;
