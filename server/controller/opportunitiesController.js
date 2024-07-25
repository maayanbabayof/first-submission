const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DATABASE_HOSTNAME,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const getOpportunities = async (req, res) => {
    try {
        console.log(pool.user, pool.password);
        const [rows] = await pool.query('SELECT * FROM tbl_119_OPPORTUNITY');
        console.log('Opportunities fetched:', rows);
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error fetching opportunities:', err);
        res.status(500).json({ error: 'Failed to fetch opportunities.' });
    }
};

const getOpportunityById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM tbl_119_OPPORTUNITY WHERE opportunity = ?', [id]);
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ error: 'Opportunity not found' });
        }
    } catch (err) {
        console.error('Error fetching opportunity:', err);
        res.status(500).json({ error: 'Failed to fetch opportunity.' });
    }
};

module.exports = {
    getOpportunities,
    getOpportunityById
};