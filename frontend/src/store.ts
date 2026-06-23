import { configureStore } from '@reduxjs/toolkit'
import resourcesReducer from './slices/resourcesSlice'
import bookingsReducer from './slices/bookingsSlice'
import usersReducer from './slices/usersSlice'

export const store = configureStore({
    reducer: {
        resources: resourcesReducer,
        bookings: bookingsReducer
        , users: usersReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
