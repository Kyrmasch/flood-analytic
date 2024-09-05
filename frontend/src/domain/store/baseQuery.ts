import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import type {
  BaseQueryApi,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { IToken } from "../interfaces/token";
import { IBaseInitialState, setToken } from "./slices/baseSlice";
import { RootState } from "./store";

const baseQuery = fetchBaseQuery({
  baseUrl: "api/",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.core.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const refreshAuthToken = async (api: BaseQueryApi, extraOptions: any) => {
  const { token } = api.getState() as IBaseInitialState;
  if (!token) {
    window.location.href = "/login";
    return null;
  }

  const refreshResponse = await baseQuery(
    { url: "/auth/refresh", method: "POST", credentials: "include" },
    api,
    extraOptions
  );

  if (refreshResponse.data) {
    const data: IToken = refreshResponse.data as IToken;
    api.dispatch(setToken(data.access_token));
    return data.access_token;
  } else {
    window.location.href = "/login";
    return null;
  }
};

export const baseAuthQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const url = typeof args === "string" ? args : args.url;
  if (url.includes("/auth/token")) {
    return await baseQuery(args, api, extraOptions);
  }

  let payload = await baseQuery(args, api, extraOptions);
  if (payload.error && payload.error.status === 401) {
    const newToken = await refreshAuthToken(api, extraOptions);

    if (newToken) {
      payload = await baseQuery(args, api, extraOptions);
    }
  }
  return payload;
};
