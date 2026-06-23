import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchUsers = createAsyncThunk('users/fetch', async () => {
    const res = await axios.get('/api/users')
    return res.data
})

export const createUser = createAsyncThunk('users/create', async (payload: { name: string, email?: string }) => {
    const res = await axios.post('/api/users', payload)
    return res.data
})

type State = {
    items: any[]
    fetchStatus: 'idle' | 'loading' | 'failed'
    createStatus: 'idle' | 'loading' | 'failed'
    fetchError: string | null
    createError: string | null
}

const initialState: State = {
    items: [],
    fetchStatus: 'idle',
    createStatus: 'idle',
    fetchError: null,
    createError: null
}

const slice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchUsers.pending, state => { state.fetchStatus = 'loading'; state.fetchError = null })
        builder.addCase(fetchUsers.fulfilled, (state, action) => { state.items = action.payload; state.fetchStatus = 'idle'; state.fetchError = null })
        builder.addCase(fetchUsers.rejected, (state, action) => { state.fetchStatus = 'failed'; state.fetchError = action.error?.message || 'Failed to load users' })

        builder.addCase(createUser.pending, state => { state.createStatus = 'loading'; state.createError = null })
        builder.addCase(createUser.fulfilled, (state, action) => { state.items.push(action.payload); state.createStatus = 'idle'; state.createError = null })
        builder.addCase(createUser.rejected, (state, action) => { state.createStatus = 'failed'; state.createError = action.error?.message || 'Failed to create user' })
    }
})

export default slice.reducer
