import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { IToken } from "../interfaces/token";

const baseQuery = fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000/api/" });
export const baseAuthQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let payload = await baseQuery(args, api, extraOptions);
  if (payload.error && payload.error.status === 401) {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }

    const refreshResponse = await baseQuery(
      { url: "/api/auth/refresh", method: "POST", body: { token } },
      api,
      extraOptions
    );

    if (refreshResponse.data) {
      let data: IToken = refreshResponse.data as IToken;
      localStorage.setItem("token", data.access_token);

      payload = await baseQuery(args, api, extraOptions);
    } else {
      window.location.href = "/login";
    }
  }
  return payload;
};
