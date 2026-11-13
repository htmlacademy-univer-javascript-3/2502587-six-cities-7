import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { AxiosInstance, AxiosError } from 'axios';
import { CITIES } from '../const';
import type { City, Offer, SortType, AuthStatus, UserData } from '../types';

export type AppState = {
  city: City;
  offers: Offer[];
  sortType: SortType;
  isOffersLoading: boolean;
  offersError: string | null;
  authorizationStatus: AuthStatus;
  user: UserData | null;
  authError: string | null;
};

type ExtraArgument = {
  api: AxiosInstance;
};

type AuthData = {
  email: string;
  password: string;
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
      const axiosError = error as AxiosError<{
        message: string;
        details?: { property: string; messages: string[] }[];
      }>;

      const detailMessage = axiosError.response?.data?.details?.[0]?.messages?.[0];

      return rejectWithValue(detailMessage || axiosError.response?.data?.message || 'Неверный логин или пароль');
    }
  }
);

export const fetchOffers = createAsyncThunk<
  Offer[],
  undefined,
  { extra: ExtraArgument; rejectValue: string }
>(
  'offers/fetchOffers',
  async (_, { extra, rejectWithValue }) => {
    try {
      const { api } = extra;
      const { data } = await api.get<Offer[]>('/offers');
      return data;
    } catch {
      return rejectWithValue('Не удалось загрузить предложения. Проверьте соединение.');
    }
  }
);

export const checkAuth = createAsyncThunk<
  UserData,
  undefined,
  { extra: ExtraArgument }
>(
  'user/checkAuth',
  async (_, { extra }) => {
    try {
      const { api } = extra;
      const { data } = await api.get<UserData>('/login');
      return data;
    } catch {
      throw new Error('Not authorized');
    }
  }
);

const defaultCity = CITIES.find((city) => city.name === 'Paris') || CITIES[0];

const initialState: AppState = {
  city: defaultCity,
  offers: [],
  sortType: 'popular',
  isOffersLoading: false,
  offersError: null,
  authorizationStatus: 'UNKNOWN',
  user: null,
  authError: null,
};

const appSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    changeCity(state, action: PayloadAction<City>) {
      state.city = action.payload;
    },
    fillOffers(state, action: PayloadAction<Offer[]>) {
      state.offers = action.payload;
    },
    changeSortType(state, action: PayloadAction<SortType>) {
      state.sortType = action.payload;
    },
    requireAuthorization(state, action: PayloadAction<AuthStatus>) {
      state.authorizationStatus = action.payload;
    },
    logout(state) {
      state.authorizationStatus = 'NO_AUTH';
      state.user = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchOffers.pending, (state) => {
        state.isOffersLoading = true;
        state.offersError = null;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.isOffersLoading = false;
        state.offers = action.payload;
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.isOffersLoading = false;
        state.offersError = action.payload || 'Неизвестная ошибка';
      })
      .addCase(login.pending, (state) => {
        state.authError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.authorizationStatus = 'AUTH';
      })
      .addCase(login.rejected, (state, action) => {
        state.authError = action.payload || 'Ошибка авторизации';
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.authorizationStatus = 'AUTH';
      })
      .addCase(checkAuth.rejected, (state) => {
        state.authorizationStatus = 'NO_AUTH';
      });
  },
});

export default appSlice.reducer;

export const { changeCity, fillOffers, changeSortType, requireAuthorization, logout } = appSlice.actions;
