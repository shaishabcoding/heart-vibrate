import { useAppSelector } from '@/redux/hooks';
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
	const user = useAppSelector((state) => state.auth.user);
	const isCurrentUser = message.sender?._id === user?._id;

	const [translate, setTranslate] = useState(false);
	const [displayText, setDisplayText] = useState(message.message);

	useEffect(() => {
		if (!translate) {
			setDisplayText(message.message + '\u200B');
		} else {
			setDisplayText(message.message);
		}
	}, [translate, message.message]);

	return (
		<div
			key={message.id}
			className={`flex my-2 items-start ${
				isCurrentUser ? 'justify-end' : 'justify-start'
			} relative`}
		>
			{/* Show Avatar Only for Other Users */}
			{!isCurrentUser && (
				<img
					src={import.meta.env.VITE_BASE_URL + message.sender.avatar}
					alt="avatar"
					className="h-10 w-10 rounded-full mr-2"
				/>
			)}

			<div className="relative max-w-xs">
				<div className="flex flex-col group">
					<div className="flex items-center justify-between gap-2">
						<span className="font-medium">
							{message.sender.name.firstName}{' '}
							{message.sender.name.lastName}
						</span>
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
							isCurrentUser
								? 'bg-gray-200 text-gray-800'
								: 'bg-blue-500 text-white'
						} p-2 rounded-lg mt-2`}
					>
						{displayText}
					</span>

					{/* Add a placeholder for the date */}
					{message.date && (
						<span
							translate="yes"
							className="hidden group-hover:inline-block"
						>
							{message.date}
						</span>
					)}
				</div>

				{/* Context Menu for Actions */}
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
		</div>
	);
};

export default ChatMessage;
