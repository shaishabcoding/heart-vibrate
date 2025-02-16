import { useEffect, useRef, useState } from 'react';
import { Sidebar as SBar, SidebarBody } from '@/components/ui/sidebar';
import { IconBrandTelegram, IconSearch, IconTrash } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { Link, Outlet } from 'react-router-dom';
import { MovingBorder } from '../ui/MovingBorder';
import { useSearchUsersQuery } from '@/redux/features/user/userApi';
import { SearchIcon } from 'lucide-react';
import ChatSearchBar from './ChatSearchBar';

const data = [
	{
		_id: 'lkdsjaflkjsdlkj',
		logo: 'https://picsum.photos/200',
		name: 'John Doe',
		lastMessage: 'Hey, how are you?',
		isActive: true,
		isRead: false,
	},
	{
		_id: 'lkdsjaflkjsdlkj',
		logo: 'https://picsum.photos/200',
		name: 'Jane Smith',
		lastMessage: 'Are you coming to the meeting?',
		isActive: false,
		isRead: true,
	},
	{
		_id: 'lkdsjaflkjsdlkj',
		logo: 'https://picsum.photos/200',
		name: 'Alice Johnson',
		lastMessage:
			"Let's catch up later. salkdfjsd klsdajfkl sdakljsdakl fjsda fklj sdkalj fklsdjafkl jsdaklfjkl dsajflk ;jsdaklfj klsdajflk dsalkfj dsklajf lkadsjkl ",
		isActive: true,
		isRead: false,
	},
	{
		_id: 'lkdsjaflkjsdlkj',
		logo: 'https://picsum.photos/200',
		name: 'Bob Brown',
		lastMessage: 'Can you send me the report?',
		isActive: false,
		isRead: true,
	},
	{
		_id: 'lkdsjaflkjsdlkj',
		logo: 'https://picsum.photos/200',
		name: 'Charlie Davis',
		lastMessage: 'Good morning!',
		isActive: true,
		isRead: false,
	},
];

export default function ChatSidebar() {
	const [open, setOpen] = useState(false);
	const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		e.preventDefault();

		console.log('Delete');
	};
	return (
		<div
			className={cn(
				'rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full border border-neutral-200 dark:border-neutral-700 overflow-hidden',
				'h-screen' // for your use case, use `h-screen` instead of `h-[60vh]`
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
							{data?.map(
								(
									{
										logo,
										lastMessage,
										name,
										isActive,
										isRead,
										_id,
									},
									idx
								) =>
									open ? (
										<MovingBorder key={idx}>
											<Link
												onClick={() =>
													console.log('Clicked')
												}
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
															{lastMessage.slice(
																0,
																20
															)}
															...
														</p>
													</div>
												)}

												<div className="self-center grow flex justify-end">
													<button
														onClick={handleDelete}
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
											key={idx}
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
