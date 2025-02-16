import { baseApi } from '../../api/baseApi';

const userApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		searchUsers: builder.query({
			query: (search: string) => ({
				url: `/users?search=${search}`,
				method: 'GET',
			}),
		}),
	}),
});

export const { useSearchUsersQuery } = userApi;
