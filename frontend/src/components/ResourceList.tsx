import React, { useMemo, useState } from 'react'
import { useAppSelector } from '../hooks'
import ResourceDetails from './ResourceDetails'

export default function ResourceList() {
    const resources = useAppSelector(s => s.resources.items)
    const status = useAppSelector(s => s.resources.status)
    const error = useAppSelector(s => s.resources.error)
    const [q, setQ] = useState('')
    const filtered = useMemo(() => {
        if (!q) return resources
        return resources.filter((r: any) => r.name.toLowerCase().includes(q.toLowerCase()) || (r.description || '').toLowerCase().includes(q.toLowerCase()))
    }, [q, resources])

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Resources</h2>
                <input className="search" placeholder="Search resources" value={q} onChange={e => setQ(e.target.value)} />
            </div>
            <div style={{ marginTop: 12 }}>
                {status === 'loading' && <div>Loading resources...</div>}
                {status === 'failed' && <div className="error">Error loading resources: {error}</div>}
                {status !== 'loading' && filtered.length === 0 && <div className="muted">No resources found</div>}
                {filtered.map((r: any) => (
                    <div key={r.id} className="card">
                        <h3>{r.name}</h3>
                        <p className="muted">{r.description}</p>
                        <ResourceDetails resource={r} />
                    </div>
                ))}
            </div>
        </div>
    )
}
