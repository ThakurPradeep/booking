import React, { useState } from 'react'
import BookingForm from './BookingForm'
import BookingsList from './BookingsList'
import Icon from './Icon'
import { useAppSelector } from '../hooks'

export default function ResourceDetails({ resource }: { resource: any }) {
    const [open, setOpen] = useState(false)
    const bookings = useAppSelector(s => s.bookings.items.filter((b: any) => b.resource_id === resource.id))
    return (
        <div>
            <div className="row" style={{ marginBottom: 8 }}>
                <div className="muted">Capacity: {resource.capacity}</div>
                <div style={{ marginLeft: 'auto' }}>
                    <button className="btn" onClick={() => setOpen(v => !v)}><Icon name={open ? 'close' : 'book'} /> {open ? 'Close' : 'Book'}</button>
                </div>
            </div>
            {open && <BookingForm resource={resource} onDone={() => setOpen(false)} />}
            <div style={{ marginTop: 12 }}>
                <h4>Bookings</h4>
                <BookingsList resourceId={resource.id} />
            </div>
        </div>
    )
}
