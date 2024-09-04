import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { IToken } from "../interfaces/token";

const baseQuery = fetchBaseQuery({
  baseUrl: "api/",
  prepareHeaders: (headers, {}) => {
    const token = localStorage.getItem("token");

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const refreshAuthToken = async (api: any, extraOptions: any) => {
  const token = localStorage.getItem("token");
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
    localStorage.setItem("token", data.access_token);
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
