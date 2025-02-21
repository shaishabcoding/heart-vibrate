import { baseApi } from '../../api/baseApi';

const authApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation({
			query: (userInfo: { email: string; password: string }) => ({
				url: '/auth/login',
				method: 'POST',
				body: userInfo,
			}),
		}),
		register: builder.mutation({
			query: (formData: FormData) => ({
				url: '/auth/register',
				method: 'POST',
				body: formData,
			}),
		}),
	}),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
