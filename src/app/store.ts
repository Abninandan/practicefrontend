import { configureStore } from '@reduxjs/toolkit'
import { adminApi } from './api'
import authReducer from './authSlice'
import dashboardReducer from './dashboardSlice'
import userReducer from './userSlice'

export const store = configureStore({
  reducer: {
    [adminApi.reducerPath]: adminApi.reducer,
    auth: authReducer,
    dashboard: dashboardReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(adminApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
