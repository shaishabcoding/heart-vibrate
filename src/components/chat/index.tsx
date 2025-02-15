import { useState } from 'react';
import { Sidebar as SBar, SidebarBody } from '@/components/ui/sidebar';
import { IconSearch, IconTrash } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Link, Outlet } from 'react-router-dom';
import { Input } from '../ui/input';
import { MovingBorder } from '../ui/MovingBorder';

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
		lastMessage: "Let's catch up later.",
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
				<SidebarBody className="min-w-fit border-gray-200">
					<div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
						{open ? <Logo /> : <LogoIcon />}
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
														className="h-10 w-10 rounded-full"
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
												className={`h-10 w-10 rounded-full ${
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

export const Logo = () => {
	return (
		<div className="font-normal flex items-center text-sm text-black py-1 relative z-20 w-full">
			<motion.span
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="font-medium text-black dark:text-white whitespace-pre grow"
			>
				<Input
					id="search"
					placeholder="Search a user"
					type="text"
					className="rounded-r-none bg-white border-r-0"
				/>
			</motion.span>
			<IconSearch className="text-neutral-700 dark:text-neutral-200 bg-white rounded-r-md drop-shadow-sm h-full px-[10px] w-10 items-center justify-center rounded-sm border hover:drop-shadow-md transition cursor-pointer hover:bg-blue-400 hover:text-white scale-95 active:animate-click" />
		</div>
	);
};

export const LogoIcon = () => {
	return (
		<Link
			to="#"
			className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20 w-full justify-center"
		>
			<IconSearch className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
		</Link>
	);
};
