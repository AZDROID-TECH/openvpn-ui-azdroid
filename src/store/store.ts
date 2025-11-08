import { configureStore } from '@reduxjs/toolkit';
import appReducer from '../features/app/appSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
  },
});

// TypeScript üçün store-un vəziyyət (state) və dispetçer (dispatch) tiplərini çıxarırıq.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;