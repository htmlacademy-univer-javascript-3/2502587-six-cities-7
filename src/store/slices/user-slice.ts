import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { AxiosInstance, AxiosError } from 'axios';
import { AuthorizationStatus } from '../../const';
import type { AuthStatus, UserData } from '../../types';

type ExtraArgument = { api: AxiosInstance };
type AuthData = { email: string; password: string };

export type UserState = {
  authorizationStatus: AuthStatus;
  user: UserData | null;
  authError: string | null;
};

const initialState: UserState = {
  authorizationStatus: AuthorizationStatus.Unknown,
  user: null,
  authError: null,
};

export const login = createAsyncThunk<
  UserData,
  AuthData,
  { extra: ExtraArgument; rejectValue: string }
>(
  'user/login',
  async ({ email, password }, { extra, rejectWithValue }) => {
    try {
      const { api } = extra;
      const { data } = await api.post<UserData & { token: string }>('/login', { email, password });
      localStorage.setItem('six-cities-token', data.token);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string; details?: { property: string; messages: string[] }[] }>;
      const detailMessage = axiosError.response?.data?.details?.[0]?.messages?.[0];
      return rejectWithValue(detailMessage || axiosError.response?.data?.message || 'Неверный логин или пароль');
    }
  }
);

export const checkAuth = createAsyncThunk<UserData, undefined, { extra: ExtraArgument }>(
  'user/checkAuth',
  async (_, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<UserData>('/login');
    return data;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    requireAuthorization(state, action: PayloadAction<AuthStatus>) {
      state.authorizationStatus = action.payload;
    },
    logout(state) {
      state.authorizationStatus = AuthorizationStatus.NoAuth;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.authError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.authorizationStatus = AuthorizationStatus.Auth;
      })
      .addCase(login.rejected, (state, action) => {
        state.authError = action.payload || 'Ошибка авторизации';
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.authorizationStatus = AuthorizationStatus.Auth;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
      });
  },
});

export default userSlice.reducer;
export const { requireAuthorization, logout } = userSlice.actions;
