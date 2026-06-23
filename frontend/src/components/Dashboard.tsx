import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Dashboard() {
    const [data, setData] = useState<any>(null)
    useEffect(() => { axios.get('/api/dashboard').then(r => setData(r.data)).catch(() => { }) }, [])
    if (!data) return <div>Loading dashboard...</div>
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Overview</h2>
            </div>
            <div className="stats" style={{ marginTop: 12 }}>
                <div className="stat-card">
                    <div className="muted">Total Resources</div>
                    <div style={{ fontSize: 20, fontWeight: 600 }}>{data.totalResources}</div>
                </div>
                <div className="stat-card">
                    <div className="muted">Active Bookings</div>
                    <div style={{ fontSize: 20, fontWeight: 600 }}>{data.activeBookings}</div>
                </div>
                <div className="stat-card">
                    <div className="muted">Upcoming</div>
                    <div style={{ fontSize: 20, fontWeight: 600 }}>{data.upcomingBookings}</div>
                </div>
                <div className="stat-card">
                    <div className="muted">Cancelled</div>
                    <div style={{ fontSize: 20, fontWeight: 600 }}>{data.cancelledBookings}</div>
                </div>
            </div>
        </div>
    )
}
