const express = require('express')
const pool = require('../db')
const router = express.Router()

function isAdmin(req) {
    const cookie = req.headers.cookie || ''
    return cookie.includes('admin_auth=1')
}

// login
router.post('/login', async (req, res) => {
    const user = req.body.user
    const pass = req.body.pass
    const ADMIN_USER = process.env.ADMIN_USER || 'admin'
    const ADMIN_PASS = process.env.ADMIN_PASS || 'password'
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        // set simple auth cookie
        res.cookie('admin_auth', '1', { httpOnly: true, sameSite: 'strict' })
        return res.json({ ok: true })
    }
    res.status(401).json({ error: 'invalid credentials' })
})

router.post('/logout', (req, res) => {
    res.clearCookie('admin_auth')
    res.json({ ok: true })
})

// list users
router.get('/users', async (req, res) => {
    if (!isAdmin(req)) return res.status(401).json({ error: 'unauthorized' })
    try {
        const [rows] = await pool.query('SELECT id, name, email FROM users')
        res.json(rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'failed to fetch users' })
    }
})

router.post('/users', async (req, res) => {
    if (!isAdmin(req)) return res.status(401).json({ error: 'unauthorized' })
    try {
        const { name, email } = req.body
        const [result] = await pool.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email])
        res.json({ id: result.insertId, name, email })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'failed to create user' })
    }
})

router.put('/users/:id', async (req, res) => {
    if (!isAdmin(req)) return res.status(401).json({ error: 'unauthorized' })
    try {
        const id = req.params.id
        const { name, email } = req.body
        await pool.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id])
        res.json({ ok: true })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'failed to update user' })
    }
})

router.delete('/users/:id', async (req, res) => {
    if (!isAdmin(req)) return res.status(401).json({ error: 'unauthorized' })
    try {
        const id = req.params.id
        await pool.query('DELETE FROM users WHERE id = ?', [id])
        res.json({ ok: true })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'failed to delete user' })
    }
})

module.exports = router
