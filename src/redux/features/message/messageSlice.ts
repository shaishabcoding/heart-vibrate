import { baseApi } from '../../api/baseApi';

const chatApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		messageRetrieve: builder.query({
			query: (chatId: string) => ({
				url: `/message?chatId=${chatId}`,
				method: 'GET',
			}),
			providesTags: [{ type: 'Message', id: 'LIST' }],
		}),
	}),
});
export const { useMessageRetrieveQuery } = chatApi;
