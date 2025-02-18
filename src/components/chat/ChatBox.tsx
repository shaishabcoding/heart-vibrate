import { IconBrandTelegram } from '@tabler/icons-react';
import { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { MovingBorder } from '../ui/MovingBorder';
import { useMessageRetrieveQuery } from '@/redux/features/message/messageSlice';
import { useSocket } from '@/provider/SocketProvider';
import { useParams } from 'react-router-dom';

type TMessage = { sender: string; message: string; date: string; _id: string };

const ChatBox = () => {
	const param = useParams();
	const { socket } = useSocket();
	const [messages, setMessages] = useState<TMessage[]>([]);
	const [newMessage, setNewMessage] = useState('');
	const sendBtnRef = useRef<HTMLButtonElement>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const {
		data: messageData,
		isLoading,
		error,
	} = useMessageRetrieveQuery(param.id as string);

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
			socket.emit('subscribeToChat', param.id);
		}, 1000);

		socket.on('chatMessageReceived', ({ sender, message, date, _id }) => {
			setMessages((preMessage) => [
				...preMessage,
				{ sender, message, date, _id },
			]);
		});

		return () => {
			socket.off('chatMessageReceived');
		};
	}, [socket, param.id]);

	useEffect(() => {
		setTimeout(() => {
			messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
		}, 100);
	}, [messages]);

	const handleSendMessage = async () => {
		if (newMessage.trim()) {
			socket!.emit('sendMessage', {
				message: newMessage,
				roomId: param.id,
			});

			setNewMessage('');
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			sendBtnRef.current?.click();
		}
	};

	return (
		<div className="flex flex-col h-full w-full bg-white dark:bg-gray-800 rounded-l-lg">
			<div className="flex-1 p-4 overflow-y-auto">
				{isLoading ? (
					<p>Loading messages...</p>
				) : error ? (
					<p className="text-red-500">Failed to load messages.</p>
				) : (
					messages.map((message) => (
						<ChatMessage
							key={message._id}
							{...{
								message,
							}}
						/>
					))
				)}

				<div ref={messagesEndRef} />
			</div>
			<div className="p-4 border-t border-gray-200 dark:border-gray-700">
				<div className="flex items-center space-x-2">
					<input
						autoFocus
						type="text"
						className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
						placeholder="Type your message..."
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
						onKeyDown={handleKeyDown}
					/>
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
