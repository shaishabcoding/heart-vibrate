import { baseApi } from '../../api/baseApi';

const chatApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		chatResolve: builder.mutation({
			query: (formData: FormData) => ({
				url: '/chat/resolve',
				method: 'POST',
				body: formData,
				headers: {
					Accept: 'application/json',
				},
			}),
		}),
	}),
});

export const { useChatResolveMutation } = chatApi;
