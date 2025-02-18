import { useState } from 'react';
import {
	Sidebar as SBar,
	SidebarBody,
	SidebarLink,
} from '@/components/ui/sidebar';
import {
	IconArrowLeft,
	IconLanguage,
	IconMessageChatbot,
	IconMessageCircle,
	IconSettings,
	IconUserBolt,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Link, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logout } from '@/redux/features/auth/authSlice';
import GoogleTranslate from '../translate/GoogleTranslate';
import { useSocket } from '@/provider/SocketProvider';

export default function Sidebar() {
	const dispatch = useAppDispatch();
	const { socket } = useSocket();
	const user = useAppSelector((state) => state.auth.user);
	const links = [
		{
			label: 'Chats',
			href: '/chat',
			icon: (
				<IconMessageCircle className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
			),
		},
		{
			label: 'Settings',
			href: '#',
			icon: (
				<IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
			),
		},
	];
	const [open, setOpen] = useState(false);
	return (
		<div
			className={cn(
				'flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-screen border border-neutral-200 dark:border-neutral-700 overflow-hidden',
				'h-full'
			)}
		>
			<SBar
				open={open}
				setOpen={setOpen}
			>
				<SidebarBody className="justify-between gap-10">
					<div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
						{open ? <Logo /> : <LogoIcon />}
						<div className="mt-8 flex flex-col gap-2">
							{links.map((link, idx) => (
								<SidebarLink
									key={idx}
									link={link}
								/>
							))}
							<div className="flex items-center">
								<IconLanguage className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0 mr-2" />
								<GoogleTranslate />
							</div>
							{user ? (
								<SidebarLink
									link={{
										label: 'Logout',
										href: '#',
										icon: (
											<IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
										),
									}}
									onClick={() => {
										dispatch(logout());
										socket?.disconnect();
									}}
								/>
							) : (
								<SidebarLink
									link={{
										label: 'Sign Up',
										href: '/signup',
										icon: (
											<IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
										),
									}}
								/>
							)}
						</div>
					</div>
					{user && (
						<div translate="no">
							<SidebarLink
								link={{
									label:
										user?.name.firstName +
										' ' +
										user?.name.lastName,
									href: '#',
									icon: (
										<img
											src={
												import.meta.env.VITE_BASE_URL +
												user?.avatar
											}
											className="h-7 w-7 flex-shrink-0 rounded-full"
											alt="Avatar"
										/>
									),
								}}
							/>
						</div>
					)}
				</SidebarBody>
			</SBar>
			<div className="w-full h-full">
				<Outlet />
			</div>
		</div>
	);
}
export const Logo = () => {
	return (
		<Link
			to="/"
			className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20 animate-vibrate"
		>
			<IconMessageChatbot />
			<motion.span
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="font-bold text-black dark:text-white whitespace-pre hover:text-blue-600"
			>
				Heart Vibrate
			</motion.span>
		</Link>
	);
};
export const LogoIcon = () => {
	return (
		<Link
			to="/"
			className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
		>
			<IconMessageChatbot />
		</Link>
	);
};
