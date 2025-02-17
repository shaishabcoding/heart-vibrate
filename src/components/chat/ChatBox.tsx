import { IconBrandTelegram } from '@tabler/icons-react';
import { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { MovingBorder } from '../ui/MovingBorder';

const ChatBox = () => {
	const [messages, setMessages] = useState([
		{
			id: 1,
			text: 'Hello! How can I help you today?',
			sender: 'bot',
			logo: 'https://picsum.photos/40',
			date: 'yesterday',
		},
		{
			id: 2,
			text: 'I need some information about your services.',
			sender: 'user',
			logo: 'https://picsum.photos/40',
			date: 'yesterday',
		},
	]);
	const [newMessage, setNewMessage] = useState('');
	const [selectedMessage, setSelectedMessage] = useState<
		number | string | null
	>(null);
	const menuRef = useRef<HTMLDivElement>(null);
	const sendBtnRef = useRef<HTMLButtonElement>(null);
	const messagesEndRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node)
			) {
				setSelectedMessage(null);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [menuRef]);

	useEffect(() => {
		setTimeout(() => {
			if (messagesEndRef.current) {
				messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
			}
		}, 100); // Delay ensures UI updates first
	}, [messages]);

	const handleSendMessage = () => {
		if (newMessage.trim()) {
			setMessages([
				{
					id: messages.length + 1,
					text: newMessage,
					sender: 'user',
					logo: 'https://picsum.photos/40',
					date: '1 min ago',
				},
				...messages,
			]);
			setNewMessage('');
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();

			if (sendBtnRef.current) {
				sendBtnRef.current.classList.add('animate-click');

				setTimeout(() => {
					sendBtnRef.current?.classList.remove('animate-click');
					sendBtnRef.current?.click();
				}, 100);
			}
		}
	};

	// const handleEditMessage = (id: number, newText: string | null) => {
	// 	if (newText !== null) {
	// 		setMessages(
	// 			messages.map((message) =>
	// 				message.id === id ? { ...message, text: newText } : message
	// 			)
	// 		);
	// 	}
	// 	setSelectedMessage(null);
	// };

	// const handleDeleteMessage = (id: number) => {
	// 	setMessages(messages.filter((message) => message.id !== id));
	// 	setSelectedMessage(null);
	// };

	// const handleReactMessage = (id: number, reaction: string) => {
	// 	console.log(`Message with id ${id} reacted with ${reaction}`);
	// 	setSelectedMessage(null);
	// };

	return (
		<div
			translate="no"
			className="flex flex-col h-full w-full bg-white dark:bg-gray-800 rounded-l-lg"
		>
			<div className="flex-1 p-4 overflow-y-auto flex flex-col-reverse">
				{messages.map((message, idx) => (
					<ChatMessage
						key={idx}
						{...{
							menuRef,
							message,
							selectedMessage,
							setSelectedMessage,
						}}
					/>
				))}

				{/* Invisible div for scrolling */}
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
