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

const checkUserExists = async (name) => {
    try {
        const [rows, fields] = await pool.query('SELECT * FROM tbl_119_USER WHERE name = ?', [name]);
        return rows.length > 0;
    } catch (err) {
        console.error('Error checking user:', err);
        throw err;
    }
};

const createUser = async (req, res) => {
    const { name, password } = req.body;

    try {
        const userExists = await checkUserExists(name);
        if (userExists) {
            return res.status(400).json({ error: 'User already exists.' });
        }

        const [result] = await pool.query('INSERT INTO tbl_119_USER (name, password) VALUES (?, ?)', [name, password]);
        console.log('User created:', result);

        res.status(201).json({ message: 'User created successfully.' });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Failed to create user.' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const [rows, fields] = await pool.query('SELECT * FROM tbl_119_USER');
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users.' });
    }
};

const loginUser = async (req, res) => {
    const { name, password } = req.body;

    try {
        const [rows, fields] = await pool.query('SELECT * FROM tbl_119_USER WHERE name = ?', [name]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const user = rows[0];
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid password.' });
        }

        res.status(200).json({ message: 'Login successful.' });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ error: 'Failed to login.' });
    }
};

const logoutUser = (req, res) => {
    res.status(200).json({ message: 'Logout successful.' });
};

module.exports = {
    createUser,
    getAllUsers,
    loginUser,
    logoutUser
};
