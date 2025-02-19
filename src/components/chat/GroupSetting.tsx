import { useSearchUsersQuery } from '@/redux/features/user/userApi';
import {
	IconSearch,
	IconUsersPlus,
	IconX,
	IconPhoto,
	IconChecks,
	IconSettings,
} from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { MovingBorder } from '../ui/MovingBorder';
import { TUser } from '@/redux/features/auth/authSlice';
import { useAppSelector } from '@/redux/hooks';
import { useChatResolveMutation } from '@/redux/features/chat/chatApi';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTrigger,
} from '../ui/dialog';

const GroupSetting = () => {
	const [search, setSearch] = useState('');
	const [open, setOpen] = useState(false);
	const [selectedUsers, setSelectedUsers] = useState<Partial<TUser>[]>([]);
	const [groupName, setGroupName] = useState('');
	const [groupImage, setGroupImage] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const searchRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const currentUserId = useAppSelector((state) => state.auth.user?._id);
	const nagivate = useNavigate();

	const searchQuery =
		search.length > 0
			? { search, removeId: currentUserId }
			: { search: '', removeId: currentUserId };

	const { data, error, isFetching } = useSearchUsersQuery(searchQuery);

	const [chatResolve] = useChatResolveMutation();

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

	const handleChatResolve = async () => {
		setSelectedUsers([]);
		setOpen(false);

		const formData = new FormData();
		const toastId = toast.loading('Resolving chat...');

		if (groupName) formData.append('name', groupName);
		if (groupImage) formData.append('images', groupImage);
		formData.append(
			'target',
			JSON.stringify(selectedUsers.map((u) => u._id))
		);

		try {
			const { data } = await chatResolve(formData);

			nagivate(`/chat/${data.data._id}`);

			toast.success(data.message, { id: toastId });
		} finally {
			toast.dismiss(toastId);
			setGroupName('');
			setGroupImage(null);
			setPreview(null);
		}
	};

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setGroupImage(file);
			setPreview(URL.createObjectURL(file));
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<button className="flex items-center group justify-center p-2">
					<IconSettings className="w-6 h-6 group-hover:rotate-45 transition" />
				</button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<div className="p-3 border rounded-md bg-gray-100">
					<p className="text-sm font-semibold mb-2">Group Details</p>
					<MovingBorder className="mb-2">
						<input
							type="text"
							placeholder="Enter group name"
							value={groupName}
							onChange={(e) => setGroupName(e.target.value)}
							className="w-full p-2 border rounded-md bg-white outline-none"
						/>
					</MovingBorder>
					<MovingBorder>
						<label className="flex items-center gap-2 cursor-pointer overflow-x-hidden">
							<input
								type="file"
								accept="image/*"
								onChange={handleImageChange}
								className="hidden"
							/>
							{preview ? (
								<img
									src={preview}
									alt="Preview"
									className="w-10 h-10 rounded-md border bg-white object-cover"
								/>
							) : (
								<IconPhoto className="text-blue-500" />
							)}
							<span className="text-sm">
								{groupImage
									? groupImage.name
									: 'Upload group image'}
							</span>
						</label>
					</MovingBorder>
				</div>
				<div
					className="w-full"
					ref={searchRef}
				>
					{/* Search Input */}
					<MovingBorder>
						<div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm">
							<IconSearch className="text-gray-500 mr-2" />
							<input
								type="text"
								placeholder="Search for a user..."
								value={search}
								ref={inputRef}
								onFocus={() => {
									setSearch('');
									setOpen(true);
								}}
								onChange={(e) => {
									setSearch(e.target.value);
									setOpen(true);
								}}
								className="w-full outline-none bg-transparent"
							/>
						</div>
					</MovingBorder>

					{/* Search Results Dropdown */}
					{open && (
						<div className="px-2 absolute left-0 top-full mt-2 w-full">
							<div className="w-full bg-white shadow-lg border border-gray-200 rounded-md overflow-hidden max-h-52 overflow-y-auto">
								{isFetching && (
									<p className="text-gray-500 p-2">
										Loading users...
									</p>
								)}
								{!isFetching && error && (
									<p className="text-red-500 p-2">
										Error fetching users
									</p>
								)}
								{!isFetching && !data?.data?.length && (
									<p className="text-gray-500 p-2">
										No users found.
									</p>
								)}
								{(data?.data as Partial<TUser>[])
									?.filter(
										(user) =>
											!selectedUsers.some(
												(u) => u._id === user._id
											)
									)
									.map((user) => (
										<MovingBorder key={user._id}>
											<button
												translate="no"
												onClick={() =>
													handleSelect(user)
												}
												className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 group w-full border-0"
											>
												<img
													src={
														import.meta.env
															.VITE_BASE_URL +
														user.avatar
													}
													alt="Avatar"
													className="w-8 h-8 bg-white border rounded-md"
												/>
												<span
													translate="no"
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
						</div>
					)}

					{/* Selected Users */}
					{selectedUsers.length > 0 && (
						<div className="mt-3 p-2 border rounded-md bg-gray-100">
							<p className="text-sm font-semibold mb-2">
								Selected Users:{' '}
								<span translate="no">
									{selectedUsers.length}
								</span>
							</p>
							<div
								translate="no"
								className="flex flex-wrap gap-1 max-h-[165px] overflow-y-auto"
							>
								{selectedUsers.map((user) => (
									<MovingBorder key={user._id}>
										<div className="flex items-center gap-2 px-3 py-1 bg-white shadow rounded-md border">
											<img
												src={
													import.meta.env
														.VITE_BASE_URL +
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
												onClick={() =>
													handleRemove(user._id!)
												}
											/>
										</div>
									</MovingBorder>
								))}
							</div>
						</div>
					)}
				</div>
				<DialogTrigger className="p-0">
					<MovingBorder className="">
						<button
							onClick={handleChatResolve}
							className="w-full py-2 bg-blue-400 text-white rounded-md border-blue-500 transition flex items-center justify-between group"
						>
							Save
							<IconChecks className="-translate-x-20 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition" />
						</button>
					</MovingBorder>
				</DialogTrigger>
			</DialogContent>
		</Dialog>
	);
};

export default GroupSetting;
