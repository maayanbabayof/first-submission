const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DATABASE_HOSTNAME,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const checkRole = (roles) => {
  return (req, res, next) => {
    const userRole = req.body.role;

    if (roles.includes(userRole)) {
      next();
    } else {
      res.status(403).json({ error: "Access denied." });
    }
  };
};

const createUser = async (req, res) => {
  const { email, name, password, role } = req.body;

  try {
    const userExists = await checkUserExists(email, name);
    if (userExists) {
      return res.status(400).json({ error: "User already exists." });
    }

    const [result] = await pool.query(
      "INSERT INTO tbl_119_USER (email, name, password, role) VALUES (?, ?, ?, ?)",
      [email, name, password, role]
    );

    console.log("User created:", result);

    res.status(201).json({ message: "User created successfully." });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Failed to create user." });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const [rows, fields] = await pool.query("SELECT * FROM tbl_119_USER");
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users." });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM tbl_119_USER WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const user = rows[0];
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password." });
    }

    const userData = {
      userID: user.userID,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
    };

    res.status(200).json({ message: "Login successful.", user: userData });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: "Failed to login." });
  }
};

const checkUserExists = async (email, username) => {
  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM tbl_119_USER WHERE email = ? OR name = ?",
      [email, username]
    );
    return rows.length > 0;
  } catch (err) {
    console.error("Error checking user:", err);
    throw err;
  }
};

const logoutUser = (req, res) => {
  res.status(200).json({ message: "Logout successful." });
};

const getUserOpportunities = async (req, res) => {
  const userId = req.params.id;
  console.log(`Fetching opportunities for user ID: ${userId}`);

  try {
    const [rows] = await pool.query(
      "SELECT * FROM tbl_119_OPPORTUNITY WHERE userID = ?",
      [userId]
    );
    console.log("Opportunities fetched:", rows);
    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ error: "No opportunities found for this user." });
    }
  } catch (err) {
    console.error("Error fetching user opportunities:", err);
    res.status(500).json({ error: "Failed to fetch user opportunities." });
  }
};


const getUserApplications = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    let query;
    let params;

    if (role === "volunteer") {
      query = `
        SELECT 
          a.applicationID,
          a.farmerID,
          a.volunteerID,
          a.opportunityID,
          a.status,
          o.img AS img,
          o.title AS title,
          o.region AS region,
          o.city AS city,
          o.rate AS rating,
          o.date AS date
        FROM 
          tbl_119_APPLICATIONS a
        JOIN 
          tbl_119_OPPORTUNITY o ON a.opportunityID = o.opportunity
        WHERE 
          a.volunteerID = ?`;
      params = [userId];
    } else {
      query = `
        SELECT 
          a.applicationID,
          a.farmerID,
          a.volunteerID,
          a.opportunityID,
          a.status,
          u.city AS u_city,
          u.address AS u_address,
          u.age AS age,
          u.name AS name,
          u.phone AS phone,
          o.title AS title
        FROM 
          tbl_119_APPLICATIONS a
        JOIN 
          tbl_119_USER u ON a.volunteerID = u.userID
        JOIN 
          tbl_119_OPPORTUNITY o ON a.opportunityID = o.opportunity
        WHERE 
          a.farmerID = ?`;
      params = [userId];
    }


    const [rows] = await pool.query(query, params);
    console.log(rows);

    res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch applications." });
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM tbl_119_USER WHERE userID = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const user = rows[0];
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Failed to fetch user." });
  }
};


module.exports = {
  checkRole,
  createUser,
  getAllUsers,
  loginUser,
  logoutUser,
  getUserOpportunities,
  getUserApplications,
  getUserById,
};
