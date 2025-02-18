/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { io, Socket } from 'socket.io-client';

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
	const socketRef = useRef<Socket | null>(null);

	useEffect(() => {
		// Wait until token is available
		if (!token) {
			console.warn(
				'🔐 Waiting for auth token before initializing socket...'
			);
			return;
		}

		// Ensure only one socket instance exists
		if (!socketRef.current) {
			console.log('🛜 Initializing new socket with token:', token);

			const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
				withCredentials: true,
				transports: ['websocket'],
				auth: { token },
				reconnectionAttempts: Number.MAX_SAFE_INTEGER,
				reconnectionDelay: 3_000,
			});

			newSocket.on('connect', () => {
				console.log('✅ Socket connected:', newSocket.id);
			});

			newSocket.on('disconnect', (reason) => {
				console.log('❌ Socket disconnected:', reason);
			});

			socketRef.current = newSocket;
			(window as any).socketInstance = newSocket;
		}
	}, [token]);

	return (
		<SocketContext.Provider value={{ socket: socketRef.current }}>
			{children}
		</SocketContext.Provider>
	);
};
