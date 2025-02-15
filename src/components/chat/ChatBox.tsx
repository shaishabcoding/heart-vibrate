import {
	IconBrandTelegram,
	IconDotsVertical,
	IconEdit,
	IconHeart,
	IconTrash,
} from '@tabler/icons-react';
import { useState, useEffect, useRef } from 'react';

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
		<div className="flex flex-col h-full w-full bg-white dark:bg-gray-800 rounded-l-lg">
			<div className="flex-1 p-4 overflow-y-auto">
				{messages.map((message) => (
					<div
						key={message.id}
						className={`flex my-2 items-start ${
							message.sender === 'user'
								? 'justify-end'
								: 'justify-start'
						} relative`}
					>
						{message.sender !== 'user' && (
							<img
								src={message.logo}
								alt="logo"
								className="h-10 w-10 rounded-full mr-2"
							/>
						)}
						<div className="relative max-w-xs">
							<div className="flex flex-col group">
								<div className="flex items-center justify-between gap-2">
									<span className="font-medium">
										{message.sender}
									</span>
									<button
										className="p-1 active:animate-click py-0 border-0"
										onClick={() =>
											setSelectedMessage(message.id)
										}
									>
										<IconDotsVertical size={20} />
									</button>
								</div>
								<span
									className={`${
										message.sender === 'user'
											? 'bg-blue-500 text-white'
											: 'bg-gray-200 text-gray-800'
									} p-2 rounded-lg mt-2`}
								>
									{message.text}
								</span>
								<span className="hidden group-hover:inline-block">
									{message.date}
								</span>
							</div>
							{selectedMessage === message.id && (
								<div
									ref={menuRef}
									className="absolute top-8 right-0 mt-2 w-48 bg-white dark:bg-gray-700 shadow-lg rounded-lg z-10"
								>
									<button className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-none active:animate-click">
										<IconEdit /> Edit
									</button>
									<button className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-none active:animate-click">
										<IconTrash /> Delete
									</button>
									<button className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-none active:animate-click">
										<IconHeart /> Like
									</button>
								</div>
							)}
						</div>
						{message.sender === 'user' && (
							<img
								src={message.logo}
								alt="logo"
								className="h-10 w-10 rounded-full ml-2"
							/>
						)}
					</div>
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
