import { baseApi } from '../../api/baseApi';

const chatApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		chatList: builder.query({
			query: () => ({
				url: '/chat',
				method: 'GET',
			}),
			providesTags: [{ type: 'Chat', id: 'LIST' }],
		}),

		chatRetrieve: builder.query({
			query: (chatId: string) => ({
				url: `/chat/${chatId}`,
				method: 'GET',
			}),
			providesTags: (_result, _error, chatId) => [
				{ type: 'Chat', id: chatId },
			],
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

		chatUpdate: builder.mutation({
			query: ({
				chatId,
				formData,
			}: {
				chatId: string;
				formData: FormData;
			}) => ({
				url: `/chat/${chatId}/edit`,
				method: 'PATCH',
				body: formData,
			}),
			invalidatesTags: [{ type: 'Chat', id: 'LIST' }],
		}),
	}),
});

export const {
	useChatListQuery,
	useChatResolveMutation,
	useChatDeleteMutation,
	useChatRetrieveQuery,
	useChatUpdateMutation,
} = chatApi;
