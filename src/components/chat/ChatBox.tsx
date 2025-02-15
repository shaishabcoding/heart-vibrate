import { IconBrandTelegram } from '@tabler/icons-react';
import { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';

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
	const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
	const menuRef = useRef<HTMLDivElement>(null);

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

	const handleSendMessage = () => {
		if (newMessage.trim()) {
			setMessages([
				...messages,
				{
					id: messages.length + 1,
					text: newMessage,
					sender: 'user',
					logo: 'https://picsum.photos/40',
					date: '1 min ago',
				},
			]);
			setNewMessage('');
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
			<div className="flex-1 p-4 overflow-y-auto">
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
			</div>
			<div className="p-4 border-t border-gray-200 dark:border-gray-700">
				<div className="flex items-center">
					<input
						type="text"
						className="flex-1 p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
						placeholder="Type your message..."
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
						onKeyPress={(e) =>
							e.key === 'Enter' && handleSendMessage()
						}
					/>
					<button
						className="ml-2 p-2 text-white rounded-lg flex justify-center bg-blue-600"
						onClick={handleSendMessage}
					>
						<IconBrandTelegram className="inline" />
					</button>
				</div>
			</div>
		</div>
	);
};

export default ChatBox;
