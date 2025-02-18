/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
	socket: Socket | null;
	isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
	socket: null,
	isConnected: false,
});

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const token = useAppSelector((state) => state.auth.token);
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);

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
				setIsConnected(true);
			});

			newSocket.on('disconnect', () => {
				console.log('Socket disconnected');
				setIsConnected(false);
			});

			newSocket.emit('subscribeToInbox', {});

			newSocket.on('inboxMessageReceived', () => {
				console.log('New inbox message received');
			});

			(window as any).socketInstance = newSocket;
		}

		setSocket((window as any).socketInstance);
	}, [token]);

	return (
		<SocketContext.Provider value={{ socket, isConnected }}>
			{children}
		</SocketContext.Provider>
	);
};
