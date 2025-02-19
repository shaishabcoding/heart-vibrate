/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { io, Socket } from 'socket.io-client';
import { logout, setToken } from '@/redux/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { baseApi } from '@/redux/api/baseApi';

interface SocketContextType {
	socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({
	socket: null,
});

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const token = useAppSelector((state) => state.auth.token);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		if (!token) return;

		// Use a global window instance to avoid duplicate connections
		if (!(window as any).socketInstance) {
			const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
				withCredentials: true,
				transports: ['websocket'],
				auth: { token },
				reconnectionAttempts: Number.MAX_SAFE_INTEGER,
				reconnectionDelay: 3_000,
			});

			newSocket.on('connect', () => {
				console.log('Socket connected:', newSocket.id);
			});

			newSocket.on('tokenExpired', async () => {
				const toastId = toast.loading('Refreshing session...');

				try {
					const response = await fetch(
						`${import.meta.env.VITE_BASE_URL}/auth/refresh-token`,
						{
							method: 'GET',
							credentials: 'include',
						}
					);

					const refreshResult = await response.json();
					const newToken = refreshResult.data?.accessToken;

					if (newToken) {
						dispatch(setToken(newToken));
						newSocket.auth = { token: newToken };
						newSocket.connect();
					} else {
						dispatch(logout());
						dispatch(baseApi.util.invalidateTags([]));
						setTimeout(() => {
							navigate('/login', { replace: true });
						}, 1000);
					}
				} catch {
					dispatch(logout());
					dispatch(baseApi.util.invalidateTags([]));
					setTimeout(() => {
						navigate('/login', { replace: true });
					}, 1000);
				} finally {
					toast.dismiss(toastId);
				}
			});

			newSocket.on('disconnect', () => {
				console.log('Socket disconnected');
			});

			(window as any).socketInstance = newSocket;
		}

		setSocket((window as any).socketInstance);
	}, [token, dispatch, navigate]);

	return (
		<SocketContext.Provider value={{ socket }}>
			{children}
		</SocketContext.Provider>
	);
};
