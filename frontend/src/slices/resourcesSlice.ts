import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchResources = createAsyncThunk('resources/fetch', async () => {
    const res = await axios.get('/api/resources')
    return res.data
})

type State = { items: any[]; status: 'idle' | 'loading' | 'failed'; error: string | null }

const initialState: State = { items: [], status: 'idle', error: null }

const slice = createSlice({
    name: 'resources',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchResources.pending, state => { state.status = 'loading'; state.error = null })
        builder.addCase(fetchResources.fulfilled, (state, action) => { state.status = 'idle'; state.items = action.payload; state.error = null })
        builder.addCase(fetchResources.rejected, (state, action) => { state.status = 'failed'; state.error = action.error?.message || 'Failed to load resources' })
    }
})

export default slice.reducer
