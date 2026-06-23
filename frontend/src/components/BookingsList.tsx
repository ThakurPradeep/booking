import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { cancelBooking } from '../slices/bookingsSlice'

export default function BookingsList({ resourceId }: { resourceId?: number }) {
    const dispatch = useAppDispatch()
    const bookings = useAppSelector((s: any) => s.bookings.items)
    const fetchStatus = useAppSelector((s: any) => s.bookings.fetchStatus)
    const fetchError = useAppSelector((s: any) => s.bookings.fetchError)
    const [loadingId, setLoadingId] = useState<number | null>(null)

    const list = resourceId ? bookings.filter((b: any) => b.resource_id === resourceId) : bookings

    const onCancel = async (id: number) => {
        try {
            setLoadingId(id)
            await dispatch(cancelBooking(id)).unwrap()
        } catch (err) { /* ignore for now */ }
        setLoadingId(null)
    }

    if (fetchStatus === 'loading') return <div>Loading bookings...</div>
    if (fetchStatus === 'failed') return <div className="error">Error loading bookings: {fetchError}</div>
    if (!list.length) return <div className="muted">No bookings</div>
    return (
        <div className="col">
            {list.map((b: any) => (
                <div key={b.id} className="list-item">
                    <div>
                        <div style={{ fontWeight: 600 }}>{b.resource_name} — <span className="muted">{b.user_name}</span></div>
                        <div className="muted">{new Date(b.start_datetime).toLocaleString()} → {new Date(b.end_datetime).toLocaleString()}</div>
                        <div className="muted">Status: {b.status}</div>
                    </div>
                    <div>
                        {b.status === 'active' && (
                            <button className="btn warn" onClick={() => onCancel(b.id)} disabled={loadingId === b.id}>{loadingId === b.id ? 'Cancelling...' : 'Cancel'}</button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
