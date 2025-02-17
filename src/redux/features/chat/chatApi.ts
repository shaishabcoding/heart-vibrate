import { baseApi } from '../../api/baseApi';

const chatApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		chatRetrieve: builder.query({
			query: () => ({
				url: '/chat',
				method: 'GET',
			}),
			providesTags: [{ type: 'Chat', id: 'LIST' }],
		}),

		chatResolve: builder.mutation({
			query: (formData: FormData) => ({
				url: '/chat/resolve',
				method: 'POST',
				body: formData,
			}),
			invalidatesTags: [{ type: 'Chat', id: 'LIST' }],
		}),

		chatDelete: builder.mutation({
			query: (chatId: string) => ({
				url: `/chat/${chatId}/delete`,
				method: 'DELETE',
			}),
			invalidatesTags: [{ type: 'Chat', id: 'LIST' }],
		}),
	}),
});

export const {
	useChatRetrieveQuery,
	useChatResolveMutation,
	useChatDeleteMutation,
} = chatApi;
