import { useSearchUsersQuery } from '@/redux/features/user/userApi';
import {
	IconMessage,
	IconSearch,
	IconUsersGroup,
	IconUsersPlus,
	IconX,
} from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { MovingBorder } from '../ui/MovingBorder';
import { TUser } from '@/redux/features/auth/authSlice';

const ChatSearchBar = () => {
	const [search, setSearch] = useState('');
	const [open, setOpen] = useState(false);
	const [selectedUsers, setSelectedUsers] = useState<Partial<TUser>[]>([]);
	const searchRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const { data, error, isFetching } = useSearchUsersQuery(
		search.length > 0 ? search : ''
	);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchRef.current &&
				!searchRef.current.contains(event.target as Node)
			) {
				setOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	// Handle selecting a user
	const handleSelect = (user: Partial<TUser>) => {
		if (!selectedUsers.some((u) => u._id === user._id)) {
			setSelectedUsers([...selectedUsers, user]); // Add user to selection
		}
		setSearch('');
		setOpen(false);

		// Focus the search bar for next selection
		setTimeout(() => {
			inputRef.current?.focus();
		}, 100);
	};

	// Handle removing a selected user
	const handleRemove = (userId: string) => {
		setSelectedUsers(selectedUsers.filter((user) => user._id !== userId));
	};

	// Handle pairing action
	const handlePairUsers = () => {
		if (selectedUsers.length < 2) return; // Ensure at least two users are selected

		console.log(
			'Pairing users:',
			selectedUsers.map((user) => user._id)
		);
		// TODO: Call your API to create a chat room with selectedUsers
	};

	return (
		<div
			className="relative w-full max-w-md z-10"
			ref={searchRef}
		>
			{/* Search Input */}
			<div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm">
				<IconSearch className="text-gray-500 mr-2" />
				<input
					type="text"
					placeholder="Search for a user..."
					value={search}
					ref={inputRef}
					onFocus={() => {
						setSearch(''); // Fetch all users
						setOpen(true);
					}}
					onChange={(e) => {
						setSearch(e.target.value);
						setOpen(true);
					}}
					className="w-full outline-none bg-transparent"
				/>
			</div>

			{/* Search Results Dropdown */}
			{open && (
				<div className="absolute left-0 top-full mt-2 w-full bg-white shadow-lg border border-gray-200 rounded-md overflow-hidden max-h-52 overflow-y-auto">
					{isFetching && (
						<p className="text-gray-500 p-2">Loading users...</p>
					)}
					{error && (
						<p className="text-red-500 p-2">Error fetching users</p>
					)}
					{!data?.data?.length && (
						<p className="text-gray-500 p-2">No users found.</p>
					)}
					{(data?.data as Partial<TUser>[])
						?.filter(
							(user) =>
								!selectedUsers.some((u) => u._id === user._id)
						)
						.map((user) => (
							<MovingBorder key={user._id}>
								<button
									onClick={() => handleSelect(user)}
									className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 group w-full border-0"
								>
									<img
										src={
											import.meta.env.VITE_BASE_URL +
											user.avatar
										}
										alt="Avatar"
										className="w-8 h-8 bg-white border rounded-md"
									/>
									<span
										translate="yes"
										className="text-sm"
									>
										{user.name!.firstName}{' '}
										{user.name!.lastName}
									</span>
									<IconUsersPlus className="ml-auto text-blue-500 opacity-0 translate-x-14 group-hover:translate-x-0 group-hover:opacity-100 transition" />
								</button>
							</MovingBorder>
						))}
				</div>
			)}

			{/* Selected Users */}
			{selectedUsers.length > 0 && (
				<div className="mt-3 p-2 border rounded-md bg-gray-100">
					<p className="text-sm font-semibold mb-2">
						Selected Users: {selectedUsers.length}
					</p>
					<div className="flex flex-wrap gap-1 max-h-[165px] overflow-y-auto">
						{selectedUsers.map((user) => (
							<MovingBorder key={user._id}>
								<div className="flex items-center gap-2 px-3 py-1 bg-white shadow rounded-md border">
									<img
										src={
											import.meta.env.VITE_BASE_URL +
											user.avatar
										}
										alt="Avatar"
										className="w-6 h-6 rounded-full"
									/>
									<span className="text-xs">
										{user.name!.firstName}{' '}
										{user.name!.lastName}
									</span>
									<IconX
										className="text-gray-500 cursor-pointer"
										onClick={() => handleRemove(user._id!)}
									/>
								</div>
							</MovingBorder>
						))}
					</div>
				</div>
			)}

			{/* Pair Button */}
			{selectedUsers.length > 0 && (
				<MovingBorder className="mt-3">
					<button
						onClick={handlePairUsers}
						className="w-full py-2 bg-blue-400 text-white rounded-md border-blue-500 transition flex items-center justify-between group"
					>
						{selectedUsers.length === 1 ? (
							<>
								Send Message{' '}
								<IconMessage className="-translate-x-20 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition" />
							</>
						) : (
							<>
								Create Group{' '}
								<IconUsersGroup className="-translate-x-20 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition" />
							</>
						)}
					</button>
				</MovingBorder>
			)}
		</div>
	);
};

export default ChatSearchBar;
