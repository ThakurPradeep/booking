const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
    const sql = fs.readFileSync(path.join(__dirname, 'sql', 'schema.sql'), 'utf8');
    const pool = mysql.createPool({
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        multipleStatements: true
    });
    await pool.query(sql);
    const conn = await pool.getConnection();
    await conn.query('USE booking');
    // seed sample data
    await conn.query("INSERT IGNORE INTO users (id,name,email) VALUES (1,'Alice','alice@example.com'),(2,'Bob','bob@example.com')");
    await conn.query("INSERT IGNORE INTO resources (id,name,description,capacity) VALUES (1,'Meeting Room A','Room with 8 seats',8),(2,'Company Car','Sedan',1),(3,'Projector','HD Projector',1)");
    console.log('Schema created and seeded');
    conn.release();
    process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1) });
