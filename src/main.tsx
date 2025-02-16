import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import Chat from './pages/chats/Chat';
import Signup from './pages/signup/Signup';
import ChatBox from './components/chat/ChatBox';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './redux/store';
import Login from './pages/login/Login';
import { SocketProvider } from './provider/SocketProvider ';

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{
				path: 'chat',
				element: <Chat />,
				children: [
					{
						path: ':id',
						element: <ChatBox />,
					},
				],
			},
			{
				path: 'signup',
				element: <Signup />,
			},
			{
				path: 'login',
				element: <Login />,
			},
		],
	},
]);

createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<Provider {...{ store }}>
			<PersistGate
				loading="loading auth"
				persistor={persistor}
			>
				<SocketProvider>
					<RouterProvider router={router} />
				</SocketProvider>
			</PersistGate>
		</Provider>
	</React.StrictMode>
);
