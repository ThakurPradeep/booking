const express = require('express');
const pool = require('../db');
const router = express.Router();
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

// GET bookings (optionally ?userId=)
router.get('/', async (req, res) => {
    try {
        const { userId } = req.query;
        let sql = 'SELECT b.*, r.name as resource_name, u.name as user_name FROM bookings b JOIN resources r ON b.resource_id=r.id JOIN users u ON b.user_id=u.id';
        let params = [];
        if (userId) {
            sql += ' WHERE b.user_id = ?';
            params.push(userId);
        }
        sql += ' ORDER BY b.start_datetime ASC';
        const [rows] = await pool.query(sql, params);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'failed to fetch bookings' });
    }
});

// Create booking with validation rules
router.post('/', async (req, res) => {
    try {
        const { user_id, resource_id, start_datetime, end_datetime } = req.body;
        // parse and normalize to UTC for consistent comparisons
        const start = dayjs.utc(start_datetime);
        const end = dayjs.utc(end_datetime);
        if (!start.isValid() || !end.isValid()) return res.status(400).json({ error: 'invalid datetimes' });
        if (start.isBefore(dayjs.utc())) return res.status(400).json({ error: 'cannot book past dates' });
        const diffMinutes = end.diff(start, 'minute');
        if (diffMinutes < 30) return res.status(400).json({ error: 'minimum booking 30 minutes' });
        if (diffMinutes > 8 * 60) return res.status(400).json({ error: 'maximum booking 8 hours' });
        if (!end.isAfter(start)) return res.status(400).json({ error: 'end must be after start' });

        // store timestamps in UTC as 'YYYY-MM-DD HH:mm:ss'
        const startDb = start.format('YYYY-MM-DD HH:mm:ss');
        const endDb = end.format('YYYY-MM-DD HH:mm:ss');

        // check overlap via DB for active bookings (safer than parsing DB values in JS)
        const overlapQuery = `SELECT COUNT(*) as c FROM bookings WHERE resource_id = ? AND status = ? AND NOT (end_datetime <= ? OR start_datetime >= ?)`;
        const [overlapRows] = await pool.query(overlapQuery, [resource_id, 'active', startDb, endDb]);
        if (overlapRows && overlapRows[0] && overlapRows[0].c > 0) {
            return res.status(400).json({ error: 'resource already booked for overlapping period' });
        }
        const [result] = await pool.query('INSERT INTO bookings (user_id, resource_id, start_datetime, end_datetime, status) VALUES (?, ?, ?, ?, ?)', [user_id, resource_id, startDb, endDb, 'active']);
        const [rows] = await pool.query('SELECT b.*, r.name as resource_name, u.name as user_name FROM bookings b JOIN resources r ON b.resource_id=r.id JOIN users u ON b.user_id=u.id WHERE b.id = ?', [result.insertId]);
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'failed to create booking' });
    }
});

// Cancel booking
router.post('/:id/cancel', async (req, res) => {
    try {
        const id = req.params.id;
        await pool.query('UPDATE bookings SET status = ? WHERE id = ?', ['cancelled', id]);
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'failed to cancel booking' });
    }
});

module.exports = router;
