import { baseApi } from '../../api/baseApi';

const userApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		searchUsers: builder.query({
			query: ({
				search,
				removeId,
			}: {
				search: string;
				removeId?: string;
			}) => {
				const params = new URLSearchParams();
				params.append('search', search);
				if (removeId) {
					params.append('removeId', removeId);
				}
				return {
					url: `/users?${params.toString()}`,
					method: 'GET',
				};
			},
		}),
	}),
});
export const { useSearchUsersQuery } = userApi;
