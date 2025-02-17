import { IconBrandTelegram } from '@tabler/icons-react';
import { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { MovingBorder } from '../ui/MovingBorder';
import { useMessageRetrieveQuery } from '@/redux/features/message/messageSlice';
import { useSocket } from '@/provider/SocketProvider';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';

const ChatBox = () => {
	const param = useParams();
	const { socket } = useSocket();
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState('');
	const [selectedMessage, setSelectedMessage] = useState<
		number | string | null
	>(null);
	const menuRef = useRef<HTMLDivElement>(null);
	const sendBtnRef = useRef<HTMLButtonElement>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const user = useAppSelector((state) => state.auth.user);

	// Fetch messages from the API
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
		if (socket) {
			socket.on('newMessage', (message) => {
				setMessages((prevMessages) => [message, ...prevMessages]);
			});

			return () => {
				socket.off('newMessage');
			};
		}
	}, [socket]);

	useEffect(() => {
		setTimeout(() => {
			messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
		}, 100);
	}, [messages]);

	const handleSendMessage = async () => {
		if (newMessage.trim()) {
			const messageData = {
				message: newMessage,
				sender: user, // Replace with actual user ID
				chat: 'chat_id', // Replace with actual chat ID
			};

			setMessages([
				...messages,
				{ ...messageData, _id: Date.now().toString() },
			]);

			try {
				const response = await fetch('/message', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(messageData),
				});

				if (!response.ok) throw new Error('Failed to send message');

				const savedMessage = await response.json();
				socket.emit('sendMessage', savedMessage);
			} catch (error) {
				console.error('Message send failed:', error);
			}

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
								menuRef,
								message,
								selectedMessage,
								setSelectedMessage,
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
