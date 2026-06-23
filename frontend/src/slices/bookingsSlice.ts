import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchBookings = createAsyncThunk('bookings/fetch', async () => {
    const res = await axios.get('/api/bookings')
    return res.data
})

export const createBooking = createAsyncThunk('bookings/create', async (payload: any) => {
    const res = await axios.post('/api/bookings', payload)
    return res.data
})

export const cancelBooking = createAsyncThunk('bookings/cancel', async (id: number) => {
    await axios.post(`/api/bookings/${id}/cancel`)
    return id
})

type State = {
    items: any[]
    fetchStatus: 'idle' | 'loading' | 'failed'
    createStatus: 'idle' | 'loading' | 'failed'
    cancelStatus: 'idle' | 'loading' | 'failed'
    fetchError: string | null
    createError: string | null
    cancelError: string | null
}

const initialState: State = {
    items: [],
    fetchStatus: 'idle',
    createStatus: 'idle',
    cancelStatus: 'idle',
    fetchError: null,
    createError: null,
    cancelError: null
}

const slice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchBookings.pending, state => { state.fetchStatus = 'loading'; state.fetchError = null })
        builder.addCase(fetchBookings.fulfilled, (state, action) => { state.items = action.payload; state.fetchStatus = 'idle'; state.fetchError = null })
        builder.addCase(fetchBookings.rejected, (state, action) => { state.fetchStatus = 'failed'; state.fetchError = action.error?.message || 'Failed to load bookings' })

        builder.addCase(createBooking.pending, state => { state.createStatus = 'loading'; state.createError = null })
        builder.addCase(createBooking.fulfilled, (state, action) => { state.items.push(action.payload); state.createStatus = 'idle'; state.createError = null })
        builder.addCase(createBooking.rejected, (state, action) => { state.createStatus = 'failed'; state.createError = action.error?.message || 'Failed to create booking' })

        builder.addCase(cancelBooking.pending, state => { state.cancelStatus = 'loading'; state.cancelError = null })
        builder.addCase(cancelBooking.fulfilled, (state, action) => { state.items = state.items.map((b: any) => b.id === action.payload ? { ...b, status: 'cancelled' } : b); state.cancelStatus = 'idle'; state.cancelError = null })
        builder.addCase(cancelBooking.rejected, (state, action) => { state.cancelStatus = 'failed'; state.cancelError = action.error?.message || 'Failed to cancel booking' })
    }
})

export default slice.reducer
