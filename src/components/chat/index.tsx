import { useEffect, useState } from 'react';
import { Sidebar as SBar, SidebarBody } from '@/components/ui/sidebar';
import { IconTrash } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { MovingBorder } from '../ui/MovingBorder';
import { SearchIcon } from 'lucide-react';
import ChatSearchBar from './ChatSearchBar';
import {
	useChatDeleteMutation,
	useChatRetrieveQuery,
} from '@/redux/features/chat/chatApi';
import { toast } from 'sonner';
import { useSocket } from '@/provider/SocketProvider';

export default function ChatSidebar() {
	const { data, isLoading, isError, refetch } = useChatRetrieveQuery(null);
	const [deleteChat] = useChatDeleteMutation();
	const nagivate = useNavigate();
	const param = useParams();
	const { socket } = useSocket();

	const chats = data?.data ?? [];

	const [open, setOpen] = useState(false);
	const handleDelete = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		chatId: string
	) => {
		e.preventDefault();

		const toastId = toast.loading('Deleting chat...');

		try {
			const { data } = await deleteChat(chatId);

			toast.success(data.message, { id: toastId });
		} finally {
			toast.dismiss(toastId);

			if (param.id === chatId) nagivate('/chat');
		}
	};

	useEffect(() => {
		if (socket) {
			socket.emit('subscribeToInbox');

			socket.on('inboxMessageReceived', (chatData) => {
				console.log('New inbox message:', chatData);

				refetch();
			});
		}
	}, [socket, refetch]);

	return (
		<div
			className={cn(
				'rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full border border-neutral-200 dark:border-neutral-700 overflow-hidden',
				'h-screen'
			)}
		>
			<SBar
				open={open}
				setOpen={setOpen}
			>
				<SidebarBody className="min-w-[77px] max-w-sm border-gray-200">
					<div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
						{open ? <ChatSearchBar /> : <SearchIcon />}
						<div className="mt-8 flex flex-col gap-2">
							{isLoading ? (
								<p className="text-center text-gray-500">
									Loading chats...
								</p>
							) : isError ? (
								<p className="text-center text-red-500">
									Failed to load chats
								</p>
							) : chats.length === 0 ? (
								<p className="text-center text-gray-500">
									No chats found.
									<img src="/empty.png" />
								</p>
							) : (
								chats.map(
									({
										_id,
										name,
										image,
										lastMessage = 'No message',
									}) => {
										const logo = image
											? import.meta.env.VITE_BASE_URL +
											  image
											: 'https://picsum.photos/40';

										const isRead = true;
										const isActive = false;

										return open ? (
											<MovingBorder key={_id}>
												<Link
													to={_id}
													className={`flex border active:animate-click items-center gap-2 ${
														open
															? 'p-2 rounded-md'
															: 'rounded-full p-1'
													} ${
														isRead
															? 'bg-gray-100'
															: 'bg-white'
													} dark:bg-neutral-900 transition cursor-pointer`}
												>
													<div className="relative">
														<img
															src={logo}
															alt="logo"
															className="h-10 w-10 bg-white border rounded-md"
														/>
														{isActive && (
															<div className="w-3 h-3 bg-green-500 rounded-full absolute bottom-0 right-0"></div>
														)}
													</div>

													{open && (
														<div className="flex flex-col">
															<p
																translate="no"
																className="text-sm font-semibold"
															>
																{name}
															</p>
															<p
																translate="no"
																className="text-xs text-gray-400"
															>
																{lastMessage}
															</p>
														</div>
													)}

													<div className="self-center grow flex justify-end">
														<button
															onClick={(e) =>
																handleDelete(
																	e,
																	_id
																)
															}
															className="active:animate-click aspect-square p-2 box-border hover:border-red-600 flex items-center justify-center text-red-400 bg-red-50"
														>
															<IconTrash />
														</button>
													</div>
												</Link>
											</MovingBorder>
										) : (
											<div
												className="relative"
												key={_id}
											>
												<img
													src={logo}
													alt="logo"
													className={`h-10 w-10 bg-white border rounded-md ${
														!isRead &&
														'border-4 border-blue-300'
													}`}
												/>
												{isActive && (
													<div className="w-3 h-3 bg-green-500 rounded-full absolute bottom-0 right-0"></div>
												)}
											</div>
										);
									}
								)
							)}
						</div>
					</div>
				</SidebarBody>
			</SBar>
			<div className="w-full">
				<Outlet />
			</div>
		</div>
	);
}
