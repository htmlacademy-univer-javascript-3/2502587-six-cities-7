import { createSlice, createAsyncThunk, createSelector, type PayloadAction } from '@reduxjs/toolkit';
import type { AxiosInstance, AxiosError } from 'axios';
import { CITIES } from '../../const';
import type { City, Offer, SortType, FullOffer } from '../../types';

type ExtraArgument = { api: AxiosInstance };

export type OffersState = {
  city: City;
  offers: Offer[];
  sortType: SortType;
  isOffersLoading: boolean;
  offersError: string | null;
  offerDetails: FullOffer | null;
  nearbyOffers: Offer[];
  isOfferLoading: boolean;
  isOfferNotFound: boolean;
  currentOfferId: string | null;
};

const defaultCity = CITIES.find((city) => city.name === 'Paris') || CITIES[0];

const initialState: OffersState = {
  city: defaultCity,
  offers: [],
  sortType: 'popular',
  isOffersLoading: false,
  offersError: null,

  offerDetails: null,
  nearbyOffers: [],
  isOfferLoading: false,
  isOfferNotFound: false,
  currentOfferId: null,
};

export const fetchOffers = createAsyncThunk<Offer[], undefined, { extra: ExtraArgument; rejectValue: string }>(
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

export const fetchOfferDetails = createAsyncThunk<FullOffer, string, { extra: ExtraArgument; rejectValue: string }>(
  'offer/fetchDetails',
  async (id, { extra, rejectWithValue }) => {
    try {
      const { api } = extra;
      const { data } = await api.get<FullOffer>(`/offers/${id}`);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 404) {
        return rejectWithValue('NOT_FOUND');
      }
      return rejectWithValue('ERROR');
    }
  }
);

export const fetchNearbyOffers = createAsyncThunk<Offer[], string, { extra: ExtraArgument }>(
  'offer/fetchNearby',
  async (id, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<Offer[]>(`/offers/${id}/nearby`);
    return data;
  }
);

const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    changeCity(state, action: PayloadAction<City>) {
      state.city = action.payload;
    },
    changeSortType(state, action: PayloadAction<SortType>) {
      state.sortType = action.payload;
    },
    fillOffers(state, action: PayloadAction<Offer[]>) {
      state.offers = action.payload;
    },
    resetOfferState(state) {
      state.isOfferNotFound = false;
      state.offerDetails = null;
      state.isOfferLoading = true;
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
      .addCase(fetchOfferDetails.pending, (state) => {
        state.isOfferLoading = true;
        state.isOfferNotFound = false;
        state.offerDetails = null;
      })
      .addCase(fetchOfferDetails.fulfilled, (state, action) => {
        state.isOfferLoading = false;
        state.offerDetails = action.payload;
        state.currentOfferId = action.meta.arg;
      })
      .addCase(fetchOfferDetails.rejected, (state, action) => {
        state.isOfferLoading = false;
        state.currentOfferId = action.meta.arg;
        if (action.payload === 'NOT_FOUND') {
          state.isOfferNotFound = true;
        }
      })
      .addCase(fetchNearbyOffers.fulfilled, (state, action) => {
        state.nearbyOffers = action.payload;
      });
  },
});

export const selectSortedOffers = createSelector(
  [(state: { offers: OffersState }) => state.offers.offers, (state: { offers: OffersState }) => state.offers.city, (state: { offers: OffersState }) => state.offers.sortType],
  (offers, city, sortType) => {
    const filtered = offers.filter((offer) => offer.city.name === city.name);
    return [...filtered].sort((a, b) => {
      switch (sortType) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        default: return 0;
      }
    });
  }
);

export default offersSlice.reducer;
export const { changeCity, changeSortType, fillOffers, resetOfferState } = offersSlice.actions;
