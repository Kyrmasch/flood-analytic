import { IUser } from "src/domain/interfaces/auth";
import { coreApi } from "./api";
import { IToken } from "src/domain/interfaces/token";

export const authApi = coreApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<IToken, { form: FormData }>({
      query: (body) => ({
        url: `/auth/token`,
        method: "POST",
        body: body.form,
        formData: true,
      }),
    }),
    me: builder.query<IUser, null>({
      query: () => `/auth/users/me`,
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useLoginMutation, useMeQuery } = authApi;
