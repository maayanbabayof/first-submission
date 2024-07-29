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

const createUser = async (req, res) => {
    const { email, name, password, role } = req.body;

    try {
        const userExists = await checkUserExists(email, name);
        if (userExists) {
            return res.status(400).json({ error: 'User already exists.' });
        }

        const [result] = await pool.query('INSERT INTO tbl_119_USER (email, name, password, role) VALUES (?, ?, ?, ?)', [email, name, password, role]);
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
    const { email, password } = req.body;

    try {
        const [rows, fields] = await pool.query('SELECT * FROM tbl_119_USER WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const user = rows[0];
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid password.' });
        }

        const userData = {
            name: user.name,
            email: user.email,
            role: user.role,
            profilePicture: user.profilePicture
        };

        res.status(200).json({ message: 'Login successful.', user: userData });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ error: 'Failed to login.' });
    }
};


const checkUserExists = async (email, username) => {
    try {
        const [rows, fields] = await pool.query('SELECT * FROM tbl_119_USER WHERE email = ? OR name = ?', [email, username]);
        return rows.length > 0;
    } catch (err) {
        console.error('Error checking user:', err);
        throw err;
    }
};


const logoutUser = (req, res) => {
    res.status(200).json({ message: 'Logout successful.' });
};

module.exports = {
    checkRole,
    createUser,
    getAllUsers,
    loginUser,
    logoutUser
};
