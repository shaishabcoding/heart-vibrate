import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
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

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const token = useAppSelector((state) => state.auth.token);
	const socketRef = useRef<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		if (!token) return;

		// Prevent multiple socket instances
		if (!socketRef.current) {
			socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
				withCredentials: true,
				transports: ['websocket'],
				auth: { token },
			});

			socketRef.current.on('connect', () => setIsConnected(true));
			socketRef.current.on('disconnect', () => setIsConnected(false));
		}

		return () => {
			if (socketRef.current) {
				socketRef.current.disconnect();
				socketRef.current = null;
			}
		};
	}, [token]);

	return (
		<SocketContext.Provider
			value={{ socket: socketRef.current, isConnected }}
		>
			{children}
		</SocketContext.Provider>
	);
};
