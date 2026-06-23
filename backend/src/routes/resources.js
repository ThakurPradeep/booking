const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM resources');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'failed to fetch resources' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const [rows] = await pool.query('SELECT * FROM resources WHERE id = ?', [id]);
        if (!rows.length) return res.status(404).json({ error: 'not found' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'failed' });
    }
});

module.exports = router;
