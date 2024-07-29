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

const checkRole = (roles) => {
    return (req, res, next) => {
        const userRole = req.body.role; // Assuming the role is included in the request body or session

        if (roles.includes(userRole)) {
            next();
        } else {
            res.status(403).json({ error: 'Access denied.' });
        }
    };
};

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

const createOpportunity = async (req, res) => {
    const { title, region, city, rate, img, date, reviews } = req.body;

    try {
        const [result] = await pool.query(
            'INSERT INTO tbl_119_OPPORTUNITY (title, region, city, rate, img, date, reviews) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, region, city, rate, img, date, reviews]
        );
        res.status(201).json({ id: result.insertId, title, region, city, rate, img, date, reviews });
    } catch (err) {
        console.error('Error creating opportunity:', err);
        res.status(500).json({ error: 'Failed to create opportunity.' });
    }
};

const deleteOpportunity = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM tbl_119_OPPORTUNITY WHERE opportunity = ?', [id]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Opportunity deleted successfully.' });
        } else {
            res.status(404).json({ error: 'Opportunity not found.' });
        }
    } catch (err) {
        console.error('Error deleting opportunity:', err);
        res.status(500).json({ error: 'Failed to delete opportunity.' });
    }
};

module.exports = {
    checkRole,
    getOpportunities,
    getOpportunityById,
    createOpportunity,
    deleteOpportunity
};