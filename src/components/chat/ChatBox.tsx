/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconArrowNarrowLeft, IconBrandTelegram } from '@tabler/icons-react';
import { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { MovingBorder } from '../ui/MovingBorder';
import { useMessageRetrieveQuery } from '@/redux/features/message/messageSlice';
import { useSocket } from '@/provider/SocketProvider';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useChatRetrieveQuery } from '@/redux/features/chat/chatApi';
import Img from '@/components/ui/Img';
import { useAppSelector } from '@/redux/hooks';
import GroupSetting from './GroupSetting';

type TMessage = {
	sender: string;
	message: string;
	date: string;
	_id: string;
	readBy: string[];
};

const ChatBox = () => {
	const params = useParams();
	const { socket } = useSocket();
	const [messages, setMessages] = useState<TMessage[]>([]);
	const [newMessage, setNewMessage] = useState('');
	const sendBtnRef = useRef<HTMLButtonElement>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();
	const userId = useAppSelector((state) => state.auth.user?._id);

	const {
		data: messageData,
		isLoading,
		error,
		isError,
		refetch,
	} = useMessageRetrieveQuery(params.chatId as string);

	const { data: chatData } = useChatRetrieveQuery(params.chatId as string);

	useEffect(() => {
		refetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (messageData?.data) {
			setMessages(messageData.data);
		}
	}, [messageData]);

	useEffect(() => {
		// Ensure socket is not null before calling emit or on
		if (!socket) return;

		setTimeout(() => {
			console.log('🔄 Subscribing to chat...');
			socket.emit('subscribeToChat', params.chatId);
		}, 1000);

		socket.on(
			'chatMessageReceived',
			({ sender, message, date, _id, chatId }) => {
				if (chatId === params.chatId)
					setMessages((preMessage) => [
						...preMessage,
						{ sender, message, date, _id, readBy: [] },
					]);
			}
		);

		socket.on('chatUpdated', refetch);

		return () => {
			socket.off('chatMessageReceived');
			socket.off('chatUpdated');
		};
	}, [socket, params.chatId, refetch]);

	useEffect(() => {
		setTimeout(() => {
			messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
		}, 100);
	}, [messages]);

	useEffect(() => {
		/** Redirect to inbox if room not found */
		if (isError)
			if (
				(error as any)?.status === 404 ||
				(error as any)?.status === 401
			)
				navigate('/chat', { replace: true });
	}, [error, navigate, isError]);

	const handleSendMessage = async () => {
		if (newMessage.trim()) {
			socket!.emit('sendMessage', {
				message: newMessage,
				roomId: params.chatId,
			});

			setNewMessage('');
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			sendBtnRef.current?.classList.add('animate-click');
			sendBtnRef.current?.focus();
			sendBtnRef.current?.click();

			setTimeout(() => {
				(e.target as HTMLInputElement).focus();
				sendBtnRef.current?.classList.remove('animate-click');
			}, 500);
		}
	};

	return (
		<div className="flex flex-col h-full w-full bg-white dark:bg-gray-800 rounded-l-lg">
			<div className="border-b px-4 h-12 w-full flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Link
						to="/chat"
						className="hover:-translate-x-1 block transition"
					>
						<IconArrowNarrowLeft className="text-blue-400" />
					</Link>
					<Img
						src={chatData?.data?.image}
						className="w-8 h-8 rounded-md bg-white border"
						alt=""
					/>
					<h3 translate="no">{chatData?.data?.name}</h3>
				</div>
				{chatData?.data?.isGroup &&
					chatData?.data?.admins.some(
						(admin: any) => admin._id === userId
					) && <GroupSetting />}
			</div>
			<div className="flex-1 p-4 overflow-y-auto">
				{isLoading ? (
					<p>Loading messages...</p>
				) : error ? (
					<p className="text-red-500">
						{(error as any)?.data?.message ??
							'Failed to load messages.'}
					</p>
				) : (
					messages.map((message) => {
						if (
							!message.readBy
								.map((user: any) => user._id)
								.includes(userId)
						) {
							socket!.emit('markMessageAsRead', {
								messageId: message._id,
								chatId: params.chatId,
							});
						}

						return (
							<ChatMessage
								key={message._id}
								{...{
									message,
								}}
							/>
						);
					})
				)}

				<div ref={messagesEndRef} />
			</div>
			<div className="p-4 border-t border-gray-200 dark:border-gray-700">
				<div className="flex items-center space-x-2">
					<MovingBorder className="w-full">
						<input
							autoFocus
							type="text"
							className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
							placeholder="Type your message..."
							value={newMessage}
							onChange={(e) => setNewMessage(e.target.value)}
							onKeyDown={handleKeyDown}
						/>
					</MovingBorder>
					<MovingBorder>
						<button
							className="flex items-center gap-1 group bg-sky-400 border-sky-500 text-white"
							ref={sendBtnRef}
							onClick={handleSendMessage}
						>
							Send{' '}
							<IconBrandTelegram className="group-hover:translate-x-1 transition" />
						</button>
					</MovingBorder>
				</div>
			</div>
		</div>
	);
};

export default ChatBox;
