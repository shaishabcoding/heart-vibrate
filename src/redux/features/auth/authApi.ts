import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo: { email: string; password: string }) => ({
        url: "/auth/login",
        method: "POST",
        body: userInfo,
      }),
    }),
    register: builder.mutation({
      query: (userInfo: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        gender: string;
        avatar: string;
      }) => ({
        url: "/auth/register",
        method: "POST",
        body: userInfo,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
