/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	BaseQueryApi,
	BaseQueryFn,
	createApi,
	DefinitionType,
	FetchArgs,
	fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { logout, setUser } from '../features/auth/authSlice';
import { toast } from 'sonner';

const baseQuery = fetchBaseQuery({
	baseUrl: import.meta.env.VITE_BASE_URL,
	credentials: 'include',
	prepareHeaders(headers, { getState }) {
		const { token } = (getState() as RootState).auth;
		if (token) {
			headers.set('authorization', `Bearer ${token}`);
		}
		return headers;
	},
});

const customBaseQuery: BaseQueryFn<
	FetchArgs,
	BaseQueryApi,
	DefinitionType
> = async (args, api, extraOptions): Promise<any> => {
	let result = await baseQuery(args, api, extraOptions);

	if (result?.error?.status) {
		toast.error(
			(
				result?.error as {
					data?: {
						message?: string;
					};
				}
			).data?.message ?? 'Something went wrong!'
		);

		console.dir(result.error);
	}

	if (result?.error?.status === 401 || result?.error?.status === 403) {
		const fetchRefreshToken = await fetch(
			`${import.meta.env.VITE_BASE_URL}/auth/refresh-token`,
			{
				method: 'GET',
				credentials: 'include',
			}
		);

		const refreshResult = await fetchRefreshToken.json();

		console.log(refreshResult);

		if (refreshResult.data) {
			const userData = (api.getState() as RootState).auth.user;
			api.dispatch(
				setUser({ user: userData, token: refreshResult.data })
			);
			result = await baseQuery(args, api, extraOptions);
		} else {
			api.dispatch(logout());
		}
	}
	return result;
};

export const baseApi = createApi({
	reducerPath: 'baseApi',
	baseQuery: customBaseQuery,
	endpoints: () => ({}),
});
