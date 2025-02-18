import { timeAgo } from '@/lib/timeAgo';
import { useAppSelector } from '@/redux/hooks';
import {
	IconDotsVertical,
	IconEdit,
	IconHeart,
	IconLanguage,
	IconLanguageOff,
	IconTrash,
} from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import Img from '../ui/img';

interface ChatMessageProps {
	message: any;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
	const user = useAppSelector((state) => state.auth.user);
	const isCurrentUser = message.sender?._id === user?._id;
	const [showMenu, setShowMenu] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	const [translate, setTranslate] = useState(false);
	const [displayText, setDisplayText] = useState(message.message);

	useEffect(() => {
		if (!translate) {
			setDisplayText(message.message + '\u200B');
		} else {
			setDisplayText(message.message);
		}
	}, [translate, message.message]);

	// Handle click outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node)
			) {
				setShowMenu(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div
			key={message.id}
			className={`flex my-2 items-start ${
				isCurrentUser ? 'justify-end' : 'justify-start'
			} relative`}
		>
			{/* Show Avatar Only for Other Users */}
			{!isCurrentUser && (
				<Img
					src={message.sender.avatar}
					alt="avatar"
					className="h-10 w-10 rounded-full mr-2"
				/>
			)}

			<div className="relative max-w-xs">
				<div className="flex flex-col group">
					<div className="flex items-center justify-between gap-2">
						<span
							translate="no"
							className="font-medium"
						>
							{message.sender.name.firstName}{' '}
							{message.sender.name.lastName}
						</span>
						<button
							onClick={() => setShowMenu((shown) => !shown)}
							className="p-1 active:animate-click py-0 border-0"
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
							{timeAgo(message.date)}
						</span>
					)}
				</div>

				{/* Context Menu for Actions */}
				{showMenu && (
					<div
						ref={menuRef}
						translate="yes"
						className="absolute whitespace-nowrap w-fit top-6 right-0 mt-2 bg-white dark:bg-gray-700 shadow-lg rounded-lg z-10"
					>
						<button className="flex items-center pl-2 gap-2 w-full text-left py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-none active:animate-click">
							<IconEdit /> Edit
						</button>
						<button className="flex items-center pl-2 gap-2 w-full text-left py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-none active:animate-click">
							<IconTrash /> Delete
						</button>
						<button className="flex items-center pl-2 gap-2 w-full text-left py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-none active:animate-click">
							<IconHeart /> Like
						</button>
						<button
							onClick={() => setTranslate(!translate)}
							className="flex items-center pl-2 gap-2 w-full text-left py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-none active:animate-click"
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
