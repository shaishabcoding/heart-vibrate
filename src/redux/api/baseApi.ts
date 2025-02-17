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
import { logout, setToken } from '../features/auth/authSlice';
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

	if (result?.error?.status === 401 || result?.error?.status === 403) {
		// Show a toast loading message
		const toastId = toast.loading('Refreshing session...');

		try {
			const fetchRefreshToken = await fetch(
				`${import.meta.env.VITE_BASE_URL}/auth/refresh-token`,
				{
					method: 'GET',
					credentials: 'include',
				}
			);

			const refreshResult = await fetchRefreshToken.json();

			const token = refreshResult.data?.accessToken;

			if (token) {
				api.dispatch(setToken(token));
				// Retry the original request
				result = await baseQuery(args, api, extraOptions);
			} else {
				api.dispatch(logout());
			}
		} catch (error) {
			console.error('Refresh token fetch failed:', error);
		} finally {
			// Remove the loading toast
			toast.dismiss(toastId);
		}
	} else if (result?.error?.status) {
		// Show error toast only if not handling token refresh
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

	return result;
};

export const baseApi = createApi({
	reducerPath: 'baseApi',
	baseQuery: customBaseQuery,
	tagTypes: ['Chat'],
	endpoints: () => ({}),
});
