import {
	IconDotsVertical,
	IconEdit,
	IconHeart,
	IconLanguage,
	IconLanguageOff,
	IconTrash,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';

interface ChatMessageProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	message: any;
	selectedMessage: string | number | null;
	menuRef: React.RefObject<HTMLDivElement>;
	setSelectedMessage: (msg: string | number | null) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
	message,
	selectedMessage,
	menuRef,
	setSelectedMessage,
}) => {
	const [translate, setTranslate] = useState(false);
	const [displayText, setDisplayText] = useState(message.text);

	useEffect(() => {
		if (!translate) {
			setDisplayText(message.text + '\u200B');
		} else setDisplayText(message.text);
	}, [translate, message.text]);

	return (
		<div
			key={message.id}
			className={`flex my-2 items-start ${
				message.sender === 'user' ? 'justify-end' : 'justify-start'
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
						<span className="font-medium">{message.sender}</span>
						<button
							className="p-1 active:animate-click py-0 border-0"
							onClick={() => setSelectedMessage(message.id)}
						>
							<IconDotsVertical size={20} />
						</button>
					</div>
					<span
						translate={translate ? 'yes' : 'no'}
						className={`${
							message.sender === 'user'
								? 'bg-blue-500 text-white'
								: 'bg-gray-200 text-gray-800'
						} p-2 rounded-lg mt-2`}
					>
						{displayText}
					</span>
					<span
						translate="yes"
						className="hidden group-hover:inline-block"
					>
						{message.date}
					</span>
				</div>
				{selectedMessage === message.id && (
					<div
						translate="yes"
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
						<button
							onClick={() => setTranslate(!translate)}
							className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-none active:animate-click"
						>
							{!translate ? (
								<>
									<IconLanguage /> <span>Translate</span>
								</>
							) : (
								<>
									<IconLanguageOff />{' '}
									<span>Original Text</span>
								</>
							)}
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
	);
};

export default ChatMessage;
