import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
		// Set user and token
		setUser: (
			state,
			action: PayloadAction<{ user: TUser; token: string }>
		) => {
			state.user = action.payload.user;
			state.token = action.payload.token;
		},

		// Set only the token
		setToken: (state, action: PayloadAction<string>) => {
			state.token = action.payload;
		},

		// Clear user data and token on logout
		logout: (state) => {
			state.user = null;
			state.token = null;
		},
	},
});

export const { logout, setUser, setToken } = authSlice.actions;
export default authSlice.reducer;
