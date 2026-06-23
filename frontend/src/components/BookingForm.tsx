import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { createBooking } from '../slices/bookingsSlice'

export default function BookingForm({ resource, onDone }: { resource: any, onDone: () => void }) {
    const dispatch = useAppDispatch()
    const [userId, setUserId] = useState(1)
    const [start, setStart] = useState('')
    const [end, setEnd] = useState('')
    const [error, setError] = useState<string | null>(null)
    const createStatus = useAppSelector((s: any) => s.bookings.createStatus)
    const createError = useAppSelector((s: any) => s.bookings.createError)

    const submit = async () => {
        try {
            setError(null)
            const startIso = new Date(start).toISOString()
            const endIso = new Date(end).toISOString()
            await dispatch(createBooking({ user_id: userId, resource_id: resource.id, start_datetime: startIso, end_datetime: endIso })).unwrap()
            onDone()
        } catch (err: any) { setError(err?.message || 'failed') }
    }

    return (
        <div className="card">
            <h3>Book: {resource.name}</h3>
            <div className="form-row">
                <label>Start</label>
                <input className="input" type="datetime-local" value={start} onChange={e => setStart(e.target.value)} />
            </div>
            <div className="form-row">
                <label>End</label>
                <input className="input" type="datetime-local" value={end} onChange={e => setEnd(e.target.value)} />
            </div>
            <div className="form-row">
                <label>User ID</label>
                <input className="input" type="number" value={userId} onChange={e => setUserId(Number(e.target.value))} />
            </div>
            {(error || createError) && <div className="error">{error || createError}</div>}
            <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn" onClick={submit} disabled={createStatus === 'loading'}>{createStatus === 'loading' ? 'Creating...' : 'Create Booking'}</button>
                <button className="btn secondary" onClick={onDone}>Cancel</button>
            </div>
        </div>
    )
}
