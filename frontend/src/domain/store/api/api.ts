import { createApi } from "@reduxjs/toolkit/query/react";
import { baseAuthQuery } from "../baseQuery";

export const coreApi = createApi({
  reducerPath: "api",
  baseQuery: baseAuthQuery,
  tagTypes: ["AUTH"],
  keepUnusedDataFor: 60,
  endpoints: () => ({}),
});
