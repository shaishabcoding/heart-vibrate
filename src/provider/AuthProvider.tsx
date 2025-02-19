import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';

interface AuthProviderProps {
	children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
	const token = useAppSelector((state) => state.auth.token);
	const navigate = useNavigate();

	useEffect(() => {
		if (!token) {
			navigate('/login', { replace: true });
		}
	}, [token, navigate]);

	return <>{children}</>;
};

export default AuthProvider;
