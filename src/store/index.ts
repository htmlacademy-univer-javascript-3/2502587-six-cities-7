import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './slices/user-slice';
import offersReducer from './slices/offers-slice';
import reviewsReducer from './slices/reviews-slice';
import { createAPI } from '../api';

const rootReducer = combineReducers({
  user: userReducer,
  offers: offersReducer,
  reviews: reviewsReducer,
});

export const api = createAPI();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: { api },
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
