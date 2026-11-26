import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AxiosInstance } from 'axios';
import type { ReviewData } from '../../types';

type ExtraArgument = { api: AxiosInstance };

export type ReviewsState = {
  reviews: ReviewData[];
  isReviewsLoading: boolean;
  reviewError: string | null;
};

const initialState: ReviewsState = {
  reviews: [],
  isReviewsLoading: false,
  reviewError: null,
};

export const fetchReviews = createAsyncThunk<ReviewData[], string, { extra: ExtraArgument }>(
  'reviews/fetch',
  async (id, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<ReviewData[]>(`/comments/${id}`);
    return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
);

export const postReview = createAsyncThunk<
  ReviewData,
  { offerId: string; comment: string; rating: number },
  { extra: ExtraArgument; rejectValue: string }
>(
  'reviews/post',
  async ({ offerId, comment, rating }, { extra, rejectWithValue }) => {
    try {
      const { api } = extra;
      const { data } = await api.post<ReviewData>(`/comments/${offerId}`, { comment, rating });
      return data;
    } catch {
      return rejectWithValue('Не удалось отправить отзыв');
    }
  }
);

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.isReviewsLoading = true;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.isReviewsLoading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state) => {
        state.isReviewsLoading = false;
      })
      .addCase(postReview.pending, (state) => {
        state.isReviewsLoading = true;
        state.reviewError = null;
      })
      .addCase(postReview.fulfilled, (state, action) => {
        state.isReviewsLoading = false;
        state.reviews.unshift(action.payload);
      })
      .addCase(postReview.rejected, (state, action) => {
        state.isReviewsLoading = false;
        state.reviewError = action.payload || 'Ошибка отправки отзыва';
      });
  },
});

export default reviewsSlice.reducer;
