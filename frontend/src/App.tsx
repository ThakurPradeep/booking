import React, { useEffect, useState } from 'react'
import { useAppDispatch } from './hooks'
import { fetchResources } from './slices/resourcesSlice'
import { fetchBookings } from './slices/bookingsSlice'
import ResourceList from './components/ResourceList'
import BookingsList from './components/BookingsList'
import UsersList from './components/UsersList'
import Icon from './components/Icon'

export default function App() {
    const dispatch = useAppDispatch()
    const [tab, setTab] = useState<'resources' | 'bookings' | 'users'>('resources')
    useEffect(() => { dispatch(fetchResources()); dispatch(fetchBookings()) }, [dispatch])
    return (
        <div className="app-shell">
            <header className="app-header">
                <div className="brand">
                    <div style={{ width: 40, height: 40, background: 'linear-gradient(90deg,#4f46e5,#06b6d4)', borderRadius: 8 }} />
                    <div>
                        <h1>Resource Booking</h1>
                        <p className="muted">Book rooms, equipment and more</p>
                    </div>
                </div>
                <div>
                    <small className="muted">Connected</small>
                </div>
            </header>

            <div className="layout">
                <aside className="sidebar">
                    <nav className="nav">
                        <button className={`nav-button ${tab === 'resources' ? 'active' : ''}`} onClick={() => setTab('resources')}><Icon name="resources" />Resources</button>
                        <button className={`nav-button ${tab === 'bookings' ? 'active' : ''}`} onClick={() => setTab('bookings')}><Icon name="bookings" />Bookings</button>
                        <button className={`nav-button ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}><Icon name="users" />Users</button>
                    </nav>
                </aside>

                <main className="content">
                    {tab === 'resources' && <ResourceList />}
                    {tab === 'bookings' && <div>
                        <h2>All Bookings</h2>
                        <BookingsList />
                    </div>}
                    {tab === 'users' && <UsersList />}
                </main>
            </div>
        </div>
    )
}
