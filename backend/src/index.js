const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const resourcesRouter = require('./routes/resources');
const bookingsRouter = require('./routes/bookings');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/resources', resourcesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/users', usersRouter);

// Serve frontend static files from ../frontend/dist if present
const clientPath = path.join(__dirname, '..', '..', 'frontend', 'dist')
app.use(express.static(clientPath))
// Serve simple admin dashboard page under /admin (must be registered before SPA catch-all)
const adminPath = path.join(__dirname, 'admin')
app.use('/admin', express.static(adminPath))
app.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(adminPath, 'dashboard.html'))
})

// admin API (login, user management)
app.use('/admin/api', express.json(), adminRouter)

// SPA catch-all for frontend (serve index.html for non-API, non-admin routes)
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/admin')) return next()
    res.sendFile(path.join(clientPath, 'index.html'))
})

app.get('/api/dashboard', async (req, res) => {
    const pool = require('./db');
    try {
        const [resources] = await pool.query('SELECT COUNT(*) as total FROM resources');
        const [active] = await pool.query("SELECT COUNT(*) as active FROM bookings WHERE status='active'");
        const [upcoming] = await pool.query("SELECT COUNT(*) as upcoming FROM bookings WHERE status='active' AND start_datetime > NOW()");
        const [cancelled] = await pool.query("SELECT COUNT(*) as cancelled FROM bookings WHERE status='cancelled'");
        res.json({
            totalResources: resources[0].total || 0,
            activeBookings: active[0].active || 0,
            upcomingBookings: upcoming[0].upcoming || 0,
            cancelledBookings: cancelled[0].cancelled || 0
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'dashboard error' });
    }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Server running on port', port));
