import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { fetchUsers, createUser } from '../slices/usersSlice'

export default function UsersList() {
    const dispatch = useAppDispatch()
    const users = useAppSelector((s: any) => s.users.items)
    const fetchStatus = useAppSelector((s: any) => s.users.fetchStatus)
    const fetchError = useAppSelector((s: any) => s.users.fetchError)
    const createStatus = useAppSelector((s: any) => s.users.createStatus)
    const createError = useAppSelector((s: any) => s.users.createError)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')

    useEffect(() => { dispatch(fetchUsers()) }, [dispatch])

    const [localError, setLocalError] = useState<string | null>(null)
    const submit = async () => {
        setLocalError(null)
        try {
            if (!name) return setLocalError('Name is required')
            await dispatch(createUser({ name, email })).unwrap()
            setName(''); setEmail('')
        } catch (err: any) { setLocalError(err?.message || 'Failed') }
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Users</h2>
            </div>
            <div className="card">
                <div className="form-row">
                    <label>Name</label>
                    <input className="input" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="form-row">
                    <label>Email</label>
                    <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                {(localError || createError) && <div className="error">{localError || createError}</div>}
                <div>
                    <button className="btn" onClick={submit} disabled={createStatus === 'loading'}>{createStatus === 'loading' ? 'Creating...' : 'Create'}</button>
                </div>
            </div>
            <div style={{ marginTop: 12 }}>
                {fetchStatus === 'loading' && <div>Loading users...</div>}
                {fetchStatus === 'failed' && <div className="error">Error loading users: {fetchError}</div>}
                {users.map((u: any) => (
                    <div key={u.id} className="list-item">
                        <div>
                            <div style={{ fontWeight: 600 }}>{u.name}</div>
                            <div className="muted">{u.email}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
