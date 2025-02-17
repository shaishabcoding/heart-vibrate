import { createSlice } from '@reduxjs/toolkit';

export type TUserRole = 'USER' | 'ADMIN';
export type TUserGender = 'male' | 'female';
export type TUser = {
	_id: string;
	email: string;
	gender: TUserGender;
	name: {
		firstName: string;
		lastName: string;
	};
	avatar: string;
	role: TUserRole;
};

type TAuthState = {
	user: TUser | null;
	token: string | null;
};

const initialState: TAuthState = {
	user: null,
	token: null,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setUser: (state, action) => {
			const { user, token } = action.payload;

			state.user = user;
			state.token = token;
		},

		setToken: (state, action) => {
			state.token = action.payload;
		},

		logout: (state) => {
			state.token = null;
			state.user = null;
		},
	},
});

export const { logout, setUser, setToken } = authSlice.actions;
export default authSlice.reducer;
